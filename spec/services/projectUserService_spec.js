var requires = require('../requires.js');
var models = requires.models;
var projectUsersService = require('../../app/services/projectUsersService.js');

describe('Testing projectUsersService', function () {
    describe('deleteProjectUser', function () {
        it('Should fail at deleteProjectUser true', function () {
            models.ProjectUsers.remove = function (projectUser, callback) {
                callback(null, 0);
            };
            global.models = models;
            projectUsersService.deleteProjectUser('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at deleteProjectUser true', function () {
            models.ProjectUsers.remove = function (projectUser, callback) {
                callback(true, null);
            };
            global.models = models;
            projectUsersService.deleteProjectUser('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('saveProjectUser', function () {
        it('Should save project', function () {
            models.ProjectUsers.findOneAndUpdate = function findOneAndUpdate(query, p1, p2, callback) {
                callback(null, {
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;
            var form = {_id: '123456789012'};
            projectUsersService.saveProjectUser(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should save project', function () {
            models.ProjectUsers.findOneAndUpdate = function findOneAndUpdate(query, p1, p2, callback) {
                callback(true, null);
            };
            global.models = models;
            var form = {_id: '123456789012'};
            projectUsersService.saveProjectUser(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should save project', function () {
            models.ProjectUsers.save = function findOneAndUpdate(query, p1, p2, callback) {
                callback(null, {
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;
            projectUsersService.saveProjectUser({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('searchProjectUsers', function () {
        it('Should search a projectUser', function () {
            models.ProjectUsers.aggregate = function (aggregate, callback) {
                callback(null, [{}]);
            };
            global.models = models;
            var form = {
                projectId: 'aa',
                userId: 'aa',
                initDate: 'aa',
                endDate: 'aa',
                enabled: true,
                status: true,
                _id: '123456789012',
                page: 0,
                rows: 0
            };

            projectUsersService.searchProjectUsers(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getUsersBySupervisor', function () {
        it('Should getUsersBySupervisor Success', function () {
            models.Project.find = function (aggregate, callback) {
                callback(null, [{_id: '123456789012'}]);
            };
            models.ProjectUsers.find = function (aggregate, callback) {
                callback(null, [{userId: '123456789012'}]);
            };
            models.User.find = function (aggregate, callback) {
                callback(null, []);
            };
            global.models = models;
            projectUsersService.getUsersBySupervisor('perico@palote.com', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getUsersByProjectID', function () {
        it('Should getUsersByProjectID Success', function () {
            models.ProjectUsers.find = function (p1, callback) {
                callback(null, [{
                    userId: '123456789012',
                    initDate: '1970-01-01T00:00:00.000Z',
                    endDate: '1970-01-01T00:00:00.000Z',
                    _id: '123456789012'
                }]);
            };
            models.User.findOne = function (aggregate, callback) {
                callback(null, {
                    toObject: function () {
                        return this;
                    }
                });
            };
            global.models = models;
            projectUsersService.getUsersByProjectID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getUsersByProjectID', function () {
        it('Should getUsersByProjectID Error', function () {
            models.ProjectUsers.find = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;
            projectUsersService.getUsersByProjectID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getProjectsByUserID', function () {
        it('Should getProjectsByUserID Success', function () {
            models.ProjectUsers.find = function (p1, callback) {
                callback(null, [{
                    userId: '123456789012',
                    initDate: '1970-01-01T00:00:00.000Z',
                    endDate: '1970-01-01T00:00:00.000Z',
                    maxHours: 0,
                    _id: '123456789012'
                }]);
            };
            models.Project.findOne = function (aggregate, callback) {
                callback(null, {
                    toObject: function () {
                        return this;
                    }
                });
            };
            global.models = models;
            projectUsersService.getProjectsByUserID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getProjectsByUserID', function () {
        it('Should getProjectsByUserID Error', function () {
            models.ProjectUsers.find = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;
            projectUsersService.getProjectsByUserID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('getProjectsByUserIDBetweenDates', function () {
        it('Should getProjectsByUserIDBetweenDates Error', function () {
            models.ProjectUsers.find = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;
            projectUsersService.getProjectsByUserIDBetweenDates('123456789012', '1970-01-01T00:00:00.000Z',
                '1970-01-01T00:00:00.000Z', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
});
