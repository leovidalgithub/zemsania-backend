var requires = require('../requires.js');
var models = requires.models;
var absencesService = require('../../app/services/absencesService.js');

describe('Testing absencesService', function () {
    describe('getAbsencesByUserId', function () {
        it('Should get absences from a user', function () {
            models.Absence.find = function (user, callback) {
                callback();
            };
            global.models = models;

            absencesService.getAbsencesByUserId('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('getAbsenceById', function () {
        it('Should getAbsenceById Success', function () {
            models.Absence.find = function (user, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            absencesService.getAbsenceById('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should getAbsenceById Error', function () {
            models.Absence.find = function (user, callback) {
                callback(null, []);
            };
            global.models = models;

            absencesService.getAbsenceById('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('approveAbsences', function () {
        it('Should approve absences for a user', function () {
            models.Absence.findOneAndUpdate = function (p1, p2, p3, callback) {
                callback();
            };
            models.Absence.findOne = function (user, callback) {
                callback(null, {});
            };
            models.User.findOne = function (user, callback) {
                callback(null, {});
            };
            global.models = models;
            global.constants = {};

            absencesService.approveAbsences('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('rejectAbsence', function () {
        it('Should reject absences from a user', function () {
            models.Absence.findOne = function (user, callback) {
                callback(null, {});
            };
            global.models = models;
            global.constants = {};


            absencesService.rejectAbsence('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteAbsence', function () {
        it('Should delete absences from a user', function () {
            models.Absence.remove = function (user, callback) {
                callback(null, {});
            };
            global.models = models;

            absencesService.deleteAbsence('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteAbsenceById', function () {
        it('Should delete absences from a user by id', function () {
            models.Absence.remove = function (user, callback) {
                callback(null);
            };
            global.models = models;

            absencesService.deleteAbsenceById('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('saveAbsence', function () {
        it('Should save absences from a user', function () {
            models.Absence.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            absencesService.saveAbsence({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at save absences from a user', function () {
            models.Absence.prototype.save = function () {
            };

            models.Absence.findOneAndUpdate = function (p1, p2, callback) {
                callback(true, null);
            };
            global.models = models;

            absencesService.saveAbsence({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            }, function (response) {
                expect(response.error).toBeDefined();
            });
        });
        it('Should fail at save absences from a user', function () {
            models.Absence.prototype.save = function () {
            };

            global.models = models;

            absencesService.saveAbsence({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('getAbsenceTypes', function () {
        it('Should get all types of absences', function () {
            models.ConceptAbsence.find = function (user, callback) {
                callback(null, {});
            };
            global.models = models;

            absencesService.getAbsenceTypes(function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('deleteAbsenceType', function () {
        it('Should delete type of absences', function () {
            models.ConceptAbsence.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            absencesService.deleteAbsenceType('123456789012', '123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('saveAbsenceType', function () {
        it('Should save type of absences', function () {
            models.ConceptAbsence.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            absencesService.saveAbsenceType({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });

        it('Should create type of absences', function () {
            models.ConceptAbsence.findOneAndUpdate = function (p1, p2, callback) {
                callback(true, null);
            };
            global.models = models;

            absencesService.saveAbsenceType({_id: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            }, function (response) {
                expect(response.error).toBeDefined();
            });
        });


        it('Should create type of absences', function () {
            models.ConceptAbsence.findOneAndUpdate = function (p1, p2, callback) {
                callback(null, {});
            };
            global.models = models;

            absencesService.saveAbsenceType({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

});