var requires = require('../requires.js');
var models = requires.models;
var holidaysService = require('../../app/services/holidaysService.js');

describe('Testing holidaysService', function () {
    describe('checkUserDatesInHoliDays', function () {
        it('Should check if user dates are holidays', function () {
            models.Holidays.find = function (p1, callback) {
                callback(null, []);
            };
            global.models = models;

            holidaysService.checkUserDatesInHoliDays('123456789012', '01/01/1970', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at check if user dates are holidays', function () {
            models.Holidays.find = function (p1, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            holidaysService.checkUserDatesInHoliDays('123456789012', '01/01/1970', null, function (response) {
                expect(response).toBe('imputed_in_holidays');
            });
        });
    });

    describe('getHolidaysByUserID', function () {
        it('Should get holidays by user', function () {
            models.Holidays.find = function (p1, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            holidaysService.getHolidaysByUserID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('getHolidaysBetweenDatesByUserID', function () {
        it('Should get holidays between dates by user', function () {
            models.Holidays.find = function (p1, p2, callback) {
                callback(null, []);
            };
            global.models = models;
            global.constants = {approved: true};

            holidaysService.getHolidaysBetweenDatesByUserID('123456789012', null, null, function (response) {
                expect(response).toBeDefined();
            });
        });
    });

    describe('getHolidaysDatesByUserID', function () {
        it('Should get holidays between dates by user', function () {
            models.Holidays.find = function (p1, p2, callback) {
                callback(null, [{date: '01/01/1970'}]);
            };
            global.models = models;
            global.constants = {approved: true};

            holidaysService.getHolidaysDatesByUserID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('requestUserHolidays', function () {
        it('Should get holidays between dates by user', function () {
            models.Holidays.find = function (p1, p2, callback) {
                callback(null, [{date: '01/01/1970'}]);
            };
            models.Holidays.count = function (p1, callback) {
                callback(null, 0);
            };
            models.Holidays.prototype.save = function (callback) {
                callback();
            };
            global.models = models;
            global.constants = {approved: true, holidaysTotal: 1};
            global.db = {
                collection: function () {
                    return this;
                },
                count: function (p1, callback) {
                    callback(null, 0);
                }
            };

            holidaysService.requestUserHolidays('123456789012', ['01/01/1970'], function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail get holidays between dates by user because holidaysTotal exceeded', function () {
            models.Holidays.find = function (p1, p2, callback) {
                callback(null, [{date: '01/01/1970'}]);
            };
            models.Holidays.count = function (p1, callback) {
                callback(null, 5);
            };
            models.Holidays.prototype.save = function (callback) {
                callback();
            };
            global.models = models;
            global.constants = {approved: true, holidaysTotal: 1};
            global.db = {
                collection: function () {
                    return this;
                },
                count: function (p1, callback) {
                    callback(null, 0);
                }
            };

            holidaysService.requestUserHolidays('123456789012', ['01/01/1970'], null, function (response) {
                expect(response.success).toBe(false);
            });
        });

        it('Should fail get holidays between dates by user because holidaysTotal exceeded', function () {
            models.Holidays.find = function (p1, p2, callback) {
                callback(null, [{date: '01/01/1970'}]);
            };
            global.models = models;
            global.constants = {approved: true};
            global.db = {
                collection: function () {
                    return this;
                },
                count: function (p1, callback) {
                    callback(null, 1);
                }
            };

            holidaysService.requestUserHolidays('123456789012', ['01/01/1970'], null, function (response) {
                expect(response.success).toBe(false);
            });
        });
    });

    describe('approveHolidays', function () {
        it('Should approve holidays', function () {
            global.constants = {approved: 1};
            holidaysService.approveHolidays(['123456789012'], function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('rejectHolidays', function () {
        it('Should reject holidays', function () {
            global.constants = {approved: 1, rejected : 1};
            holidaysService.rejectHolidays(['123456789012'], function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteHoliday', function () {
        it('Should delete holidays', function () {
            models.Holidays.remove = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;
            holidaysService.deleteHoliday('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
});