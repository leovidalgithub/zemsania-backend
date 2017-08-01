var requires = require('../requires.js');
var models = requires.models;
var spentsService = require('../../app/services/spentsService.js');

describe('Testing spentsService', function () {
    describe('getSpentsByUserId', function () {
        it('Should get spents from a user', function () {
            models.Spent.find = function (user, callback) {
                callback();
            };
            global.models = models;

            spentsService.getSpentsByUserId('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('approveSpents', function () {
        it('Should approve spents for a user', function () {
            models.Spent.findOne = function (user, callback) {
                callback(null, {});
            };
            models.User.findOne = function (user, callback) {
                callback(null, {});
            };
            global.models = models;
            global.constants = {};

            spentsService.approveSpents('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('rejectSpents', function () {
        it('Should reject spents from a user', function () {
            models.Spent.findOne = function (user, callback) {
                callback(null, {});
            };
            global.models = models;
            global.constants = {};


            spentsService.rejectSpent('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteSpent', function () {
        it('Should delete spent from a user', function () {
            models.Spent.remove = function (user, callback) {
                callback(null, {});
            };
            global.models = models;

            spentsService.deleteSpent('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('saveSpent', function () {
        it('Should save spents from a user', function () {
            models.Spent.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            spentsService.saveSpent({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at save spents from a user', function () {
            models.Spent.prototype.save = function () {
            };

            models.Spent.findOneAndUpdate = function (p1, p2, callback) {
                callback(true, null);
            };
            global.models = models;

            spentsService.saveSpent({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            }, function (response) {
                expect(response.error).toBeDefined();
            });
        });
        it('Should fail at save spents from a user', function () {
            models.Spent.prototype.save = function () {
            };

            global.models = models;

            spentsService.saveSpent({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('getSpentTypes', function () {
        it('Should get all types of spent', function () {
            models.ConceptSpent.find = function (user, callback) {
                callback(null, {});
            };
            global.models = models;

            spentsService.getSpentTypes(function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteSpentType', function () {
        it('Should delete type of spents', function () {
            models.ConceptSpent.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            spentsService.deleteSpentType('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('saveSpentType', function () {
        it('Should save type of spents', function () {
            models.ConceptSpent.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            spentsService.saveSpentType({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should create type of spents', function () {
            models.ConceptSpent.findOneAndUpdate = function (p1, p2, callback) {
                callback(true, null);
            };
            global.models = models;

            spentsService.saveSpentType({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            }, function (response) {
                expect(response.error).toBeDefined();
            });
        });


        it('Should create type of spents', function () {
            models.ConceptSpent.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            spentsService.saveSpentType({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });


    describe('getSpentById', function () {
        it('Should getSpentById', function () {
            models.Spent.find = function (p1, callback) {
                callback(null, {length: true});
            };
            global.models = models;

            spentsService.getSpentById('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should getSpentById', function () {
            models.Spent.find = function (p1, callback) {
                callback(null, null);
            };
            global.models = models;

            spentsService.getSpentById('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

});