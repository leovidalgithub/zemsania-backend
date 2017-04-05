'use strict';
// var async = require('async');
// var holidaysService = require('../services/holidaysService');
var mongoose = require( 'mongoose' );
var ObjectId = require( 'mongoose' ).Types.ObjectId;
var moment   = require( 'moment' );

// API - RETURNS A CALENDAR BY ITS ID / RANGE OF HOURS BY TYPE / TOTAL OF HOURS BY TYPE, BY MONTH AND BY YEAR
// IT CAN RETURNS AN SPECIFIC YEAR OR ALL YEARS INSIDE CALENDAR OBJECT. ALSO FOR MONTHS
function getCalendarById( data, onSuccess, onError ) {
    var calendarID = data.calendarID,
        month      = data.month,
        year       = data.year;

    models.Calendar.findOne( { _id: new ObjectId( calendarID ) }, function ( err, calendar ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Calendar from DB!' } );
        } else {
            var eventHours = getHours( calendar, year, month );
            onSuccess( { success: true, code: 200, msg: 'Complete Calendar object from DB and EventHours object', calendar: calendar, eventHours : eventHours } );                
        }
    });
}

// API - WHEN CALENDAR IS EDITED, IT RECEIVES IT AND REFRESH AND RETURNS ITS 'eventHours' OBJECT
function getRefreshCalendarData( calendar, onSuccess, onError ) {
    var eventHours = getHours( calendar );
    onSuccess( { success: true, code: 200, msg: 'Complete Calendar object and EventHours object refreshed', calendar: calendar, eventHours : eventHours } );        
}

// API - RETURNS ALL ENABLED CALENDARS NAME AND DESCRIPTION
function getCalendarNames( onSuccess, onError ) {
    models.Calendar.find( { "enabled" : 1 }, { "name" : 1, "description" : 1 }, function ( err, calendars ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Calendar.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Calendar', calendars : calendars } );
        }
    });
}

