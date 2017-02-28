var express = require('express');
var router = express.Router();
var async = require('async');
var mailService = require('./mailService');
var passwordHash = require('password-hash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var notificationService = require('../services/notificationService');


/*
 * Sacar todas las notificaciones del usuario
 */
function getSpentsByUserId(userId, onSuccess) {
    models.Spent.find({
        userId: new ObjectId(userId)
    }, function (err, spents) {
        if (err) throw err;
        onSuccess({success: true, spents: spents});
    });
}


/*
 * Buscar con un _id
 */
function getSpentById(spentId, onSuccess, onError) {
    models.Spent.find({
        _id: new ObjectId(spentId)
    }, function (err, spent) {
        if (err) throw err;
        if(spent.length){
            onSuccess({success: true, spent: spent[0]});
        }else {
            onError({success: false, spent: []});
        }

    });
}


/*
 * Aprueba el gasto de un usuario
 */
function approveSpents(supervisorId, spentId, onSuccess) {
    changeStatusSpent(spentId, constants.approved);
    models.Spent.findOne({
        _id: new ObjectId(spentId)
    }, function (err, spent) {
        if (err) throw err;
        if (spent) {
            models.User.findOne({
                _id: spent.userId
            }, function (err, user) {
                if (err) throw err;
                if (user) {
                    models.User.findOne({
                        _id: new ObjectId(supervisorId)
                    }, function (err, supervisor) {
                        if (err) throw err;
                        if (supervisor) {
                            notificationService.createNotification(supervisor.userId, user.userId,
                                constants.spent_approved, constants.spent_approved, spent.date, spent.date);
                        }
                    });
                }
            });

        }
    });

    onSuccess({success: true});
}

/*
 * Rechaza el gasto de un usuario
 */
function rejectSpent(supervisorId, spentId, onSuccess) {
    changeStatusSpent(spentId, constants.rejected);
    models.Spent.findOne({
        _id: new ObjectId(spentId)
    }, function (err, spent) {
        if (err) throw err;
        if (spent) {
            models.User.findOne({
                _id: spent.userId
            }, function (err, user) {
                if (err) throw err;
                if (user) {
                    models.User.findOne({
                        _id: new ObjectId(supervisorId)
                    }, function (err, supervisor) {
                        if (err) throw err;
                        if (supervisor) {
                            notificationService.createNotification(supervisor.userId, user.userId,
                                constants.spent_rejected, constants.spent_rejected, spent.date, spent.date);
                        }
                    });
                }
            });

        }
    });

    onSuccess({success: true});
}

/*
 * Cambia el estado del gasto
 */
function changeStatusSpent(spentId, statusForm) {
    models.Spent.findOneAndUpdate({_id: new ObjectId(spentId)}, {status: statusForm}, {upsert: true},
        function (err, doc) {
            if (err) throw err;
        });
}

/*
 * Elimina el gasto de un usuario
 */
function deleteSpent(userId, spentId, onSuccess) {
    models.Spent.remove({
        _id: new ObjectId(spentId),
        status: constants.spent_sent,
        userId: new ObjectId(userId)
    }, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}

/*
 * Elimina el gasto de un usuario
 */
function deleteSpentById(spentId, onSuccess) {
    models.Spent.remove({
        _id: new ObjectId(spentId)
    }, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}

/*
 * Salva el gasto
 */
function saveSpent(spentForm, onSuccess, onError) {
    if (spentForm._id) {
        models.Spent.findOneAndUpdate({_id: new ObjectId(spentForm._id)}, spentForm, function (err, doc) {
            if (err) {
                return onError({error: err});
            }
        });
    } else {
        var spent = new models.Spent(spentForm);
        spent.save();
    }
    onSuccess({success: true});
}


/*-------------------------------------- TIPOS ----------------------------------*/

/*
 * Sacar todas tipos de gastos
 */
function getSpentTypes(onSuccess) {
    models.ConceptSpent.find({enabled: true}, function (err, spentsTypes) {
        if (err) throw err;
        onSuccess({success: true, spentsTypes: spentsTypes});
    });
}


/*
 * Elimina el tipo de gasto
 */
function deleteSpentType(spentTypeId, spentId, onSuccess) {
    models.ConceptSpent.findOneAndUpdate({
        _id: new ObjectId(spentTypeId)
    }, {enabled: false}, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}

/*
 * Salva el tipo gasto
 */
function saveSpentType(spentTypeForm, onSuccess, onError) {
    if (spentTypeForm._id) {
        models.ConceptSpent.findOneAndUpdate({_id: new ObjectId(spentTypeForm._id)}, spentTypeForm, function (err, doc) {
            if (err) {
                return onError({error: err});
            }
        });
    } else {
        var spentType = new models.ConceptSpent(spentTypeForm);
        spentType.save();
    }
    onSuccess({success: true});
}


/*
 * Busca los gastos imputados
 */
function searchSpent(form, onSuccess, onError) {
    var query = [];
    if (form._id) {
        query.push({
            _id: new ObjectId(form._id)
        });
    }
    if (form.userId) {
        query.push({
            userId: new ObjectId(form.userId)
        });
    }
    if (form.status) {
        query.push({
            status: form.status
        });
    }
    if (form.initDate && form.endDate) {
        query.push({
            date:  { $gte:  new Date(form.initDate), $lte: new Date(form.endDate)}
        });
    }
    if (form.initPrice && form.endPrice) {
        query.push({
            price:  { $gte: form.initPrice, $lte: form.endPrice }
        });
    }
    if (form.conceptSpentId) {
        query.push({
            conceptSpentId: new ObjectId(form.conceptSpentId)
        });
    }
    if (typeof form.attachment !== 'undefined') {
        if(form.attachment) {
            query.push({
                imageId:  { $ne: null }
            });
        }else {
            query.push({
                imageId: null
            });
        }
    }
    var aggregate = [];
    if (query.length > 0) {
        aggregate.push({
            '$match': {
                $and: query
            }
        });
    }

    var page = form.page === undefined ? 0 : form.page;
    var rows = form.rows === undefined ? 10 : form.rows;

    if (page > -1) {

        aggregate.push({
            '$skip': (page * rows)
        });

        aggregate.push({
            '$limit': rows
        });
    }

    models.Spent.aggregate(aggregate, function (err, spents) {
        if (err) throw err;
        onSuccess({success: true, spents: spents});
    });
}

module.exports = {
    getSpentsByUserId: getSpentsByUserId,
    approveSpents: approveSpents,
    getSpentById: getSpentById,
    deleteSpent: deleteSpent,
    deleteSpentById: deleteSpentById,
    saveSpent: saveSpent,
    rejectSpent: rejectSpent,
    getSpentTypes: getSpentTypes,
    deleteSpentType: deleteSpentType,
    saveSpentType: saveSpentType,
    searchSpent: searchSpent
};

