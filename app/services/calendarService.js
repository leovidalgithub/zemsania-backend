'use strict';
// var async = require('async');
// var holidaysService = require('../services/holidaysService');
var mongoose = require( 'mongoose' );
var ObjectId = require( 'mongoose' ).Types.ObjectId;
var moment   = require( 'moment' );

// RETURNS ALL AVAILABLES CALENDARS
function getAllCalendars( onSuccess, onError ) {
    models.Calendar.find( {}, 
        function ( err, calendars ) {
            if ( err ) {
                onError( { success: false, code: 500, msg: 'Error getting all Calendars.' } );
            } else {
                onSuccess( { success: true, code: 200, msg: 'All Calendars', calendars: calendars } );
            }
    });
}

// RETURNS CALENDAR BY ITS ID / RANGE OF HOURS BY TYPE / TOTAL OF HOURS BY TYPE
function getCalendarById( calendarID, onSuccess, onError ) {
    models.Calendar.findOne( { _id: new ObjectId( calendarID ) }, function ( err, calendar ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Calendar.' } );
        } else {
            var eventHours = getHours( calendar );
            onSuccess( { success: true, code: 200, msg: 'Calendar', calendar: calendar, eventHours : eventHours } );                
        }
    });
}

function getHours( calendar ) {
        var eventDates   = {};
        var eventHours   = {};
        var totalPerType = {};
        eventHours[ 'holidays'     ] = [];
        eventHours[ 'working'      ] = [];
        eventHours[ 'friday'       ] = [];
        eventHours[ 'non_working'  ] = [];
        eventHours[ 'intensive'    ] = [];
        eventHours[ 'special'      ] = [];
        eventHours[ 'totalPerType' ] = {};
        eventHours[ 'eventDates'   ] = {};

        calendar.groupDays.forEach( function( element ) {
            element.days.hours.forEach( function( hours ) {
                eventHours[ element.type ].push( { initialHour : hours.initialHour, endHour : hours.endHour } );
            });
            element.days.days.forEach( function( day ) {
                eventDates[ new Date( day ) ] = { date : new Date( day ), type : element.type };
            });
        });

        for( var key in eventHours ) {
            if( eventHours[ key ].length ) {
                var accumMilliseconds = 0;
                eventHours[ key ].forEach( function( element ) {
                    var start  = moment.utc( element.initialHour, "HH:mm" );
                    var end    = moment.utc( element.endHour, "HH:mm" );
                    var differ = moment.duration( end.diff( start ) );
                    accumMilliseconds += differ;
                });

                var tempTime = moment.duration( accumMilliseconds );
                totalPerType[ key ] = { milliseconds: accumMilliseconds, hours : Math.floor( tempTime.asHours() ), minutes : tempTime.minutes() };
            }
        }

        eventHours[ 'totalPerType'  ] = totalPerType;
        eventHours[ 'eventDates'    ] = eventDates;

        // calculating all hours and minutes from all years month by month
        eventHours.totalPerYear = {};
        var years = getYearsArray( eventDates ); // array of all years inside calendar
        for( var i = 0; i < years.length; i++ ) { // 2017
            var currentYear = years[i];
            eventHours.totalPerYear[ currentYear ] = {};
            var accumMonth = 0;
            for ( var currentMonth = 0; currentMonth < 12; currentMonth++ ) { // currentMonth
                for ( var date in eventDates ) { // all dates
                    var thisDate = new Date( date );
                    if ( thisDate.getFullYear() == currentYear && thisDate.getMonth() == currentMonth ) {
                        var type = eventDates[ date ].type;
                        if ( eventHours.totalPerType[ type ] ) { // no holidays nor non_working
                            accumMonth += eventHours.totalPerType[ type ].milliseconds;
                        }
                    }
                } // all dates

            var tempTime = moment.duration( accumMonth );
            var hours = Math.floor( tempTime.asHours() );
            var minutes = tempTime.minutes();
            eventHours.totalPerYear[ currentYear ][ currentMonth ] = { hours : hours, minutes : minutes };
            accumMonth = 0;
            } // currentMonth
        } // year

    return eventHours;
}

function getYearsArray( eventDates ) {
        var years = []; // array of all years inside calendar
        for( var key in eventDates ) {
            var year = new Date( key ).getFullYear();
            if ( years.indexOf( year ) == -1 ) {
                years.push( year );
            }
        }
        return years;
}


// *******************************************************************************************************************
// *******************************************************************************************************************
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


// /*
//  * Saca el calendario
//  */
// function getCalendar(calendarId, onSuccess) {
//     models.Calendar.findOne({_id: new ObjectId(calendarId)}, function (err, calendar) {
//         if (err) throw err;
//         onSuccess({success: true, calendar: calendar});
//     });
// }


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
    getAllCalendars: getAllCalendars,
    getCalendarById: getCalendarById
    // getAllNameCalendar: getAllNameCalendar,
    // getCalendar: getCalendar,
    // saveCalendar: saveCalendar,
    // deleteCalendar: deleteCalendar,
    // getCalendarByUserID: getCalendarByUserID,
    // getDaysBlockedByUserID: getDaysBlockedByUserID,
    // saveCalendarUser: saveCalendarUser,
    // deleteCalendarUser: deleteCalendarUser
};

