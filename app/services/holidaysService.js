var express = require('express');
var router = express.Router();
var async = require('async');
var mailService = require('./mailService');
var passwordHash = require('password-hash');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');


/*
 * Comprueba si el dia es de vacaciones para el usuario
 */
function checkUserDatesInHoliDays(userId, day, onSuccess, onError) {
    models.Holidays.find({
        userId: new ObjectId(userId),
        date: new Date(day)
    }, function (err, holidays) {
        if (err) throw err;
        if (holidays && holidays.length > 0) {
            onError('imputed_in_holidays');
        } else {
            onSuccess({success: true});
        }
    });
}

/*
 * Sacar todas vacaciones del usuario
 */
function getHolidaysByUserID(userId, onSuccess, onError) {
    var firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);

    models.Holidays.find({
        userId: new ObjectId(userId),
        date: {"$gte": firstDayOfYear} //Mayor o igual
    }, function (err, holidays) {
        if (err) throw err;

        onSuccess({success: true, holidays: holidays});
    });
}

/*
 * Sacar los dias de vacaciones entre dos fechas del usuario
 */
function getHolidaysBetweenDatesByUserID(userId, initDate, endDate, onSuccess) {
    models.Holidays.find({
        userId: new ObjectId(userId),
        status: constants.approved,
        $and: [
            {date: {'$gte': initDate}},//Mayor o igual
            {date: {'$lte': endDate}}//Menor o igual
        ]
    }, {
        '_id': 0,
        'userId': 0,
        'createdAt': 0,
        'status': 0,
        '__v': 0
    }, function (err, holidays) {
        if (err) throw err;
        onSuccess(holidays);
    });
}


/*
 * Sacar todas vacaciones del usuario
 */
function getHolidaysDatesByUserID(userId, onSuccess) {
    var firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    models.Holidays.find({
        userId: new ObjectId(userId),
        date: {"$gte": firstDayOfYear} //Mayor o igual
    }, {
        '_id': 0,
        'userId': 0,
        'createdAt': 0,
        'status': 0,
        '__v': 0
    }, function (err, holidaysResult) {
        if (err) throw err;
        var holidays = [];
        holidaysResult.forEach(function (holiday, key) {
            holidays.push(holiday.date);
        });

        onSuccess({success: true, holidays: holidays});
    });
}


/*
 * Solicita los dias de vacaciones
 */
function requestUserHolidays(userId, holidays, onSuccess, onError) {
    var clone = [];
    holidays.forEach(function (day, key) {
        clone.push(new Date(day));
    });
    holidays = clone;

    checkUserHolidays(userId, holidays, function () {
        var queries = [];
        holidays.forEach(function (day, key) {
            queries.push((function (j) {
                return function (callback) {
                    var holiday = new models.Holidays();
                    holiday.date = day;
                    holiday.userId = new ObjectId(userId);
                    holiday.save(function (err) {
                        if (err) throw err;
                        callback();
                    });
                }
            })(key));
        });
        async.parallel(queries, function () {
            onSuccess({success: true});
        });
    }, onError);
}

/**
 * Comprueba que no se haya solicitado el mismo dia y los dias disponibles de un usuario
 * @param userId
 * @param holidays
 * @param onSuccess
 * @param onError
 */
function checkUserHolidays(userId, holidays, onSuccess, onError) {
    db.collection('holidays').count({
        userId: new ObjectId(userId),
        date: {'$in': holidays}
    }, function (err, count) {
        if (err) throw err;
        if (count > 0) {
            onError({
                success: false, message: 'holidaysAlreadyRequested'
            })
            ;
        } else {
            //Check numero total de dias disponibles
            var firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
            models.Holidays.count({
                userId: new ObjectId(userId),
                date: {"$gte": firstDayOfYear} //Mayor o igual
            }, function (err, count) {
                if (err) throw err;
                if (count > constants.holidaysTotal) {
                    onError({success: false, message: 'exceededHolidays'});
                } else {
                    onSuccess();
                }
            });
        }
    });
}

/*
 * Aprueba los dias de vacaciones a un usuario
 */
function approveHolidays(holidaysId, onSuccess, onError) {
    holidaysId.forEach(function (dayId, key) {
        changeStatusHoliday(dayId, constants.approved);
    });
    onSuccess({success: true});
}

/*
 * Rechaza los dias de vacaciones a un usuario
 */
function rejectHolidays(holidaysId, onSuccess, onError) {
    holidaysId.forEach(function (dayId, key) {
        changeStatusHoliday(dayId, constants.rejected);
    });
    onSuccess({success: true});
}

/*
 * Cambia el estado de loos dias de vacaciones a un usuario
 */
function changeStatusHoliday(holidayId, statusForm) {
    models.Holidays.findOneAndUpdate({_id: new ObjectId(holidayId)}, {status: statusForm}, {upsert: true},
        function (err, doc) {
            if (err) throw err;
        });
}

/*
 * Elimina el dia de vacaciones a un usuario
 */
function deleteHoliday(userId, holidayId, onSuccess, onError) {
    console.log({_id: new ObjectId(holidayId), userId: new ObjectId(userId)});
    models.Holidays.remove({
        _id: new ObjectId(holidayId),
        status: constants.requested,
        userId: new ObjectId(userId)
    }, function (err) {
        if (err) throw err;
    });
    onSuccess({success: true});
}


/*
 * Busca las vacaciones
 */
function searchHoliday(form, onSuccess, onError) {
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

    models.Holidays.aggregate(aggregate, function (err, holidays) {
        if (err) throw err;
        onSuccess({success: true, holidays: holidays});
    });
}

module.exports = {
    checkUserDatesInHoliDays: checkUserDatesInHoliDays,
    getHolidaysByUserID: getHolidaysByUserID,
    getHolidaysDatesByUserID: getHolidaysDatesByUserID,
    getHolidaysBetweenDatesByUserID: getHolidaysBetweenDatesByUserID,
    requestUserHolidays: requestUserHolidays,
    approveHolidays: approveHolidays,
    rejectHolidays: rejectHolidays,
    deleteHoliday: deleteHoliday,
    searchHoliday: searchHoliday
};

