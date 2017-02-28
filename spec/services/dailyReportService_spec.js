var requires = require('../requires.js');
var models = requires.models;
var dailyReportService = require('../../app/services/dailyReportService.js');
var projectUsersService = require('../../app/services/projectUsersService.js');


describe('Testing dailyReportService', function () {
    describe('getDailyReports', function () {
        it('Should get daily reports', function () {
            models.DailyReport.find = function (p1, callback) {
                callback(null, []);
            };
            global.models = models;

            dailyReportService.getDailyReports('123456789012', '01/01/1970', '01/01/1970', function (response) {
                expect(response).toBeDefined();
            });
        });
    });

    describe('getDailyReportsGrid', function () {
        it('Should get daily reports grid', function () {
            models.DailyReport.find = function (p1, callback) {
                callback(null, []);
            };
            models.ProjectUsers.find = function (p1, callback) {
                callback(null, [{}]);
            };
            models.Project.findOne = function (p1, callback) {
                callback(null, {
                    toObject: function () {
                        return this;
                    }
                });
            };
            global.models = models;

            dailyReportService.getDailyReportsGrid('123456789012', '01/01/1970', '01/01/1970', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('getDaysBlocked', function () {
        it('Should get daily Blocked', function () {
            models.CalendarUser.findOne = function (p1, callback) {
                callback(null, {
                    bankHoliDaysUser: [{}],
                    specialDaysUser: [{}],
                    nonWorkingDays: [{}],
                    toObject: function () {
                        return this;
                    }
                });
            };
            global.models = models;

            dailyReportService.getDaysBlocked('123456789012', '01/01/1970', '01/01/1970', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('imputeHours', function () {
        it('Should imputeHours with result success', function () {
            models.DailyReport.aggregate = function (p1, callback) {
                callback(null, [1]);
            };
            models.ProjectUsers.findOne = function (p1, callback) {
                callback(null, {maxHours: 0});
            };
            models.Calendar.findOne = function (p1, callback) {
                callback(null, {});
            };
            models.Holidays.find = function (p1, p2, callback) {
                callback(null, []);
            };
            models.CalendarUser.findOne = function (p1, callback) {
                callback(null, {
                        bankHoliDaysUser: [],
                        specialDaysUser: [],
                        toObject: function () {
                            return this;
                        }
                    }
                );
            };
            models.DailyReport.findOneAndUpdate = function (p1, p2, p3, callback) {
                callback(null, {
                    bankHoliDaysUser: [],
                    specialDaysUser: [],
                    nonWorkingDays: [],
                    toObject: function () {
                        return this;
                    }
                });
            };

            global.models = models;

            var dailyReports = [{
                date: '1970-01-01T00:00:00.000Z', userId: '123456789012',
                projectId: '123456789012', conceptId: '123456789012'
            }];

            dailyReportService.imputeHours('123456789012', dailyReports, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('searchDailyReports', function () {
        it('Should searchDailyReports', function () {
            models.DailyReport.aggregate = function (aggregate, callback) {
                callback(null, []);
            };
            global.models = models;

            var form = {
                date: 'aa',
                //userId: '123456789012',
                type: 'aa',
                enabled: true,
                status: 'aa',
                page: 0,
                rows: 0
            };

            dailyReportService.searchDailyReports(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('sendDailyReports', function () {
        it('Should sendDailyReports Success', function () {
            models.User.findOne = function (aggregate, callback) {
                callback(null, {});
            };
            models.DailyReport.update = function (p1, p2, p3, callback) {
                callback();
            };
            models.ProjectUsers.find = function (p1, callback) {
                models.User.findOne = function (p1, callback) {
                    callback(null, null);
                };
                callback(null, [{emailSupervisor: 'emailSupervisor',}]);
            };
            models.Notification.prototype.save = function () {
            };
            global.models = models;

            dailyReportService.sendDailyReports('123456789012', '1970-01-01T00:00:00.000Z', '1970-01-02T00:00:00.000Z', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('sendDailyReportsBySupervisor', function () {
        it('Should sendDailyReportsBySupervisor Success', function () {
            models.User.findOne = function (aggregate, callback) {
                callback(null, {});
            };
            models.DailyReport.update = function (p1, p2, p3, callback) {
                callback();
            };
            models.ProjectUsers.find = function (p1, callback) {
                models.User.findOne = function (p1, callback) {
                    callback(null, null);
                };
                callback(null, [{emailSupervisor: 'emailSupervisor',}]);
            };
            models.Notification.prototype.save = function () {
            };
            global.models = models;

            dailyReportService.sendDailyReportsBySupervisor('123456789012', '123456789012', '1970-01-01T00:00:00.000Z', '1970-01-02T00:00:00.000Z', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('validateDailyReports', function () {
        it('Should validateDailyReports Success', function () {
            models.Notification.prototype.save = function () {
                console.log('ALGO LARGO ONE DICK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 8=====D');
            };
            models.User.findOne = function (aggregate, callback) {
                callback(null, {userId: '123456789012'});
            };
            models.DailyReport.update = function (p1, p2, p3, callback) {
                callback();
            };
            models.ProjectUsers.find = function (p1, callback) {
                models.User.findOne = function (p1, callback) {
                    callback(null, null);
                };
                callback(null, [{emailSupervisor: 'emailSupervisor',}]);
            };

            global.models = models;
            global.constants = {hours_validated: 'constants.hours_validated'};

            dailyReportService.validateDailyReports('123456789012', '123456789012', '1970-01-01T00:00:00.000Z',
                '1970-01-02T00:00:00.000Z', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('rejectDailyReports', function () {
        it('Should rejectDailyReports Success', function () {
            models.User.findOne = function (aggregate, callback) {
                callback(null, {});
            };
            models.DailyReport.update = function (p1, p2, p3, callback) {
                callback();
            };
            models.ProjectUsers.find = function (p1, callback) {
                models.User.findOne = function (p1, callback) {
                    callback(null, null);
                };
                callback(null, [{emailSupervisor: 'emailSupervisor',}]);
            };
            models.Notification.prototype.save = function () {
            };
            global.models = models;

            dailyReportService.rejectDailyReports('123456789012', '123456789012', '1970-01-01T00:00:00.000Z', '1970-01-02T00:00:00.000Z', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });


});