var express = require('express');
var router = express.Router();
var async = require('async');
var mailService = require('./mailService');
var passwordHash = require('password-hash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');

/*
 * Busca usuarios
 */

function searchUsers(form, onSuccess, onError) {

    var query = [];

    if (form.username) {
        query.push({
            username: form.username
        });
    }

    if (form._id) {
        query.push({
            _id: new ObjectId(form._id)
        });
    }

    if (form.name) {
        query.push({
            name: {
                '$regex': form.name
            }
        });
    }

    if (form.surname) {
        query.push({
            surname: {
                '$regex': form.surname
            }
        });
    }

    if (form.nif) {
        query.push({
            nif: {
                '$regex': form.nif
            }
        });
    }

    if (form.enabled) {
        query.push({
            enabled: form.enabled
        });
    } else {
        query.push({
            enabled: true
        });
    }

    if (form.activated) {
        query.push({
            activated: form.activated
        });
    }

    var aggregate = [];
    if (query.length > 0) {
        aggregate.push({
            '$match': {
                $and: query
            }
        });
    }

    //aggregate.push(projection);


    var page = form.page == undefined ? 0 : form.page;
    var rows = form.rows == undefined ? 10 : form.rows;

    if (page > -1) {

        aggregate.push({
            '$skip': (page * rows)
        });

        aggregate.push({
            '$limit': rows
        });
    }

    models.User.aggregate(aggregate, function (err, users) {
        if (err) throw err;
        onSuccess({success: true, users: users});
    });
}

function queryUsers(query, callback) {
    models.User.find(query, function(err, users) {
        callback(err ? [] : users);
    });
};


/*
 * Sacar todos los usuarios
 */
function getAllUsers(onSuccess, onError) {
    models.User.find({
        enabled: true
    }, function (err, users) {
        if (err) throw err;
        onSuccess({success: true, users: users});
    });
}

/**
 * Actualización del perfil del usuario
 **/
function updateProfile(userId, form, onSuccess, onError) {
    var roles = ['ROLE_USER'];
    if (form.roles && form.roles.length > 0) {
        for (var i = 0; i < form.roles.length; i++) {
            if (roles.indexOf(form.roles[i]) == -1 && constants.roles.indexOf(form.roles[i]) != -1) {
                roles.push(form.roles[i]);
            }
        }
    }
    models.User.findOne({
        _id: new ObjectId(userId)
    }, function (err, user) {
        if (user) {

            if (form.birthdate) {
                user.birthdate = moment(form.birthdate, 'DD/MM/YYYY').toISOString();

            }
            user.zimbra_cosID = form.zimbra_cosID;
            user.locale = form.locale;
            user.nif = form.nif;
            user.name = form.name;
            user.sex = form.sex;
            user.roles = roles;
            user.surname = form.surname;
            user.birthdate = form.birthdate;
            
            if (form.workloadScheme) user.workloadScheme = form.workloadScheme;
            if (form.holidayScheme) user.holidayScheme = form.holidayScheme;
            if (form.superior) user.superior = form.superior;
            if (form.company) user.company = form.company

            //Falta actualizar todas las ubicaciones de los productos del usuario
            user.save(function (err) {
                if (err) throw err;
                console.log('Profile for user %s saved successfully', userId);
                onSuccess({success: true});
            });
        }
        else {
            onSuccess({success: false, code: 101, message: 'User not found.'});
        }
    });
}


/**
 * getProfile from userId if exists
 **/
function changePassword(userId, form, onSuccess, onError) {
    // find the user
    models.User.findOne({
        _id: new ObjectId(userId)
    }, function (err, user) {
        if (!user) {
            onSuccess({success: false, code: 101, message: 'User not found.'});
        } else {
            // check if password matches
            if (!passwordHash.verify(form.oldPassword, user.password)) {
                onSuccess({success: false, code: 100, message: 'Wrong password'});
            } else {
                user.password = passwordHash.generate(form.newPassword);
                user.defaultPassword = false;
                user.save(function (err) {
                    if (err) throw err;
                    onSuccess({success: true});
                });
            }
        }
    });
}

/**
 * Elimina el usuario
 **/
function deleteUser(userId, form, onSuccess, onError) {
    models.User.findOneAndUpdate({_id: new ObjectId(userId)}, {enable: false}, function (err, result) {
        if (!err && result > 0) {
            console.log('User %s deleted successfully');
            onSuccess({success: true});
        } else if (err) {
            throw err
        } else {
            onError({error: 'User not found'});
        }
    });
}

/**
 * Actualización del perfil del usuario
 **/
function getProfile(userId, onSuccess, onError) {
    models.User.findOne({
        _id: new ObjectId(userId)
    }, function (err, user) {
        if (user) {
            onSuccess(user);
        }
        else {
            onSuccess({success: false, code: 101, message: 'User not found.'});
        }
    });
}

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    searchUsers: searchUsers,
    queryUsers: queryUsers,
    changePassword: changePassword,
    getAllUsers: getAllUsers,
    deleteUser: deleteUser
};

