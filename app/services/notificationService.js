var mongoose = require( 'mongoose' );
var ObjectId = require( 'mongoose' ).Types.ObjectId;
var async    = require( 'async' );
// var express = require( 'express' );
// var router  = express.Router();
// var mailService = require( './mailService' );
// var passwordHash = require( 'password-hash' );
// var moment   = require( 'moment' );

// RETURN ALL NOTIFICATIONS BY USER ID
function getAllNotifications( userId, onSuccess, onError ) { // LEO WAS HERE
    models.Notification.find( { receiverId : new ObjectId( userId ) } )
        .populate( 'senderId','name surname' )
        .exec( function ( err, notifications ) {
            if ( err ) {
                onError( { success: false, code: 500, msg: 'Error getting Notifications!', err : err } );
            } else if ( notifications ) {
                onSuccess( { success: true, code: 200, msg: 'User Notifications!', notifications : notifications } );
            } else {
                onSuccess( { success: false, code: 501, msg: 'User Notifications not found!', notifications : null } );                        
            }
    });
}

// API
// INSERTS A NEW NOTIFICATION
function insertNewNotification( data, onSuccess, onError ) { // LEO WAS HERE
    var senderId       = data.senderId;
    var receiverId     = data.receiverId;
    var type           = data.type;
    var text           = data.text;
    var issueDateArray = data.issueDate;
    // it cannot be exist two notifications repetead.
    // 'issueDateArray' contains an array of month/year object

    async.each( issueDateArray, function( date, callback ) {
        models.Notification.findOne( {
                                    $and: [
                                        { 'issueDate.month' : date.month },
                                        { 'issueDate.year'  : date.year },
                                        { senderId          : new ObjectId( senderId ) },
                                        { receiverId        : new ObjectId( receiverId ) },
                                        { type              : type },
                                        { text              : text }
                                       ]
            })
            .exec( function( err, notification ) {
                if( err ) { // error finding notification
                    callback( 'Error finding notification document!' );
                } else if ( notification ) { // notification found, so we do nothing
                    callback( null );
                } else { // notification not found, so we insert a new one
                    var newNotification = new models.Notification ({
                        senderId: senderId,
                        receiverId: receiverId,
                        type: type,
                        status: constants.notification_status_unread,
                        text: text,
                        issueDate: date
                    });
                    newNotification.save( function( err, notification ) {
                        if ( err ) {
                            callback( 'Error saving the new Notification document!' );
                        } else {
                            callback( null );
                        }
                    });
                }
            });
    }, function( err ) { // callback when all done
        if( err ) {
            onError( { success: false, code: 500, msg: 'Error setting Notifications!', err : err } );
        } else {
            onSuccess( { success: true, msg: 'Notifications saved corretly!' } );
        }
    });
}

// SET A NOTIFICATION AS READ
function markNotificationsReaded( notificationId, onSuccess, onError ) { // LEO WAS HERE
    models.Notification.findOne( { _id: new ObjectId( notificationId ) }, function ( err, notification ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error finding notification to set as read!', err : err } );
        } else if ( notification ) {
            notification.status = constants.notification_status_read;
            notification.save( function ( err ) {
                if ( err ) {
                    onError( { success: false, code: 501, msg: 'Error saving notification to set as read!', err : err } );
                } else {
                    onSuccess( { success: true, code: 200, msg: 'Notification set as read!', notification : notification } );
                }
            });            
        } else {
            onSuccess( { success: false, code: 200, msg: 'Notification not found!', notification : null } );
        }
    });
}

// ***************************************************** *****************************************************

// // RETURN ALL UNREAD NOTIFICATIONS BY USER
// function getNotificationsUnread( userId, onSuccess, onError ) { // LEO WORKING HERE
//     models.Notification.find( {
//         receiverId : new ObjectId( userId ), status: constants.notification_status_unread } )
//         .populate( 'senderId','name surname' )
//         .exec( function ( err, notifications ) {
//             if ( err ) {
//                 onError( { success: false, code: 500, msg: 'Error getting Notifications!', err : err } );
//             } else if ( notifications ) {
//                 onSuccess( { success: true, code: 200, msg: 'User Unread Notifications!', notifications : notifications } );
//             } else {
//                 onSuccess( { success: false, code: 501, msg: 'User Unread Notifications not found!', notifications : null } );                        
//             }
//     });
// }

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

module.exports = {
    getAllNotifications: getAllNotifications,
    insertNewNotification: insertNewNotification,
    markNotificationsReaded: markNotificationsReaded
    // getNotificationsUnread: getNotificationsUnread,
    // getNotifications: getNotifications,
};

