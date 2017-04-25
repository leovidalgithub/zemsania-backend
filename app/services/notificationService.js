var mongoose = require( 'mongoose' );
var ObjectId = require( 'mongoose' ).Types.ObjectId;
// var express = require( 'express' );
// var router  = express.Router();
// var async   = require( 'async' );
// var mailService = require( './mailService' );
// var passwordHash = require( 'password-hash' );
// var moment   = require( 'moment' );

// RETURN ALL UNREAD NOTIFICATIONS BY USER
function getNotificationsUnread( userId, onSuccess, onError ) { // LEO WORKING HERE
    models.Notification.find( {
        receiverId : new ObjectId( userId ), status: constants.notification_status_unread } )
        .populate( 'senderId','name surname' )
        .exec( function ( err, notifications ) {
            if ( err ) {
                onError( { success: false, code: 500, msg: 'Error getting Notifications!', err : err } );
            } else if ( notifications ) {
                onSuccess( { success: true, code: 200, msg: 'User Unread Notifications!', notifications : notifications } );
            } else {
                onSuccess( { success: false, code: 501, msg: 'User Unread Notifications not found!', notifications : null } );                        
            }
    });
}

// ***************************************************** *****************************************************

/*
 * Sacar todas las notificaciones del usuario
 */
// function getNotifications(userId, onSuccess, onError) {
//     models.Notification.find({
//         receiverId: new ObjectId(userId)
//     }, function (err, notifications) {
//         if (err) throw err;
//         onSuccess({success: true, notifications: notifications});
//     });
// }
/*
 * Marca como leida la notificación.
 */
// function markNotificationsReaded(receiverId, notificationId, onSuccess, onError) {
//     models.Notification.findOne({
//         _id: new ObjectId(notificationId), receiverId: new ObjectId(receiverId)
//     }, function (err, notification) {
//         if (err) throw err;
//         if (notification) {
//             notification.status = constants.notification_status_read;
//             notification.save(function (err) {
//                 if (err) throw err;
//             });
//         }
//     });
//     onSuccess({success: true});
// }

// function createNotification(senderId, receiverId, type, text, initDate, endDate) {
//     var notification = new models.Notification();
//     notification.senderId = senderId;
//     notification.receiverId = receiverId;
//     notification.type = type;
//     notification.status = constants.notification_status_unread;
//     notification.text = text;
//     notification.initDate = initDate;
//     notification.endDate = endDate;
//     notification.save(function (err) {
//         if (err) throw err;
//     });
// }

module.exports = {
    // getNotifications: getNotifications,
    getNotificationsUnread: getNotificationsUnread
    // markNotificationsReaded: markNotificationsReaded,
    // createNotification: createNotification
};

