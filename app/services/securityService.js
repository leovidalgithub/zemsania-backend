// var express = require('express');
// var router = express.Router();
// var ActiveDirectory = require('activedirectory')
var jwt          = require( 'jsonwebtoken' );
var passwordHash = require( 'password-hash' );
var mailService  = require( './mailService' );
var uuid         = require( 'node-uuid' );
var moment       = require( 'moment' );

var backofficeTokenValidation = function( req, res, next ) { // LEO WAS HERE
    validateToken( req, res, next, 'ROLE_BACKOFFICE' );
}

var userTokenValidation = function( req, res, next ) { // LEO WAS HERE
    validateToken( req, res, next, 'ROLE_USER' );
}

var managerTokenValidation = function( req, res, next ) { // LEO WAS HERE
    validateToken( req, res, next, 'ROLE_MANAGER' );
}

var deliveryTokenValidation = function( req, res, next ) { // LEO WAS HERE
    validateToken( req, res, next, 'ROLE_DELIVERY' );
}

var validateToken = function( req, res, next, role ) { // LEO WAS HERE
    // check header or url parameters or post parameters for token
    var token = req.query.api_key || req.params.token || req.headers['x-auth-token'];

    // decode token
    if (token) {
        var secretKey = config.secret;

        // verifies secret and checks exp
        jwt.verify(token, secretKey, function( err, decoded ) {
            if ( err ) {
                return res.json( {
                            success : false,
                            message : 'Failed to authenticate token.'
                });
            } else { // if everything is good, save to request for use in other routes

                //req.token = decoded;
                req.userId   = decoded.userId;
                req.username = decoded.username;
                req.roles    = decoded.roles;

                if ( decoded.roles.indexOf( role ) < 0) { // if role not exist into decoded
                    return res.status( 403 ).send({
                        success: false,
                        message: 'Role not allowed.'
                    });
                }
                if ( next != undefined ) next();
            }
        });

    } else { // if there is no token
        return res.status( 403 ).send({
                                success: false,
                                message: 'No token provided.'
        });
    }
}

 // API
 // LOGIN
function login( form, onSuccess, onError ) { // LEO WAS HERE
    // if (form.ldap) {
    //     verityActiveDirectoryUser(form, function(err, ADVerified) {
    //         if (ADVerified) {
    //             models.User.findOne({ username: form.username }).exec(function(err, user) {
    //                 if (user) return onSuccess(createUserToken(user));
    //                 form.enabled = true;
    //                 signup(form, function(response) {
    //                     if (!response.user) onError('User not returned after creating new account');
    //                     onSuccess(createUserToken(response.user));
    //                 }, loginFailed);
    //             });
    //         } else loginFailed();
    //     });
    // } else {}
    models.User.findOne( { username: form.username }, 
        function( err, user ) {
            if( err ) {
                onError( { success: false, code: 401, message: 'Error finding User.'} );
            } else {
                if ( !user ) {
                    onSuccess( { success: false, code: 101, message: 'User not found.'} );
                } else {
                    if ( !user.enabled ) {
                            onSuccess( { success: false, code: 103, message: 'User disabled.' } );
                    } else {
                        if ( passwordHash.verify( form.password, user.password ) ) {
                            onSuccess( createUserToken( user ) ); // Authentication OK
                        } else {
                            onSuccess( { success: false, code: 102, message: 'Authentication failed. Wrong password.' } );
                        }                        
                    }
                }
            }
        });
}

 // API
 // NEW USER REGISTER
function signup( credentials, onSuccess, onError ) {  // LEO WAS HERE
    // security roles filter: it verifies if user roles exist in the constant object so save them back to BDD
    var roles = ['ROLE_USER'];
    if ( credentials.roles && credentials.roles.length > 0 ) {
        for ( var i = 0; i < credentials.roles.length; i++ ) {
            if ( roles.indexOf( credentials.roles[i] ) == -1 && constants.roles.indexOf( credentials.roles[i] ) != -1 ) {
                roles.push( credentials.roles[i] );
            };
        };
    };

    models.User.findOne( {
        username: credentials.username
    }, function( err, user ) {
        if ( err ) {
        } else {
            if ( user ) {
                onSuccess( { success: false, code: 101, msg: 'User already exists.' } );
            } else {
                var user = new models.User( {
                    candidatoId    : credentials.candidatoId,
                    username       : credentials.username,
                    name           : credentials.name,
                    password       : passwordHash.generate( constants.defaultPassword ),
                    roles          : roles,
                    uuid           : uuid.v4(),
                    surname        : credentials.surname,
                    nif            : credentials.nif,
                    enabled        : credentials.enabled,
                    birthdate      : moment( credentials.birthdate, 'DD/MM/YYYY' ).toISOString(),
                    locale         : credentials.locale,
                    sex            : credentials.sex,
                    zimbra_cosID   : credentials.zimbra_cosID,
                    zimbra_server  : credentials.zimbra_server,
                    workloadScheme : credentials.workloadScheme,
                    holidayScheme  : credentials.holidayScheme,
                    superior       : credentials.superior,
                    company        : credentials.company,
                    calendarID     : credentials.calendarID
                });

                user.save( function( err, user ) {
                    if ( err ) {
                        onError( { success: false, code: 500, msg: 'Error saving new User.' } );
                    } else {
                        // console.log( 'User %s created successfully', credentials.username );
                        onSuccess( { success: true, code: 200, msg: 'New User saved successfully.' } );
                    }
                });
            }
        }
    });
}

