var requires = require('../requires.js');
var models = requires.models;
var calendarService = require('../../app/services/calendarService.js');

describe('Testing calendarService', function () {
    describe('getAllNameCalendar', function () {
        it('Should get all name calendar', function () {
            models.Calendar.find = function (p1, p2, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            calendarService.getAllNameCalendar(function (response) {
                expect(response.length).toBeGreaterThan(0);
            });
        });
    });

    describe('getCalendar', function () {
        it('Should get a calendar', function () {
            models.Calendar.findOne = function (p1, callback) {
                var calendarEx = {
                    calendar: {
                        bankHoliDays: [{}, {}],
                        nonWorkingDays: [{}],
                        intensiveDays: [{}],
                        specialDays: [{}]
                    }
                };
                callback(null, calendarEx);
            };
            global.models = models;

            calendarService.getCalendar('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('saveCalendar', function () {
        it('Should save a calendar', function () {
            models.Calendar.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            calendarService.saveCalendar({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at save a calendar', function () {
            models.Calendar.findOneAndUpdate = function (p1, p2, callback) {
                callback(true, null);
            };

            global.res = {
                send: function () {
                }
            };
            global.models = models;

            calendarService.saveCalendar({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should fail at save a calendar', function () {
            models.Calendar.prototype.save = function () {
            };
            global.models = models;

            calendarService.saveCalendar({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteCalendar', function () {
        it('Should delete a calendar', function () {
            models.Calendar.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, 1);
            };
            global.models = models;

            calendarService.deleteCalendar('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at delete a calendar "not found"', function () {
            models.Calendar.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, 0);
            };
            global.models = models;

            calendarService.deleteCalendar('123456789012', null, function (response) {
                expect(response.error).toBe('Calendar  not found');
            });
        });
    });


    describe('getCalendarByUserID', function () {
        it('Should get a calendar by userId', function () {
            models.CalendarUser.findOne = function (p1, callback) {
                callback(null, {
                    toObject: function (object) {
                        return this;
                    }
                });
            };
            models.Holidays.find = function (p1, pcallback, callback) {
                if (typeof pcallback !== 'object') {
                    pcallback(null, [{}]);
                } else {
                    callback(null, [{}]);
                }
            };

            global.models = models;

            calendarService.getCalendarByUserID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should fail at get a calendar by userId', function () {
            models.CalendarUser.findOne = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;

            calendarService.getCalendarByUserID('123456789012', function (response) {
                expect(response.success).toBe(false);
            });
        });
    });


    describe('getDaysBlockedByUserID', function () {
        it('Should get days blocked by user', function () {
            models.CalendarUser.findOne = function (p1, callback) {
                callback(null, {
                    bankHoliDaysUser: [{}],
                    specialDaysUser: [{}],
                    toObject: function () {
                        return this;
                    }
                });
            };
            global.models = models;

            calendarService.getDaysBlockedByUserID('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at get days blocked by user', function () {
            models.CalendarUser.findOne = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;

            calendarService.getDaysBlockedByUserID('123456789012', function (response) {
                expect(response.success).toBe(false);
            });
        });
    });

    describe('saveCalendarUser', function () {
        it('Should save user calendar', function () {
            models.CalendarUser.findOneAndUpdate = function (p1, p2, callback) {
                callback(true, {});
            };
            global.models = models;
            global.res = {
                send: function () {
                }
            };

            calendarService.saveCalendarUser({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should fail at save user calendar', function () {
            models.CalendarUser.prototype.save = function () {
            };
            global.models = models;

            calendarService.saveCalendarUser({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteCalendarUser', function () {
        it('Should delete user calendar', function () {
            models.CalendarUser.remove = function (p1, callback) {
                callback(null, 1);
            };
            global.models = models;

            calendarService.deleteCalendarUser('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at delete user calendar', function () {
            models.CalendarUser.remove = function (p1, callback) {
                callback(null, 0);
            };
            global.models = models;

            calendarService.deleteCalendarUser('123456789012', null, function (response) {
                expect(response.error).toBe('Calendar User not found');
            });
        });
    });

});