// ****************************************** INTERNAL FUNCTIONS ******************************************
// INTERNAL SERVICE FUNCTION USED BY getCalendarById() and getRefreshCalendarData()
// CALCULATES DEPENDS OVER PARAMETERS (one year, all years, one month, all months)
//             TOTAL OF LABORABLE HOURS PER TYPE (FRIDAY, INTENSIVE, SPECIAL, WORKING, NON-WORKING, HOLIDAYS)
//             TOTAL OF LABORABLE HOURS PER EACH YEAR AND MONTH
function getHours( calendar, year, month ) {
        var eventHours   = []; // main object
        var yearArray    = []; // array with all years required
        var monthArray   = []; // array with all months required

        // fills 'yearArray' with required year or all years available in calendar
        if ( year == 'undefined' || year == 0 ) {
            calendar.years.forEach( function( years ) {
                yearArray.push( years.year );
            });
        } else {
            yearArray.push( parseInt( year, 10 ) );
        }
        // fills 'monthArray' with required month or all month ( 0 - 11 )
        if ( month == 'undefined' ) {
            monthArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
        } else {
            monthArray.push( parseInt( month, 10 ) );
        }

        eventHours = buildEventHours( yearArray ); // to build 'EventHours' object according to required years

        // fills 'eventHours' (hours ranges) and 'eventDates' with all corresponding days
        calendar.years.forEach( function( year ) {
            if( yearArray.indexOf( year.year) != -1 ) { // inside required year(s)
                var types      = {};
                var eventDates = {};
                year.groupDays.forEach( function( type ) { // inside each type (holidays, working, etc.)
                    types[ type.type ] = [];
                    type.days.hours.forEach( function( hours ) { // saving range of hours for each type
                        types[ type.type ].push( { initialHour : hours.initialHour, endHour : hours.endHour } );                        
                    });
                    type.days.days.forEach( function( day ) { // saving all day according required month(s)
                        day = new Date( day );
                        if( monthArray.indexOf( day.getMonth() ) != -1 ) {
                            eventDates[ new Date( day ) ] = { date : new Date( day ), type : type.type };
                        }
                    });
                });
                // once all 'types' and 'eventDates' are ready, we proceed to saving into 'eventHours' object
                eventHours.forEach( function( element ) {
                    if( element.year == year.year ) {
                        element.types = types;
                        element.eventDates = eventDates;
                    }
                });    
            }
        });

        // fills 'totalPerType' object: CALCULATES TOTAL OF HOURS WORKING PER DAY FOR EACH TYPE
        eventHours.forEach( function( year ) {
            var totalPerType = {};
            for( var key in year.types ) {
                if( year.types[ key ].length ) {
                    var accumMilliseconds = 0;
                    year.types[ key ].forEach( function( element ) {
                        var start  = moment.utc( element.initialHour, "HH:mm" );
                        var end    = moment.utc( element.endHour, "HH:mm" );
                        var differ = moment.duration( end.diff( start ) );
                        accumMilliseconds += differ;
                    });
                    var tempTime = moment.duration( accumMilliseconds );
                    totalPerType[ key ] = { milliseconds: accumMilliseconds, hours : Math.floor( tempTime.asHours() ), minutes : tempTime.minutes() };
                }
            }
            // once all totalPerType-data is ready, we proceed to saving into 'eventHours' object
            eventHours.forEach( function( element ) {
                if( element.year == year.year ) {
                    element.totalPerType = totalPerType;
                }
            });
        });

        // creates and filling of 'totalWorkingHours' object
        // it stores total of milliseconds/hours/minutes for each type by month and the total in all year too
        eventHours.forEach( function( year ) {
            var totalWorkingHours = {};
                totalWorkingHours.year = {
                                        milliseconds : 0,
                                        hours : 0,
                                        minutes : 0
                                };

            for( var month = 0; month < 12; month++ ) {
                totalWorkingHours[ month ] = {
                                        milliseconds : 0,
                                        hours : 0,
                                        minutes : 0
                                };
            }
            // creates and fills 'millisecondsByType' with total of milliseconds for each type
            var millisecondsByType = {};
            for( var type in year.totalPerType ) {
                millisecondsByType[ type ] = year.totalPerType[ type ].milliseconds || 0;
            }
            // fills 'totalWorkingHours' by month with total of milliseconds by type according to days stores in 'eventDates' 
            for( var day in year.eventDates ) { // all days on current year
                var type = year.eventDates[ day ].type;
                    day  = new Date( day );
                totalWorkingHours[ day.getMonth() ][ 'milliseconds' ] += millisecondsByType[ type ] || 0 ;
            }

            // once 'totalWorkingHours' has been filled with total-hours by month, it converts millisecons into hours/minutes
            // and accumulates all milliseconds from all months to fill 'totalWorkingHours.year'
            for ( month in totalWorkingHours ) {
                var monthInMilliseconds = totalWorkingHours[ month ].milliseconds;
                if ( month != 'year' ) totalWorkingHours.year.milliseconds += monthInMilliseconds; // this is 'cause 'year' is inside the same object  
                var hoursMinutes = getHoursMinutes( moment.duration( monthInMilliseconds ) );
                var hours   = hoursMinutes.hours;
                var minutes = hoursMinutes.minutes;
                totalWorkingHours[ month ].hours   = hours;
                totalWorkingHours[ month ].minutes = minutes;
            }

            // converts millisecons into hours/minutes for 'totalWorkingHours.year' object
            var hoursMinutes = getHoursMinutes( moment.duration( totalWorkingHours.year.milliseconds ) );
            totalWorkingHours.year.hours   = hoursMinutes.hours;
            totalWorkingHours.year.minutes = hoursMinutes.minutes;

            year.totalWorkingHours = totalWorkingHours; // putting all 'totalWorkingHours' object inside 'eventHours' according the year
        });

        // internal SERVICE function. Builds de 'eventHours' main object
        function buildEventHours( yearArray ) {
            yearArray.forEach( function( year ) {
            var obj = {
                year : year,
                types : {},
                totalPerType : {},
                eventDates : {}
            };
            eventHours.push( obj );
            });
            return eventHours;
        }
        // internal SERVICE function. Get hours and minutes from milliseconds
        function getHoursMinutes( milliseconds ) {
            var tempTime = moment.duration( milliseconds );
            var hours    = Math.floor( tempTime.asHours() );
            var minutes  = tempTime.minutes();
            return {
                hours   : hours,
                minutes : minutes
            }
        }

        return eventHours;
}

