var requires = require('../requires.js');
var models = requires.models;
var mailService = require('../../app/services/mailService.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

describe('Testing mailService', function () {
    describe('mailService', function () {
        it('Should initTransporter', function () {
            nodemailer.createTransport = function (user, callback) {
                callback();
            };
            global.models = models;

            mailService.initTransporter('123456789012', function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('sendWelcomeEmail', function () {
        it('Should sendWelcomeEmail', function () {
            mailService.sendWelcomeEmail({email: 'email'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
    describe('sendTest', function () {
        it('Should sendTest', function () {
            mailService.sendTest({email: 'email'}, function (response) {
                expect(response.success).toBe(true);
            });
        });
    });
});