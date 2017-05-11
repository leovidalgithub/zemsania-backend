// var express = require('express');
// var router = express.Router();
// var async = require('async');
// var mailService = require('./mailService');
var passwordHash = require( 'password-hash' );
    mongoose     = require( 'mongoose' );
    ObjectId     = require( 'mongoose' ).Types.ObjectId;
    moment       = require( 'moment' );

// API
// RETURNS ALL USERS
function getAllUsers( onSuccess, onError ) { // LEO WAS HERE
    models.User.find( {},
     function ( err, users ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting all users.', err : err } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'All users list', users : users } );
        }
    });
}

// API
// EMPLOYEE-MANAGER USER ADVANCED SEARCH. FINDS THE SAME STRING IN 4 FIELDS
function advancedUserSearch( form, onSuccess, onError ) { // LEO WAS HERE
    var textToFind = form.textToFind;
    var regExp = new RegExp( '' + textToFind );
    var aggregate = [
                    { '$match' : { '$or' : [ 
                                                { name     : { '$regex' : regExp, '$options' : 'i' } },
                                                { username : { '$regex' : regExp, '$options' : 'i' } },
                                                { surname  : { '$regex' : regExp, '$options' : 'i' } },
                                                { nif      : { '$regex' : regExp, '$options' : 'i' } }
                                         ] } }
    ];
                    // { $project : { name : 1, username : 1 } }
    models.User.aggregate( aggregate, function ( err, users ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Users Profile.', err : err } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Users by Advanced search', users: users } );
        }
    });
}

// API
// MANAGER-EMPLOYEE-EDIT: GET USER PROFILE WITH COMPANY-ENTERPRISE POPULATED 
function newSearchUsers( data, onSuccess, onError ) { // LEO WAS HERE
    console.log(data);
    var id = data._id;
    models.User.findOne( { _id: new ObjectId( id ) })
        .populate( 'company','enterpriseName' )
        .exec( function ( err, user ) {
            if ( err ) {
                onError( { success: false, code: 500, msg: 'Error getting User Profile with Enterprise info.', err : err } );
            } else {
                onSuccess( { success: true, code: 200, msg: 'User Profile', user: user } );
            }
    });
}

 // API
 // USER PROFILE UPDATE. EITHER FOR profile or EmployeeManager
function updateProfile( userProfile, onSuccess, onError ) { // LEO WAS HERE
    var userId = userProfile._id;
    // security roles filter: it verifies if user roles exist in the constant object so save them back to BDD
    var roles = ['ROLE_USER'];
    if ( userProfile.roles && userProfile.roles.length > 0 ) {
        for ( var i = 0; i < userProfile.roles.length; i++ ) {
            if ( roles.indexOf( userProfile.roles[i] ) == -1 && constants.roles.indexOf( userProfile.roles[i] ) != -1 ) {
                roles.push( userProfile.roles[i] );
            };
        };
    };
    models.User.findOne( { _id: new ObjectId( userId ) }, function ( err, user ) {
        if( err ) {
            onError( { success: false, code: 500, msg: 'Error getting User.' } );
        } else if ( user ) {
            if ( userProfile.birthdate ) { 
               user.birthdate = moment( userProfile.birthdate, 'DD/MM/YYYY' ).toISOString();
            };
            // user.username      = userProfile.username; // do not overwrite email
            user.enabled          = userProfile.enabled;
            user.calendarID       = userProfile.calendarID;
            user.zimbra_cosID     = userProfile.zimbra_cosID;
            user.locale           = userProfile.locale;
            user.nif              = userProfile.nif;
            user.name             = userProfile.name;
            user.sex              = userProfile.sex;
            user.roles            = roles;
            user.surname          = userProfile.surname;
            user.birthdate        = userProfile.birthdate;
            user.lastModifiedDate = Date.now();

            if ( userProfile.workloadScheme ) user.workloadScheme = userProfile.workloadScheme;
            if ( userProfile.holidayScheme ) user.holidayScheme   = userProfile.holidayScheme;
            if ( userProfile.superior ) user.superior             = userProfile.superior;
            if ( userProfile.company ) user.company               = userProfile.company

            user.save( function ( err, doc ) {
                if ( err ) {
                    onError( { success: false, code: 500, msg: 'Error saving User Profile.' } );
                } else {
                    onSuccess( { success: true, code: 200, msg: 'User Profile updated correctly' } );                    
                }
            })            
        } else {
            onError( { success: false, code: 500, msg: 'Error updating User Profile!' } );
        }
    });
}

