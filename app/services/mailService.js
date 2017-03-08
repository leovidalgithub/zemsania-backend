var smtpTransport = require( 'nodemailer-smtp-transport' );
var EmailTemplate = require( 'email-templates' ).EmailTemplate;
var path          = require( 'path' );
var nodemailer    = require( 'nodemailer' );

// mailer.zemsania@gmail.com
// pass: Zemsania_99

// user: 'devxcdn@gmail.com',
// pass: 'ycrstsrfccfzsyue'

var transporter = null,
    SMTP_config = {
        service: "Gmail",
        auth: {
            user: 'mailer.zemzania@gmail.com',
            pass: 'Zemsania_99'
        }
    },
    CONFIG = {
        sender: "Zemsania Support <" + SMTP_config.auth.user + ">"
    };

if (!global.config) global.config = require('../config/dev');

function initTransporter() {
    console.log( 'Iinitializing transport smtp once' );
    transporter = nodemailer.createTransport( smtpTransport( SMTP_config ) );
    // transporter = nodemailer.createTransport(smtpTransport({
    //     host: config.email.host,
    //     port: config.email.port,
    //     auth: {
    //         user: config.email.user,
    //         pass: config.email.pass
    //     }
    // }));
// <!-- <h4><a href="<%= urlLocation %>/#!/login">Regresar a Zemtime</a></h4> -->
}

// SEND EMAILS
function sendEmail( email, data, template, subject ) { // LEO WAS HERE
    if ( transporter == null ) initTransporter();

    var templateDir = path.join( __dirname, '../templates', template );
    var newsletter = new EmailTemplate( templateDir );

    return new Promise( function( resolve, reject ) {
        newsletter.render( data, function( err, result ) {
            if ( err ) {
                console.log( err );
            } else {
                var mailOptions = {
                    to: email,
                    subject: subject,
                    html: result.html
                };
                transporter.sendMail( mailOptions, function( error, info ) {
                    if ( error ) {
                        reject( error );
                    } else {
                        resolve( info );
                    }
                });
            }
        });
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
    var data = { user: user, urls: config.email.urls };
    sendEmail(user.username, data, 'es/welcome-user', i18n.es.subjects.welcome);
};

function sendRememberPassword( data ) { // LEO WAS HERE
    return sendEmail( data.username, data, 'es/rememberPassword', i18n.es.resetPassword.rememberPassword );
};

function sendNewPassword( data ) { // LEO WAS HERE
    return sendEmail( data.user.username, data, 'es/newPassword', i18n.es.resetPassword.newPassword );
};

function sendTest(user) {
    var data = { user: user, urls: config.email.urls };
    sendEmail(user.username, data, 'es/test', i18n.es.subjects.test);
};

module.exports = {
    sendEmail: sendEmail,
    sendTest: sendTest,
    sendWelcomeEmail: sendWelcomeEmail,
    sendRememberPassword: sendRememberPassword,
    sendNewPassword: sendNewPassword,
    execEmail: execEmail
};