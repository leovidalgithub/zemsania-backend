'use strict';
// var async = require('async');
var mongoose = require('mongoose');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;
// var holidaysService = require('../services/holidaysService');

/*
 * Returns all availables calendars
 */
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

/*
 * Returns calendar by its ID
 */
function getCalendarById( calendarID, onSuccess, onError ) {
    models.Calendar.findOne( {_id: new ObjectId( calendarID ) }, function ( err, calendar ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Calendar.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Calendar', calendar: calendar } );
        }
    });
}

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

