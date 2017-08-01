var requires = require('../requires.js');
var models = requires.models;
var securityService = require('../../app/services/securityService.js');
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');
var uuid = require('node-uuid');
var models = requires.models;

describe('Testing securityService', function () {
    describe('backofficeTokenValidation', function () {
        it('Should backofficeTokenValidation Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            securityService.backofficeTokenValidation({
                query: {
                    api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NjVjNjc4NmEzY2VjYzVkMzFjYTQ3OGMiLCJ1c2VybmFtZSI6ImFkbWluQHplbXNhbmlhLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQkFDS09GRklDRSIsIlJPTEVfTUFOQUdFUiIsIlJPTEVfREVMSVZFUlkiXSwiaWF0IjoxNDUyMTYxNzk3fQ.WlQ3bmt0gaGzcj8kTriiv0jbTfG5NnJn4CUjiwmqqCE'
                }
            }, {}, function (response) {
                expect(response.success).toBe(true);
            }, 'ROLE_BACKOFFICE');
        });
    });
    describe('userTokenValidation', function () {
        it('Should validateToken Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            securityService.userTokenValidation({
                query: {
                    api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NjVjNjc4NmEzY2VjYzVkMzFjYTQ3OGMiLCJ1c2VybmFtZSI6ImFkbWluQHplbXNhbmlhLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQkFDS09GRklDRSIsIlJPTEVfTUFOQUdFUiIsIlJPTEVfREVMSVZFUlkiXSwiaWF0IjoxNDUyMTYxNzk3fQ.WlQ3bmt0gaGzcj8kTriiv0jbTfG5NnJn4CUjiwmqqCE'
                }
            }, {}, function (response) {
                expect(response.success).toBe(true);
            }, 'ROLE_BACKOFFICE');
        });
    });

    describe('managerTokenValidation', function () {
        it('Should validateToken Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            securityService.managerTokenValidation({
                query: {
                    api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NjVjNjc4NmEzY2VjYzVkMzFjYTQ3OGMiLCJ1c2VybmFtZSI6ImFkbWluQHplbXNhbmlhLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQkFDS09GRklDRSIsIlJPTEVfTUFOQUdFUiIsIlJPTEVfREVMSVZFUlkiXSwiaWF0IjoxNDUyMTYxNzk3fQ.WlQ3bmt0gaGzcj8kTriiv0jbTfG5NnJn4CUjiwmqqCE'
                }
            }, {}, function (response) {
                expect(response.success).toBe(true);
            }, 'ROLE_BACKOFFICE');
        });
    });

    describe('deliveryTokenValidation', function () {
        it('Should validateToken Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            securityService.deliveryTokenValidation({
                query: {
                    api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NjVjNjc4NmEzY2VjYzVkMzFjYTQ3OGMiLCJ1c2VybmFtZSI6ImFkbWluQHplbXNhbmlhLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQkFDS09GRklDRSIsIlJPTEVfTUFOQUdFUiIsIlJPTEVfREVMSVZFUlkiXSwiaWF0IjoxNDUyMTYxNzk3fQ.WlQ3bmt0gaGzcj8kTriiv0jbTfG5NnJn4CUjiwmqqCE'
                }
            }, {}, function (response) {
                expect(response.success).toBe(true);
            }, 'ROLE_BACKOFFICE');
        });
    });

    describe('validateToken', function () {
        it('Should validateToken Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            securityService.validateToken({
                query: {
                    api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NjVjNjc4NmEzY2VjYzVkMzFjYTQ3OGMiLCJ1c2VybmFtZSI6ImFkbWluQHplbXNhbmlhLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQkFDS09GRklDRSIsIlJPTEVfTUFOQUdFUiIsIlJPTEVfREVMSVZFUlkiXSwiaWF0IjoxNDUyMTYxNzk3fQ.WlQ3bmt0gaGzcj8kTriiv0jbTfG5NnJn4CUjiwmqqCE'
                }
            }, {}, function (response) {
                expect(response.success).toBe(true);
            }, 'ROLE_BACKOFFICE');
        });
    });

    describe('checkToken', function () {
        it('Should checkToken Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            securityService.checkToken({
                query: {
                    api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI1NjVjNjc4NmEzY2VjYzVkMzFjYTQ3OGMiLCJ1c2VybmFtZSI6ImFkbWluQHplbXNhbmlhLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiIsIlJPTEVfQkFDS09GRklDRSIsIlJPTEVfTUFOQUdFUiIsIlJPTEVfREVMSVZFUlkiXSwiaWF0IjoxNDUyMTYxNzk3fQ.WlQ3bmt0gaGzcj8kTriiv0jbTfG5NnJn4CUjiwmqqCE'
                }
            }, {}, function (response) {
                expect(response.success).toBe(true);
            }, 'ROLE_BACKOFFICE');
        });
    });

    describe('signup', function () {
        it('Should signup Success', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };

            models.User.prototype.save = function (callback) {
                callback(null);
            };
            models.User.findOne = function (p1, callback) {
                callback(null, null);
            };

            global.models = models;

            securityService.signup({
                password: '123456789012', username: 'eszgn', 'roles': ['ROLE_USER']
            }, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should signup Error', function () {
            global.config = {
                secret: 'stxdryjhni46gy8ouht789g'
            };
            models.User.findOne = function (p1, callback) {
                callback(null, {});
            };

            global.models = models;

            securityService.signup({
                password: '123456789012', username: 'eszgn', 'roles': ['ROLE_USER']
            }, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('rememberPassword', function () {
        it('Should rememberPassword Success', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, new models.User());
            };

            models.User.prototype.save = function (callback) {
                callback(null);
            };

            global.models = models;

            securityService.rememberPassword('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should rememberPassword Error', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, null);
            };

            global.models = models;

            securityService.rememberPassword('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('resetPassword', function () {
        it('Should resetPassword Success', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, {
                    save: function (retorno) {
                        retorno();
                    }
                });
            };

            models.User.prototype.save = function (callback) {
                callback(null);
            };

            global.models = models;

            securityService.resetPassword({'uuid': '123456789012', password: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should resetPassword Error', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, null);
            };

            global.models = models;

            securityService.resetPassword({'uuid': '123456789012', password: '123456789012'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('validate', function () {
        it('Should validate Success', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, {
                    save: function (retorno) {
                        retorno();
                    }
                });
            };

            models.User.prototype.save = function (callback) {
                callback(null);
            };

            global.models = models;

            securityService.validate('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should validate Error activationDate', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, {
                    activationDate: '',
                    save: function (retorno) {
                        retorno();
                    }
                });
            };

            models.User.prototype.save = function (callback) {
                callback(null);
            };

            global.models = models;

            securityService.validate('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should validate Error', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, null);
            };

            global.models = models;

            securityService.validate('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });

    describe('login', function () {
        it('Should login Success', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, {
                    password: 'sha1$a41d37f5$1$1a9e9bb809891c005dea7a72df8d48cc46778196',
                    save: function (retorno) {
                        retorno();
                    }
                });
            };

            models.User.prototype.save = function (callback) {
                callback(null);
            };

            global.models = models;

            securityService.login({password: '1234'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
        it('Should login Error', function () {

            models.User.findOne = function (p1, callback) {
                callback(null, null);
            };

            global.models = models;

            securityService.login({}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
});