// **************************************************** ********************************************************
// **************************************************** ********************************************************
// // API - RETURNS ALL AVAILABLES CALENDARS
// function getAllCalendars( onSuccess, onError ) {
//     models.Calendar.find( {}, 
//         function ( err, calendars ) {
//             if ( err ) {
//                 onError( { success: false, code: 500, msg: 'Error getting all Calendars.' } );
//             } else {
//                 onSuccess( { success: true, code: 200, msg: 'All Calendars', calendars: calendars } );
//             }
//     });
// }
// **************************************************** ********************************************************
// API - RETURNS A SPECIFIC MONTH/YEAR CALENDAR BY ITS ID
// function getCalendarByIdByMonth( data, onSuccess, onError ) {
//     var calendarID = data.calendarID, 
//         month = data.month,
//         year = data.year;
//     models.Calendar.findOne( { _id: new ObjectId( calendarID ) }, function ( err, calendar ) {
//         if ( err ) {
//             onError( { success: false, code: 500, msg: 'Error getting Calendar.' } );
//         } else {
//             var eventDates = [];
//             var months     = [ 'january' ,'february' ,'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ];
//             calendar.groupDays.forEach( function( groupDay ) {
//                 groupDay.days.days.forEach( function( day ) {
//                     day = new Date( day );
//                     if( day.getMonth() == month && day.getFullYear() == year ) {
//                         eventDates.push({
//                                             day   : day,
//                                             type  : groupDay.type
//                         })
//                     } 
//                 });
//             });
//             onSuccess( { success: true, code: 200, msg: 'Calendar month', month : months[month], year : year, eventDates : eventDates } );
//         }
//     });
// }
// **************************************************** ********************************************************
// /*
//  * Saca todos los calendarios
//  */
// function getAllNameCalendar(onSuccess) {
//     models.Calendar.find({enabled: true}, {
//         bankHoliDays: 0,
//         nonWorkingDays: 0,
//         intensiveDays: 0,
//         specialDays: 0,
//         enabled: 0,
//         createdAt: 0
//     }, function (err, calendars) {
//         if (err) throw err;
//         onSuccess(calendars);
//     });
// }
// **************************************************** ********************************************************
// /*
//  * Saca el calendario
//  */
// function getCalendar(calendarId, onSuccess) {
//     models.Calendar.findOne({_id: new ObjectId(calendarId)}, function (err, calendar) {
//         if (err) throw err;
//         onSuccess({success: true, calendar: calendar});
//     });
// }
// **************************************************** ********************************************************
// /*
//  * Inserta un nuevo calendario
//  */
// function saveCalendar(form, onSuccess) {
//     if (form._id) {
//         models.Calendar.findOneAndUpdate({_id: new ObjectId(form._id)}, form, function (err, doc) {
//             if (err) {
//                 return res.send(500, {error: err});
//             }
//         });
//     } else {
//         var project = new models.Calendar(form);
//         project.save();
//     }
//     onSuccess({success: true});
// }
// **************************************************** ********************************************************
// /**
//  * Elimina el calendario
//  **/
// function deleteCalendar(calendarId, onSuccess, onError) {
//     models.Calendar.findOneAndUpdate({_id: new ObjectId(calendarId)}, {enable: false}, function (err, result) {
//         if (!err && result > 0) {
//             console.log('Calendar %s deleted successfully');
//             onSuccess({success: true});
//         } else if (err) {
//             throw err
//         } else {
//             onError({error: 'Calendar  not found'});
//         }
//     });
// }
// **************************************************** ********************************************************
// /**
//  * Busca el calendario de un usuario
//  **/
// function getCalendarByUserID(userId, onSuccess, onError) {
//     models.CalendarUser.findOne({userId: new ObjectId(userId)}, function (err, calendarUser) {
//         if (err)
//             throw err
//         if (calendarUser) {
//             var calendarUserObject = calendarUser.toObject();
//             getCalendar(calendarUserObject.calendarId, function (calendarResult) {
//                 calendarUserObject.bankHoliDays = calendarResult.calendar.bankHoliDays;
//                 calendarUserObject.nonWorkingDays = calendarResult.calendar.nonWorkingDays;
//                 calendarUserObject.intensiveDays = calendarResult.calendar.intensiveDays;
//                 calendarUserObject.specialDays = calendarResult.calendar.specialDays;
//                 holidaysService.getHolidaysByUserID(userId, function (holidaysResult) {
//                     var holidays = holidaysResult.holidays;
//                     if (holidays) {
//                         calendarUserObject.holidays = holidays;
//                     }
//                     onSuccess({success: true, calendar: calendarUserObject});
//                 }, onError);
//             });
//         } else {
//             onSuccess({success: false, error: 'Calendar User not found'});
//         }
//     });
// }
// **************************************************** ********************************************************
// /**
//  * Busca los dias bloqueados para un usuario
//  **/
// function getDaysBlockedByUserID(userId, onSuccess) {
//     var daysBlocked = [];
//     var dayWorkingDays = [];
//     models.CalendarUser.findOne({userId: new ObjectId(userId)}, function (err, calendarUser) {
//         if (err)
//             throw err
//         if (calendarUser) {
//             var calendarUserObject = calendarUser.toObject();
//             daysBlocked.push.apply(daysBlocked, calendarUser.bankHoliDaysUser);
//             daysBlocked.push.apply(daysBlocked, calendarUser.specialDaysUser);
//             dayWorkingDays.push.apply(dayWorkingDays, calendarUser.nonWorkingDaysUser);
//             getCalendar(calendarUserObject.calendarId, function (calendarResult) {
//                 daysBlocked.push.apply(daysBlocked, calendarResult.calendar.bankHoliDays);
//                 daysBlocked.push.apply(daysBlocked, calendarResult.calendar.specialDays);
//                 dayWorkingDays.push.apply(dayWorkingDays, calendarResult.calendar.nonWorkingDays);
//                 holidaysService.getHolidaysDatesByUserID(userId, function (holidaysResult) {
//                     var holidays = holidaysResult.holidays;
//                     if (holidays) {
//                         daysBlocked.push.apply(daysBlocked, holidays);
//                     }
//                     onSuccess({success: true, daysBlocked: daysBlocked, dayWorkingDays: dayWorkingDays});
//                 });
//             });
//         } else {
//             onSuccess({success: false, error: 'Calendar User not found'});
//         }
//     });
// }
// **************************************************** ********************************************************
// /*
//  * Inserta un nuevo calendario
//  */
// function saveCalendarUser(form, onSuccess) {
//     if (form._id) {
//         models.CalendarUser.findOneAndUpdate({_id: new ObjectId(form._id)}, form, function (err, doc) {
//             if (err) {
//                 return res.send(500, {error: err});
//             }
//         });
//     } else {
//         var calendarUser = new models.CalendarUser(form);
//         calendarUser.save();
//     }
//     onSuccess({success: true});
// }
// **************************************************** ********************************************************
// /**
//  * Elimina el calendario
//  **/
// function deleteCalendarUser(calendarUserId, onSuccess, onError) {
//     models.CalendarUser.remove({_id: new ObjectId(calendarUserId)}, function (err, result) {
//         if (!err && result > 0) {
//             console.log('Calendar User %s deleted successfully');
//             onSuccess({success: true});
//         } else if (err) {
//             throw err
//         } else {
//             onError({error: 'Calendar User not found'});
//         }
//     });
// }

module.exports = {
    getCalendarById        : getCalendarById,
    getCalendarNames       : getCalendarNames,
    getRefreshCalendarData : getRefreshCalendarData
    // getAllNameCalendar: getAllNameCalendar,
    // getCalendar: getCalendar,
    // saveCalendar: saveCalendar,
    // deleteCalendar: deleteCalendar,
    // getCalendarByUserID: getCalendarByUserID,
    // getDaysBlockedByUserID: getDaysBlockedByUserID,
    // saveCalendarUser: saveCalendarUser,
    // deleteCalendarUser: deleteCalendarUser
};