// API
// VERIFYS IF A GIVEN EMAIL ALREADY EXIST
function verifyUniqueUserEmail( emailToVerify, onSuccess, onError ) { // LEO WAS HERE
    models.User.findOne( { 'username' : emailToVerify }, function ( err, emailFound ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error finding email!' } );            
        } else {
            if ( emailFound ) {
                onSuccess( { success: true, code: 200, found: true, msg: 'Email already exists' } );
            } else {
                onSuccess( { success: true, code: 200, found: false, msg: 'Email not exists' } );
            }            
        };
    });
}

// API
// CHANGE USER PASSWORD
function changePassword( userId, form, onSuccess, onError ) { // LEO WAS HERE
    models.User.findOne( { _id: new ObjectId( userId ) }, function ( err, user ) {
        if ( err ) {
            onError( { success: false, code: 401, message: 'Error finding User!'} );
        } else {
            if ( !user ) {
                onSuccess( { success: false, code: 101, message: 'User not found.'} );
            } else {
                if ( !passwordHash.verify( form.currentPassword, user.password ) ) {
                    onSuccess( { success: false, code: 102, message: 'Wrong current password!' } );
                } else {
                    user.password = passwordHash.generate( form.newPassword );
                    user.defaultPassword = false;
                    user.save( function ( err ) {
                        if ( err ) {
                            onError( { success: false, code: 402, message: 'Error saving new password!'} );
                        } else {
                            onSuccess( { success: true, code: 200, message: 'Password changed successfully!' } );
                        };
                    });
                }
            }
        }
    });
}

// ******************************************************* *******************************************************
// OLD FINDING USERS FOR ADVANCED SEARCH
// function OLDsearchUsers( form, onSuccess, onError ) { // LEO WAS HERE
//     var query = [];
//     if (form.username) {
//         query.push({
//             username: form.username
//         });
//     }

//     if (form._id) {
//         query.push({
//             _id: new ObjectId(form._id)
//         });
//     }

//     if (form.name) {
//         query.push({
//             name: {
//                 '$regex': form.name
//             }
//         });
//     }

//     if (form.surname) {
//         query.push({
//             surname: {
//                 '$regex': form.surname
//             }
//         });
//     }

//     if (form.nif) {
//         query.push({
//             nif: {
//                 '$regex': form.nif
//             }
//         });
//     }

//     // if (form.enabled) {
//     //     query.push({
//     //         enabled: form.enabled
//     //     });
//     // } else {
//     //     query.push({
//     //         enabled: true
//     //     });
//     // }

//     if (form.activated) {
//         query.push({
//             activated: form.activated
//         });
//     }

//     var aggregate = [];
//     if (query.length > 0) {
//         aggregate.push({
//             '$match': {
//                 $and: query
//             }
//         });
//     }
//     //aggregate.push(projection);
//     var page = form.page == undefined ? 0 : form.page;
//     var rows = form.rows == undefined ? 10 : form.rows;

//     if (page > -1) {
//         aggregate.push({
//             '$skip': (page * rows)
//         });
//         aggregate.push({
//             '$limit': rows
//         });
//     }
//     models.User.aggregate( aggregate, function ( err, users ) {
//         if ( err ) {
//             onError( { success: false, code: 500, msg: 'Error getting Users Profile.' } );
//         } else {
//             console.log(users);
//             onSuccess( { success: true, code: 200, msg: 'Users Profile', users: users } );
//         }
//     });
// }

// function queryUsers(query, callback) {
//     models.User.find(query, function(err, users) {
//         callback(err ? [] : users);
//     });
// };

/**
 * User delete
 **/
// it functionality is not in use because the manager user directly set user enabled to false
// function deleteUser(userId, form, onSuccess, onError) { // LEO WORKING HERE
//     models.User.findOneAndUpdate({_id: new ObjectId(userId)}, {enable: false}, function (err, result) {
//         if (!err && result > 0) {
//             console.log('User %s deleted successfully');
//             onSuccess({success: true});
//         } else if (err) {
//             throw err
//         } else {
//             onError({error: 'User not found'});
//         }
//     });
// }

/**
 * Actualización del perfil del usuario
 **/
// function getProfile( userId, onSuccess, onError ) {
//     models.User.findOne({
//         _id: new ObjectId( userId )
//     }, function ( err, user ) {
//         if ( user ) {
//             onSuccess( user );
//         }
//         else {
//             onSuccess( { success: false, code: 101, message: 'User not found.' } );
//         }
//     });
// }

module.exports = {
    updateProfile: updateProfile,
    verifyUniqueUserEmail : verifyUniqueUserEmail,
    advancedUserSearch: advancedUserSearch,
    newSearchUsers: newSearchUsers,
    changePassword: changePassword,
    getAllUsers: getAllUsers
    // getProfile: getProfile,
    // queryUsers: queryUsers,
    // deleteUser: deleteUser
};



