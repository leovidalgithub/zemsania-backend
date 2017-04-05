// var express = require('express');
// var router = express.Router();
// var async = require('async');
// var mailService = require('./mailService');
var passwordHash = require( 'password-hash' );
    mongoose     = require( 'mongoose' );
    ObjectId     = require( 'mongoose' ).Types.ObjectId;
    moment       = require( 'moment' );

// USERS FINDER FOR ADVANCED SEARCH IN EMPLOYEE-MANAGER
function searchUsers( form, onSuccess, onError ) { // LEO WAS HERE
    var textToFind = form.textToFind;
    var regExp = new RegExp( '' + textToFind );

    aggregate = [
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
            onError( { success: false, code: 500, msg: 'Error getting Users Profile.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Users by Advanced search', users: users } );
        }
    });


}

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




// GET USER PROFILE FOR MANAGER-EMPLOYEE-EDIT WITH COMPANY-ENTERPRISE POPULATED 
function newSearchUsers( data, onSuccess, onError ) { // LEO WORKING HERE
    var id = data._id;
    models.User.findOne( { _id: new ObjectId( id ) })
        .populate( 'company','enterpriseName' )
        .exec( function ( err, user ) {
            if ( err ) {
                onError( { success: false, code: 500, msg: 'Error getting User Profile.' } );
            } else {
                onSuccess( { success: true, code: 200, msg: 'User Profile', user: user } );
            }
    });
}

function queryUsers(query, callback) {
    models.User.find(query, function(err, users) {
        callback(err ? [] : users);
    });
};


/*
 * return all users. No counts enabled
 */
function getAllUsers( onSuccess, onError ) { // LEO WAS HERE
    models.User.find( {},
     function ( err, users ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting all users.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'All users list', users : users } );
        }
    });
}







/**
 * User Profile update. Either from #!/profile or EmployeeManager.
 **/
function updateProfile( userProfile, onSuccess, onError ) { // ***************** LEO WAS HERE *****************
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
    models.User.findOne({ // global.models (server-app.js)
        _id: new ObjectId( userId )
    }, function ( err, user ) {
        if ( user ) {
            if ( userProfile.birthdate ) { 
                   user.birthdate = moment( userProfile.birthdate, 'DD/MM/YYYY' ).toISOString();
            };
            // user.username          = userProfile.username; // does not overwirte email
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
                    onError( { success: false, code: 500, msg: 'Error updating User Profile.' } );
                    // throw err;  
                } else {
                    console.log( 'Profile for user %s saved successfully', userId );
                    onSuccess( { success: true, code: 200, msg: 'User Profile updated correctly' } );                    
                }
            });
        } else {
            onError( { success: false, code: 500, msg: 'User not found.' } );
        };
    });
}
/**
    * verifyUniqueUserEmail - Verifies if email given already exist in BDD
 **/
function verifyUniqueUserEmail( emailToVerify, onSuccess, onError ) { // ***************** LEO WAS HERE *****************
    models.User.findOne({ // global.models (server-app.js)
        'username' : emailToVerify
    }, function ( err, emailFound ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error on BDD access!' } );            
        } else {
            if ( emailFound ) {
                onSuccess( { success: true, code: 200, found: true, msg: 'Email already exists' } );
            } else {
                onSuccess( { success: true, code: 200, found: false, msg: 'Email not exists' } );
            }            
        };
    });
}


/**
 * change password
 **/
function changePassword( userId, form, onSuccess, onError ) { // LEO WORKING HERE
// console.log('changePassword');
// console.log(form);
// var aa = passwordHash.generate( '1234' );
// Rush2112_ // sha1$f93499e8$1$905fd45e92568f76c132dbea760cf6fe61875bcc
// 1234      // sha1$3af50874$1$45fc65cf162f382dd805f13bfd2e82e6890e995b
// console.log(aa);

    models.User.findOne( {
        _id: new ObjectId( userId )
    }, function ( err, user ) {

        if ( err ) {
            onError( { success: false, code: 401, message: 'Error finding User.'} );
        } else {
            if ( !user ) {
                onSuccess( { success: false, code: 101, message: 'User not found.'} );
            } else {
                if ( !passwordHash.verify( form.currentPassword, user.password ) ) {
                    onSuccess( { success: false, code: 102, message: 'Wrong current password.' } );
                } else {
                    user.password = passwordHash.generate( form.newPassword );
                    user.defaultPassword = false;
                    user.save( function ( err ) {
                        if ( err ) {
                            onError( { success: false, code: 402, message: 'Error saving new password.'} );
                        } else {
                            onSuccess( { success: true, code: 200, message: 'Password changed successfully.' } );
                        };
                    });
                }
            }
        }

    });
}

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
function getProfile( userId, onSuccess, onError ) {
    models.User.findOne({
        _id: new ObjectId( userId )
    }, function ( err, user ) {
        if ( user ) {
            onSuccess( user );
        }
        else {
            onSuccess( { success: false, code: 101, message: 'User not found.' } );
        }
    });
}

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    verifyUniqueUserEmail : verifyUniqueUserEmail,
    searchUsers: searchUsers,
    newSearchUsers: newSearchUsers,
    queryUsers: queryUsers,
    changePassword: changePassword,
    getAllUsers: getAllUsers
    // deleteUser: deleteUser
};



