// var express = require('express');

var smtpTransport = require('nodemailer-smtp-transport');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var nodemailer = require('nodemailer');

// mailer.zemsania@gmail.com
// pass: Zemsania_99

var transporter = null,
    SMTP_config = {
        service: "Gmail",
        auth: {
            user: 'devxcdn@gmail.com',
            pass: 'ycrstsrfccfzsyue'
        }
    },
    CONFIG = {
        sender: "Zemsania Support <" + SMTP_config.auth.user + ">"
    };

if (!global.config) global.config = require('../config/dev');

function initTransporter() {
    console.log("initializing transport smtp once");

    transporter = nodemailer.createTransport(smtpTransport(SMTP_config));

    // transporter = nodemailer.createTransport(smtpTransport({
    //     host: config.email.host,
    //     port: config.email.port,
    //     auth: {
    //         user: config.email.user,
    //         pass: config.email.pass
    //     }
    // }));
}

// initTransporter();

/**
 * Generic function to send emails
 */
function sendEmail(email, data, template, subject) {
    if (transporter == null)
        initTransporter();


    var templateDir = path.join(__dirname, '../templates', template);
    var newsletter = new EmailTemplate(templateDir);


    newsletter.render(data, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            // setup e-mail data with unicode symbols
            var mailOptions = {
                to: email, // list of receivers
                subject: subject, // Subject line
                html: results.html // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                }

            });
        }

    });
}

function execEmail(options, SCCallback, ERCallback) {
    if (transporter == null)
        initTransporter();

    if (!options.from) options.from = CONFIG.sender
    if (options.html) options.html += '<br><br>Zemsania Support'
    if (options.text) options.text += '\r\n\r\nZemsania Support'

    console.log('sending mail to', options.to);
    transporter.sendMail(options, function(err, res) {
        console.log("ERR:", err);
        console.log("RES:", res);
        if (err) {
            if (ERCallback) ERCallback();
        } else {
            if (SCCallback) SCCallback(res)
        }
    })
}

function sendWelcomeEmail(user) {
    var data = { user: user, urls: config.email.urls }
    sendEmail(user.username, data, 'es/welcome-user', i18n.es.subjects.welcome);
}

function sendRememberPassword(user) {
    var data = { user: user, urls: config.email.urls }
    sendEmail(user.username, data, 'es/rememberPassword', i18n.es.subjects.rememberPassword);
}

function sendTest(user) {
    var data = { user: user, urls: config.email.urls }
    sendEmail(user.username, data, 'es/test', i18n.es.subjects.test);
}

module.exports = {
    sendEmail: sendEmail,
    sendTest: sendTest,
    sendWelcomeEmail: sendWelcomeEmail,
    sendRememberPassword: sendRememberPassword,
    execEmail: execEmail
};