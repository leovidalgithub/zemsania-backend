var requires = require('../requires.js');
var models = requires.models;
var notificationService = require('../../app/services/notificationService.js');

describe('Testing notificationService', function () {
    describe('getNotifications', function () {
        it('Should get Notifications from a user', function () {
            models.Notification.find = function (user, callback) {
                callback();
            };
            global.models = models;

            notificationService.getNotifications('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getNotifications', function () {
        it('Should get Notifications Unread from a user', function () {
            models.Notification.find = function (user, callback) {
                callback();
            };
            global.models = models;

            notificationService.getNotificationsUnread('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('markNotificationsReaded', function () {
        it('Should mark Notifications Readed from a user', function () {
            models.Notification.findOne = function (user, callback) {
                callback(null, {
                    save: function () {
                    }
                });
            };
            models.Notification.prototype.save = function () {
            };
            global.models = models;

            notificationService.markNotificationsReaded('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
});