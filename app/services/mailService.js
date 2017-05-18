var smtpTransport = require( 'nodemailer-smtp-transport' );
var EmailTemplate = require( 'email-templates' ).EmailTemplate;
var path          = require( 'path' );
var nodemailer    = require( 'nodemailer' );

var transporter = null;
var SMTP_config = {
    type: 'imap',
    host: 'mail.zemsania.com',
    port: 465,
    secure: true,
    auth: {
        user: 'zemtime@zemsania.com',
        pass: 'zemtime$2017'
    }
};
// var CONFIG = {
//         sender: "Zemsania Support <" + SMTP_config.auth.user + ">"
//     };

if ( !global.config ) global.config = require( '../config/dev' );

function initTransporter() {
    console.log( 'Iinitializing transport smtp once' );
    transporter = nodemailer.createTransport( smtpTransport( SMTP_config ) );
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
                    from: 'zemtime@zemsania.com',
                    to: email,
                    subject: subject,
                    html: result.html
                };
                transporter.sendMail( mailOptions, function( err, info ) {
                    if ( err ) {
                        reject( err );
                    } else {
                        resolve( info );
                    }
                });
            }
        });
    });
}

function sendRememberPassword( data ) { // LEO WAS HERE
    return sendEmail( data.username, data, 'es/rememberPassword', i18n.es.resetPassword.rememberPassword );
};

function sendNewPassword( data ) { // LEO WAS HERE
    return sendEmail( data.user.username, data, 'es/newPassword', i18n.es.resetPassword.newPassword );
};

// function execEmail(options, SCCallback, ERCallback) {
//     if (transporter == null)
//         initTransporter();
//     if (!options.from) options.from = CONFIG.sender
//     if (options.html) options.html += '<br><br>Zemsania Support'
//     if (options.text) options.text += '\r\n\r\nZemsania Support'
//     console.log('sending mail to', options.to);
//     transporter.sendMail(options, function(err, res) {
//         console.log("ERR:", err);
//         console.log("RES:", res);
//         if (err) {
//             if (ERCallback) ERCallback();
//         } else {
//             if (SCCallback) SCCallback(res)
//         }
//     })
// }
// function sendWelcomeEmail(user) {
//     var data = { user: user, urls: config.email.urls };
//     sendEmail(user.username, data, 'es/welcome-user', i18n.es.subjects.welcome);
// };
// function sendTest( user ) {
//     var data = { user: user, urls: config.email.urls };
//     sendEmail( user.username, data, 'es/test', i18n.es.subjects.test );
// };

module.exports = {
    sendEmail: sendEmail,
    // sendTest: sendTest,
    // sendWelcomeEmail: sendWelcomeEmail,
    sendRememberPassword: sendRememberPassword,
    sendNewPassword: sendNewPassword
    // execEmail: execEmail
};


// user: 'devxcdn@gmail.com',
// pass: 'ycrstsrfccfzsyue'

// var SMTP_config = {
//         service: "Gmail",
//         auth: {
//             user: 'mailer.zemzania@gmail.com',
//             pass: 'Zemsania_99'
//         }
//     };
