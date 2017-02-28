var requires = require('../requires.js');
var models = requires.models;
var userService = require('../../app/services/userService.js');

describe('Testing userService', function () {
    describe('getAllUsers', function () {
        it('Should get all users', function () {
            models.User.find = function (query, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            userService.getAllUsers(function (response) {
                expect(response.success).toBe(true);
                expect(response.users.length).toBeGreaterThan(0);
            });
        });
    });

    describe('getProfile', function () {
        it('Should get a user profile', function () {
            models.User.findOne = function findOne(query, callback) {
                callback(null, {});
            };
            global.models = models;

            userService.getProfile('123456789012', function (response) {
                expect(response).toBeDefined();
            });
        });
        it('Should fail at get a user profile', function () {
            models.User.findOne = function findOne(query, callback) {
                callback(null, null);
            };
            global.models = models;

            userService.getProfile('123456789012', function (response) {
                expect(response.success).toBe(false);
                //expect(response.msg).toBe('User not found.');
            });
        });
    });

    describe('updateProfile', function () {
        it('Should update profile', function () {
            models.User.findOne = function findOne(query, callback) {
                callback(null, {
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;

            var form = {
                roles: ['ROLE_USER']
            };

            userService.updateProfile('123456789012', form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should update profile', function () {
            models.User.findOne = function findOne(query, callback) {
                callback(null, null);
            };
            global.models = models;

            userService.updateProfile('123456789012', {}, function (response) {
                expect(response.success).toBe(false);
            });
        });
    });

    describe('searchUsers', function () {
        it('Should search a user', function () {
            models.User.aggregate = function (aggregate, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            var form = {
                username: 'aa',
                _id: '123456789012',
                name: 'aa',
                surname: 'aa',
                nif: 'aa',
                enabled: 'aa',
                activated: 'aa',
                page: 0,
                rows: 0
            };

            userService.searchUsers(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('changePassword', function () {
        it('Should change user password', function () {
            models.User.findOne = function (aggregate, callback) {
                callback(null, {
                    password: 'sha1$a41d37f5$1$1a9e9bb809891c005dea7a72df8d48cc46778196',
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;

            var form = {
                oldPassword: '1234',
                newPassword: '12345'
            };

            userService.changePassword('123456789012', form, function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should fail change user password old password invalid', function () {
            models.User.findOne = function (aggregate, callback) {
                callback(null, {
                    password: 'sha1$a41d37f5$1$1a9e9bb809891c005dea7a72df8d48cc46778196',
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;

            var form = {
                oldPassword: 'invalid_old_password',
                newPassword: '12345'
            };

            userService.changePassword('123456789012', form, function (response) {
                expect(response.success).toBe(false);
            });
        });

        it('Should fail change user password user not found', function () {
            models.User.findOne = function (aggregate, callback) {
                callback(null, null);
            };
            global.models = models;

            userService.changePassword('123456789012', null, function (response) {
                expect(response.success).toBe(false);
            });
        });
    });

    describe('deleteUser', function () {
        it('Should delete a user', function () {
            models.User.findOneAndUpdate = function (user, params,  callback) {
                callback(null, 1);
            };
            global.models = models;

            userService.deleteUser('123456789012', null, function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should fail at delete a user', function () {
            models.User.findOneAndUpdate = function (user, params,  callback) {
                callback(null, 0);
            };
            global.models = models;

            userService.deleteUser('123456789012', null, null, function (response) {
                expect(response.error).toBe('User not found');
            });
        });
    });
});