// API
// GENERATES A NEW UUID WITH LIMIT OF TIME - SAVES IT INTO BDD - AND USES MAILSERVICE TO SEND A LINK TO THE USER EMAIL
function rememberPassword( data, onSuccess, onError ) { // LEO WAS HERE
    models.User.findOne({
        username: data.username
    }, function( err, user ) {
        if ( err ) {
            onError( { success: false, code: 401, message: 'Error finding User.'} );
        } else {
            if ( !user ) {
                onSuccess( { success: false, code: 101, message: 'User not found.'} );
            } else {

                var expiresInOneHour = new Date();
                    user.uuid = uuid.v1( {
                        msecs: expiresInOneHour.setMinutes( expiresInOneHour.getMinutes() + constants.verifyResetPassTime )
                    });

                user.save( function( err ) {
                    if ( err ) {
                        onError( { success: false, code: 402, message: 'Error saving uuid.'} );
                    } else {
                        data.user = user;
                        mailService.sendRememberPassword( data )
                            .then( function( data ) {
                                onSuccess( { success: true, code: 200, message: 'Email link send.'} );
                            })
                            .catch( function( err ) {
                                onError( { success: false, code: 403, message: 'Error sending email.'} );
                            });
                    }
                });
            }
        }
    });
}

// INTERNAL FUNCTION USE BY 'login()'
function createUserToken( user ) { // LEO WAS HERE
    var token = {
            userId   : user._id,
            username : user.username,
            roles    : user.roles
    };
    var token = jwt.sign( token, config.secret, {
            ignoreExpiration: true
    });

    user.password    = null;
    user.deviceType  = null;
    user.deviceToken = null;

    return {
        success : true,
        code    : 200,
        user    : user,
        token   : token,
        message : 'Authentication Ok.'
    }
}

// ****************************************************************************************************************
/**
 * Reset del password a partir del UUID del usuario
 **/
// function resetPassword(form, callback) {
//     models.User.findOne({
//         uuid: form.uuid
//     }, function(err, user) {
//         if (err) throw err;
//         if (!user) {
//             callback({ code: 101, message: 'User not found.' });
//         } else if (user) {
//             user.password = passwordHash.generate(form.password);
//             if (user.activationDate == undefined || user.activationDate == null) {
//                 user.activationDate = new Date();
//             }
//             user.uuid = uuid.v4();
//             user.save(function(err) {
//                 if (err) throw err;
//                 callback(null, { success: true });
//             });
//         }
//     });
// }

/**
 * Reset del password a partir del UUID del usuario
 **/
// function validate(userUUID, callback) {
//     models.User.findOne({
//         uuid: userUUID
//     }, function(err, user) {
//         if (err) throw err;
//         if (!user) {
//             return callback({ code: 101, message: 'User not found.' })
//         } else if (user) {
//             if (user.activationDate != undefined) {
//                 return callback({ code: 110, message: 'User already validated.' });
//             } else {
//                 user.activationDate = new Date();
//                 user.uuid = uuid.v4();
//                 user.save(function(err) {
//                     if (err) throw err;
//                     return callback(null, { name: user.name, userId: user._id });
//                 });
//             }
//         }
//     });
// }

/**
 * Login with ActiveDirectory
 **/
// function verityActiveDirectoryUser(form, onFinishCallback) {
//     // initialize Active directory
//     var ADConfig = require('../config/dev').activeDriectory,
//         AD = new ActiveDirectory(ADConfig);

//     AD.authenticate(form.username, form.password, function(err, authenticated) {
//         if (err) return onFinishCallback(err)
//         onFinishCallback(null, authenticated)
//     });
// }

/*
 Devuelve un userId de usuario
 */
// var checkToken = function(req, callback) {
//     // check header or url parameters or post parameters for token
//     var token = req.query.api_key || req.params.token || req.headers['x-auth-token'];
//     // decode token
//     if (token) {
//         var secretKey = config.secret;

//         // verifies secret and checks exp
//         jwt.verify(token, secretKey, function(err, decoded) {
//             if (err) {
//                 return callback(null);
//             } else {
//                 // if everything is good, we return the userId
//                 return callback(decoded.userId);
//             }
//         });

//     } else return callback(null);
// }

module.exports = {
    login: login,
    validateToken: validateToken,
    userTokenValidation: userTokenValidation,
    backofficeTokenValidation: backofficeTokenValidation,
    managerTokenValidation: managerTokenValidation,
    deliveryTokenValidation: deliveryTokenValidation,
    signup: signup,
    // checkToken: checkToken,
    rememberPassword: rememberPassword
    // validate: validate,
    // resetPassword: resetPassword
};
