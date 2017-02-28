'use strict';

var ObjectId = require('mongoose').Types.ObjectId;
var notificationService = require('../services/notificationService');


/*
 * Sacar todas las notificaciones del usuario
 */
function getAbsencesByUserId(userId, onSuccess) {
    models.Absence.find({
        userId: new ObjectId(userId)
    }, function (err, absences) {
        if (err) throw err;
        onSuccess({success: true, absences: absences});
    });
}

/*
 * Buscar con un _id
 */
function getAbsenceById(absenceId, onSuccess, onError) {
    models.Absence.find({
        _id: new ObjectId(absenceId)
    }, function (err, absence) {
        if (err) throw err;
        if (absence.length) {
            onSuccess({success: true, absence: absence[0]});
        } else {
            onError({success: false, absence: []});
        }

    });
}

/*
 * Aprueba el gasto de un usuario
 */
function approveAbsences(supervisorId, absenceId, onSuccess) {
    changeStatusAbsence(absenceId, constants.approved);
    models.Absence.findOne({
        _id: new ObjectId(absenceId)
    }, function (err, absence) {
        if (err) throw err;
        if (absence) {
            models.User.findOne({
                _id: absence.userId
            }, function (err, user) {
                if (err) throw err;
                if (user) {
                    models.User.findOne({
                        _id: new ObjectId(supervisorId)
                    }, function (err, supervisor) {
                        if (err) throw err;
                        if (supervisor) {
                            notificationService.createNotification(supervisor.userId, user.userId,
                                constants.absence_approved, constants.absence_approved, absence.date, absence.date);
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
function rejectAbsence(supervisorId, absenceId, onSuccess) {
    changeStatusAbsence(absenceId, constants.rejected);
    models.Absence.findOne({
        _id: new ObjectId(absenceId)
    }, function (err, absence) {
        if (err) throw err;
        if (absence) {
            models.User.findOne({
                _id: absence.userId
            }, function (err, user) {
                if (err) throw err;
                if (user) {
                    models.User.findOne({
                        _id: new ObjectId(supervisorId)
                    }, function (err, supervisor) {
                        if (err) throw err;
                        if (supervisor) {
                            notificationService.createNotification(supervisor.userId, user.userId,
                                constants.absence_rejected, constants.absence_rejected, absence.date, absence.date);
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
function changeStatusAbsence(absenceId, statusForm) {
    models.Absence.findOneAndUpdate({_id: new ObjectId(absenceId)}, {status: statusForm}, {upsert: true},
        function (err, doc) {
            if (err) throw err;
        });
}

/*
 * Elimina la ausencia de un usuario
 */
function deleteAbsence(userId, absenceId, onSuccess) {
    models.Absence.remove({
        _id: new ObjectId(absenceId),
        status: constants.absences_sent,
        userId: new ObjectId(userId)
    }, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}

/*
 * Elimina la ausencia de un usuario
 */
function deleteAbsenceById(absenceId, onSuccess) {
    models.Absence.remove({
        _id: new ObjectId(absenceId)
    }, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}

/*
 * Salva el gasto
 */
function saveAbsence(absenceForm, onSuccess, onError) {
    if (absenceForm._id) {
        models.Absence.findOneAndUpdate({_id: new ObjectId(absenceForm._id)}, absenceForm, function (err, doc) {
            if (err) {
                return onError({error: err});
            }
        });
    } else {
        var absence = new models.Absence(absenceForm);
        absence.save();
    }
    onSuccess({success: true});
}


/*-------------------------------------- TIPOS ----------------------------------*/

/*
 * Sacar todas tipos de gastos
 */
function getAbsenceTypes(onSuccess) {
    models.ConceptAbsence.find({enabled: true}, function (err, absences) {
        if (err) throw err;
        onSuccess({success: true, absences: absences});
    });
}


/*
 * Elimina el tipo de gasto
 */
function deleteAbsenceType(absenceTypeId, absenceId, onSuccess) {
    models.ConceptAbsence.findOneAndUpdate({
        _id: new ObjectId(absenceTypeId)
    }, {enabled: false}, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}

/*
 * Salva el tipo gasto
 */
function saveAbsenceType(absenceTypeForm, onSuccess, onError) {
    if (absenceTypeForm._id) {
        models.ConceptAbsence.findOneAndUpdate({_id: new ObjectId(absenceTypeForm._id)}, absenceTypeForm, function (err, doc) {
            if (err) {
                return onError({error: err});
            }
        });
    } else {
        var absenceType = new models.ConceptAbsence(absenceTypeForm);
        absenceType.save();
    }
    onSuccess({success: true});
}


/*
 * Busca las ausencias
 */
function searchAbsence(form, onSuccess, onError) {
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
            date: {$gte: new Date(form.initDate), $lte: new Date(form.endDate)}
        });
    }
    if (form.initHours && form.endHours) {
        query.push({
            hours: {$gte: form.initHours, $lte: form.endHours}
        });
    }
    if (form.conceptAbsenceId) {
        query.push({
            conceptAbsenceId: new ObjectId(form.conceptAbsenceId)
        });
    }
    if (typeof form.attachment !== 'undefined') {
        if (form.attachment) {
            query.push({
                imageId: {$ne: null}
            });
        } else {
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

    models.Absence.aggregate(aggregate, function (err, absences) {
        if (err) throw err;
        onSuccess({success: true, absences: absences});
    });
}


module.exports = {
    getAbsencesByUserId: getAbsencesByUserId,
    approveAbsences: approveAbsences,
    deleteAbsence: deleteAbsence,
    deleteAbsenceById: deleteAbsenceById,
    saveAbsence: saveAbsence,
    rejectAbsence: rejectAbsence,
    getAbsenceTypes: getAbsenceTypes,
    deleteAbsenceType: deleteAbsenceType,
    getAbsenceById: getAbsenceById,
    saveAbsenceType: saveAbsenceType,
    searchAbsence: searchAbsence
};

