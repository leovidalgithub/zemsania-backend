var express = require('express');
var router = express.Router();
var async = require('async');
var mailService = require('./mailService');
var passwordHash = require('password-hash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');

/*
 * Sacar todas las notificaciones del usuario
 */
function getNotifications(userId, onSuccess, onError) {

    models.Notification.find({
        receiverId: new ObjectId(userId)
    }, function (err, notifications) {
        if (err) throw err;
        onSuccess({success: true, notifications: notifications});
    });
}


/*
 * Sacar todos los usuarios
 */
function getNotificationsUnread(userId, onSuccess, onError) {
    models.Notification.find({
        receiverId: new ObjectId(userId), status: constants.unread
    }, function (err, notifications) {
        if (err) throw err;
        onSuccess({success: true, notifications: notifications});
    });
}

/*
 * Marca como leida la notificación.
 */
function markNotificationsReaded(receiverId, notificationId, onSuccess, onError) {
    models.Notification.findOne({
        _id: new ObjectId(notificationId), receiverId: new ObjectId(receiverId)
    }, function (err, notification) {
        if (err) throw err;
        if (notification) {
            notification.status = constants.read;
            notification.save(function (err) {
                if (err) throw err;
            });
        }
    });
    onSuccess({success: true});
}

function createNotification(senderId, receiverId, type, text, initDate, endDate) {
    var notification = new models.Notification();
    notification.senderId = senderId;
    notification.receiverId = receiverId;
    notification.type = type;
    notification.status = constants.unread;
    notification.text = text;
    notification.initDate = initDate;
    notification.endDate = endDate;
    notification.save(function (err) {
        if (err) throw err;
    });
}

module.exports = {
    getNotifications: getNotifications,
    getNotificationsUnread: getNotificationsUnread,
    markNotificationsReaded: markNotificationsReaded,
    createNotification: createNotification
};

