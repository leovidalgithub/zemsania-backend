var requires = require('../requires.js');
var models = requires.models;
var projectService = require('../../app/services/projectService.js');

describe('Testing projectService', function () {
    describe('deleteProject', function () {
        it('Should delete a project _id True', function () {
            models.Project.findOneAndUpdate = function (project, params, callback) {
                callback(null, 1);
            };
            global.models = models;
            var form = {_id: '123456789012'};
            projectService.deleteProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should delete a project _id false', function () {
            models.Project.findOneAndUpdate = function (project, params, callback) {
                callback(true, null);
            };
            global.models = models;
            var form = {_id: '123456789012'};
            projectService.deleteProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at delete a project projectRef true', function () {
            models.Project.remove = function (project, callback) {
                callback(null, 0);
            };
            global.models = models;
            var form = {projectRef: '123456789012'};
            projectService.deleteProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should fail at delete a project projectRef false', function () {
            models.Project.remove = function (project, callback) {
                callback(true, null);
            };
            global.models = models;
            var form = {projectRef: '123456789012'};
            projectService.deleteProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('saveProject', function () {
        it('Should save porject', function () {
            models.Project.findOneAndUpdate = function findOneAndUpdate(query, p1, callback) {
                callback(null, {
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;
            var form = {_id: '123456789012'};
            projectService.saveProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should save porject', function () {
            models.Project.findOneAndUpdate = function findOneAndUpdate(query, p1, callback) {
                callback(true, null);
            };
            global.models = models;
            var form = {_id: '123456789012'};
            projectService.saveProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should update profile', function () {
            models.Project.findOneAndUpdate = function findOneAndUpdate(query, p1, callback) {
                callback(null, {
                    save: function (callback) {
                        callback();
                    }
                });
            };
            global.models = models;
            var form = {projectParent: 'project1'};

            projectService.saveProject(form, function (response) {
                expect(response.success).toBe(false);
            });
        });
        it('Should update profile', function () {
            models.Project.findOneAndUpdate = function findOneAndUpdate(query, p1, callback) {
                callback(true, null);
            };
            global.models = models;
            var form = {projectParent: 'project1'};

            projectService.saveProject(form, function (response) {
                expect(response.success).toBe(false);
            });
        });
        it('Should update profile', function () {
            models.Project.findOneAndUpdate = function findOneAndUpdate(query, p1, callback) {
                callback(null, null);
            };
            global.models = models;

            var form = {
                projectRef: 'project1'
            };

            projectService.saveProject(form, function (response) {
                expect(response.success).toBe(false);
            });
        });
        it('Should update profile', function () {
            models.Project.findOneAndUpdate = function findOneAndUpdate(query, p1, callback) {
                callback(null, null);
            };
            global.models = models;
            projectService.saveProject({}, function (response) {
                expect(response.success).toBe(false);
            });
        });
    });

    describe('searchProjects', function () {
        it('Should search a project', function () {
            models.Project.aggregate = function (aggregate, callback) {
                callback(null, [{}]);
            };
            global.models = models;

            var form = {
                projectName: 'aa',
                projectParent: 'aa',
                projectRef: 'aa',
                customerRef: 'aa',
                customerName: 'aa',
                initDate: 'aa',
                endDate: 'aa',
                emailSupervisor: 'aa',
                emailSupervisorDelivery: 'aa',
                enabled: true,
                status: true,
                _id: '123456789012',
                page: 0,
                rows: 0
            };

            projectService.searchProject(form, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
});
