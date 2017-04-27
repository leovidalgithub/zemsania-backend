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
// API
// INSERTS A NEW NOTIFICATION
function insertNewNotification( data, onSuccess, onError ) {
    var senderId   = data.senderId;
    var receiverId = data.receiverId;
    var type       = data.type;
    var text       = data.text;

    var newNotification = new models.Notification ({
        senderId: senderId,
        receiverId: receiverId,
        type: type,
        status: constants.notification_status_unread,
        text: text
    });

    // console.log(newNotification);
    // onSuccess( { success: true, code: 200, msg: 'New Notification saved!' } );
    // return;
    
    newNotification.save( function( err, notification ) {
        if ( err ) {
        } else if ( notification ) {
            onSuccess( { success: true, code: 200, msg: 'New Notification saved!', notification : notification } );
        } else {
            onError( { success: false, code: 500, msg: 'Error saving new Notifications!', err : err } );
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

module.exports = {
    getNotificationsUnread: getNotificationsUnread,
    insertNewNotification: insertNewNotification
    // getNotifications: getNotifications,
    // markNotificationsReaded: markNotificationsReaded,
};

