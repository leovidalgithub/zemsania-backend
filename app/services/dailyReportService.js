var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;
var projectUsersService = require('../services/projectUsersService');
var notificationService = require('../services/notificationService');
var holidaysService = require('../services/holidaysService');
var calendarService = require('../services/calendarService');
var request = require('request');


/*
 * Sacar todos los dias entre las dos fechas
 */
function getDailyReports(userId, initDate, endDate, onSuccess) {
    models.DailyReport.find({
        userId: new ObjectId(userId),
        date: {'$gte': initDate, '$lte': endDate}
    }, function (err, dailyReports) {
        if (err) throw err;
        onSuccess(dailyReports);
    });
}

/*
 * Sacar todos los dias entre las dos fechas
 */
function getDailyReportsGrid(userId, initDate, endDate, onSuccess, onError) {
    projectUsersService.getProjectsByUserIDBetweenDates(userId, initDate, endDate, function (resultProjects) {
        var projects = resultProjects.projects;
        getDailyReports(userId, initDate, endDate, function (resultDailyReports) {
            var dailyReports = resultDailyReports;
            getDaysBlocked(userId, initDate, endDate, function (resultDaysBlocked) {
                var datesBlocked = resultDaysBlocked.datesBlocked;
                var datesWorking = resultDaysBlocked.dayWorkingDays;
                onSuccess({
                    success: true,
                    'projects': projects,
                    'dailyReports': dailyReports,
                    'datesBlocked': datesBlocked,
                    'datesWorking': datesWorking
                });
            });
        });
    });
}

/**
 * Obtienes los dias bloqueados entre dos fechas.
 */
function getDaysBlocked(userId, initDate, endDate, onSuccess) {
    calendarService.getDaysBlockedByUserID(userId, function (resultDaysBlocked) {
        var datesBlocked = resultDaysBlocked.daysBlocked;
        var dayWorkingDays = resultDaysBlocked.dayWorkingDays;
        var datesBlockedFiltered = [];
        var datesWorkinFiltered = [];
        initDate = new Date(initDate);
        endDate = new Date(endDate);
        if (datesBlocked) {
            datesBlocked.forEach(function (date, key) {
                if (date >= initDate && date <= endDate) {
                    datesBlockedFiltered.push(date);
                }
            });
        }
        if (dayWorkingDays) {
            dayWorkingDays.forEach(function (date, key) {
                if (date >= initDate && date <= endDate) {
                    datesWorkinFiltered.push(date);
                }
            });
        }

        onSuccess({success: true, 'datesBlocked': datesBlockedFiltered, 'dayWorkingDays': datesWorkinFiltered});
    });
}

/**
 * Obtienes los conceptos diarios
 */
function getDailyConcepts(onSuccess) {
    models.ConceptDaily.find({}, function (err, conceptDailies) {
        if (err) throw err;
        onSuccess(conceptDailies);
    });
}


/*
 * Imputar horas
 */
function imputeHours(userId, dailysReport, onSuccess, onError) {
    var queries = [];
    var errors = [];
    dailysReport.forEach(function (dailyReport, key) {
        queries.push((function (j) {
            return function (callback) {
                checkImputeHours(userId, dailyReport, function (result) {
                    if (result) {
                        dailyReport.status = constants.imputed;
                        dailyReport.userId = userId;
                        models.DailyReport.findOneAndUpdate({
                            date: new Date(dailyReport.date),
                            userId: new ObjectId(dailyReport.userId),
                            projectId: new ObjectId(dailyReport.projectId),
                            conceptId: new ObjectId(dailyReport.conceptId)
                        }, dailyReport, {upsert: true}, function (err, dailyReport) {
                            if (err) throw err;
                            callback();
                        });
                    } else {
                        errors.push({day: dailyReport, error: 'errorMsg'});
                        callback();
                    }
                }, function (errorMsg) {
                    errors.push({day: dailyReport, error: errorMsg});
                    callback();
                });
            };
        })(key));
    });
    async.parallel(queries, function () {
        if (errors.length > 0) {
            onSuccess({success: false, errors: errors});
        } else {
            onSuccess({success: true});
        }
    });
}

/**
 * Chequea si el reporte diario es correcto
 * @param dailyReport
 * @param onSuccess
 * @param onError
 */
function checkImputeHours(userId, dailyReport, onSuccess, onError) {
    countHoursProjectUser(userId, dailyReport.date, dailyReport.projectId, function (hoursTotal) {
        projectUsersService.checkProjectUserDate(userId, dailyReport, hoursTotal, function (result) {
            checkImputeHoursInHolidays(userId, dailyReport, onSuccess, onError)
        }, onError);
    });
}


/**
 * Chequea si se esta imputando en un dia de vacaciones
 * @param dailyReport
 * @param onSuccess
 * @param onError
 */
function checkImputeHoursInHolidays(userId, dailyReport, onSuccess, onError) {
    calendarService.getDaysBlockedByUserID(userId, function (daysBlockedResult) {
        var date = new Date(dailyReport.date);
        var result = true;

        if (typeof daysBlockedResult.daysBlocked === 'undefined') {
            daysBlockedResult.daysBlocked = [];
        }

        daysBlockedResult.daysBlocked.forEach(function (day, key) {
            if (day.getTime() === date.getTime()) {
                result = false;
            }
        });
        if (result) {
            onSuccess(true);
        } else {
            onError('imputed_in_holidays');
        }
    });
}


/*
 * Busca Dias
 */
function searchDailyReports(form, onSuccess, onError) {

    var query = [];

    if (form.date) {
        query.push({
            date: form.date
        });
    }

    if (form.userId) {
        query.push({
            userId: new ObjectId(userId)
        });
    }

    if (form.type) {
        query.push({
            type: {
                '$regex': form.type
            }
        });
    }

    if (form.enabled) {
        query.push({
            enabled: form.enabled
        });
    }

    if (form.status) {
        query.push({
            type: {
                '$regex': form.status
            }
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

    models.DailyReport.aggregate(aggregate, function (err, days) {
        if (err) throw err;
        onSuccess({success: true, days: days});
    });
}

function sendDailyReports(userId, initDate, endDate, onSuccess, onError) {
    models.User.findOne({
        _id: new ObjectId(userId)
    }, function (err, user) {
        if (err) throw err;
        if (user) {
            changeStatusDailyReports(userId, initDate, endDate, constants.sent, function () {

                //Crea la notificacion al supervisor
                var text = user.name + ' ' + user.surname;
                projectUsersService.getProjectsByUserIDBetweenDates(userId, initDate, endDate, function (projectsResult) {
                    var supervisorIdSent = [];
                    projectsResult.projects.forEach(function (project, key) {
                        if (supervisorIdSent.indexOf(project.emailSupervisor) == -1) {
                            supervisorIdSent.push(project.emailSupervisor);
                            models.User.findOne({
                                username: project.emailSupervisor
                            }, function (err, supervisor) {
                                if (err) throw err;
                                if (supervisor) {
                                    notificationService.createNotification(userId, supervisor.userId, constants.hours_sent, text, initDate, endDate);
                                }
                            });
                        }
                    });
                });

                onSuccess({success: true});
            }, onError);

            //Envia los DailyReport a la arcaica y troglodita palataforma de ITRH
            initDate = new Date(initDate);
            endDate = new Date(endDate);
            if (initDate.getUTCMonth() === endDate.getUTCMonth()) {
                sendDailyReportsToITRH(userId, user.candidatoId, initDate, endDate);
            } else {
                //Hay dos o mas meses...
                var months = endDate.getUTCMonth() - initDate.getUTCMonth();
                for (var i = 0; i < months; i++) {
                    var newInitDate = initDate;
                    newInitDate.setUTCMonth(initDate.getUTCMonth() + i);
                    var newEndDate = newInitDate;
                    newEndDate.setMonth(initDate.getUTCMonth() + 1);
                    sendDailyReportsToITRH(userId, user.candidatoId, newInitDate, newEndDate);
                }
            }
        } else {
            onSuccess({success: false, code: 101, message: 'User not found.'});
        }
    });
}

function sendDailyReportsBySupervisor(supervisorId, userId, initDate, endDate, onSuccess, onError) {
    models.User.findOne({
        _id: new ObjectId(supervisorId)
    }, function (err, supervisor) {
        if (err) throw err;
        if (supervisor) {
            sendDailyReports(userId, initDate, endDate, function (result) {
                var text = supervisor.name + ' ' + supervisor.surname;
                notificationService.createNotification(supervisor.userId, userId, constants.hours_sent, text, initDate, endDate);

                onSuccess(result);
            }, onError);
        } else {
            onSuccess({success: false, code: 101, message: 'Supervisor User not found.'});
        }
    });
}


function validateDailyReports(supervisorId, userId, initDate, endDate, onSuccess, onError) {
    models.User.findOne({
        _id: new ObjectId(supervisorId)
    }, function (err, supervisor) {
        if (err) throw err;
        if (supervisor) {
            changeStatusDailyReports(userId, initDate, endDate, constants.validated, function () {
                var text = supervisor.name + ' ' + supervisor.surname;
                notificationService.createNotification(supervisor.userId, userId, constants.hours_validated, text, initDate, endDate);

                //Crea la notificacion al supervisor
                projectUsersService.getProjectsByUserIDBetweenDates(userId, initDate, endDate, function (projectsResult) {
                    var supervisorDeliveryIdSent = [];
                    projectsResult.projects.forEach(function (project, key) {
                        if (supervisorDeliveryIdSent.indexOf(project.emailSupervisorDelivery) == -1) {
                            supervisorDeliveryIdSent.push(project.emailSupervisorDelivery);
                            models.User.findOne({
                                username: project.emailSupervisorDelivery
                            }, function (err, supervisorDelivery) {
                                if (err) throw err;
                                if (supervisorDelivery) {
                                    notificationService.createNotification(userId, supervisorDelivery.userId, constants.hours_validated, text, initDate, endDate);
                                }
                            });
                        }
                    });
                });
            }, onError);

            onSuccess({success: true});
        } else {
            onSuccess({success: false, code: 101, message: 'Supervisor User not found.'});
        }
    });
}


function rejectDailyReports(supervisorId, userId, initDate, endDate, onSuccess, onError) {
    models.User.findOne({
        _id: new ObjectId(supervisorId)
    }, function (err, supervisor) {
        if (err) throw err;
        if (supervisor) {
            changeStatusDailyReports(userId, initDate, endDate, constants.rejected, function () {
                var text = supervisor.name + ' ' + supervisor.surname;
                notificationService.createNotification(supervisor.userId, userId, constants.hours_rejected, text, initDate, endDate);
            }, onError);

            onSuccess({success: true});
        } else {
            onSuccess({success: false, code: 101, message: 'Supervisor User not found.'});
        }
    });
}


function changeStatusDailyReports(userId, initDate, endDate, status, onSuccess, onError) {
    initDate = new Date(initDate);
    endDate = new Date(endDate);
    if (endDate < initDate) {
        onError('ENDDATE ES MENOR QUE INITDATE!');
        return;
    }
    models.DailyReport.update({
        userId: new ObjectId(userId),
        date: {'$gte': initDate, '$lte': endDate}
    }, {status: status}, {multi: true}, function (err, dailyReports) {
        if (err) throw err;
        onSuccess();
    });
}

function countHoursProjectUser(userId, day, projectId, onResult) {
    models.DailyReport.aggregate([{
            $match: {
                projectId: new ObjectId(projectId),
                userId: new ObjectId(userId),
                "date": {$ne: new Date(day)}
            }
        },
            {$group: {_id: null, total: {$sum: '$hours'}}}
        ], function (err, totalResult) {
            if (err) throw err;
            if (totalResult && totalResult.length > 0) {
                onResult(totalResult[0].total);
            } else {
                onResult(0);
            }
        }
    );
}


function sendDailyReportsToITRH(userId, candidatoId, initDate, endDate) {
    initDate.setDate(1);
    endDate.setMonth(endDate.getUTCMonth() + 1);
    endDate.setDate(1);

    models.DailyReport.find({
        userId: new ObjectId(userId),
        date: {'$gte': initDate, '$lt': endDate}
    }, function (err, dailyReports) {
        if (err) throw err;

        var monthsReportsToSend = [];
        var pojectsFiltered = [];

        var queries = [];
        dailyReports.forEach(function (dailyReport, key) {
            if (pojectsFiltered.indexOf(dailyReport.projectId.toString()) === -1) {
                pojectsFiltered.push(dailyReport.projectId.toString());
                queries.push((function (j) {
                    return function (callback) {

                        models.Project.findOne({
                            _id: dailyReport.projectId
                        }, function (err, project) {
                            if (err) throw err;

                            var dailyReportsToSend = {
                                candidatoId: candidatoId,
                                mes: initDate.getUTCMonth() + 1,
                                anyo: initDate.getUTCFullYear(),
                                proyectoId: project.projectRef
                            };

                            models.DailyReport.find({
                                projectId: dailyReport.projectId,
                                userId: new ObjectId(userId),
                                date: {'$gte': initDate, '$lt': endDate}
                            }, function (err, dailyReportsByProject) {
                                if (err) throw err;
                                dailyReportsByProject.forEach(function (dailyReportByProject, i) {
                                    var alias = 'srv_cantidad' + dailyReportByProject.conceptDailyId;
                                    var units = 0;
                                    if (typeof dailyReportByProject.units !== 'undefined') {
                                        units += dailyReportByProject.units;
                                    }
                                    if (typeof dailyReportsToSend[alias] !== 'undefined') {
                                        units += dailyReportsToSend[alias];
                                    }
                                    dailyReportsToSend[alias] = units;
                                });

                                monthsReportsToSend.push(dailyReportsToSend);

                                callback();
                            });
                        });
                    };
                })(key));
            }
        });
        async.parallel(queries, function () {
            console.log(monthsReportsToSend);
            monthsReportsToSend.forEach(function (monthReportsToSend, i) {
                var objectToSend = {importDailyReports:{dailyReport:[monthReportsToSend]}};
                var objectString =  JSON.stringify(objectToSend);
                var urlString = global.config.itrhUrl + '/ITRH/ws/importDailyReports';
                request.post({url: urlString, form: objectString},
                    function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            console.log(body);
                        }
                    }
                );
            });
        });


        /*

         var dailyReportsToSendOriginal = {
         candidatoId: username,
         mes: initDate.getUTCMonth() + 1,
         anyo: initDate.getUTCFullYear()
         };

         {
         ****candidatoId=2263,
         ****mes=1,
         ****anyo=2016,
         ****proyectoId=6911,
         ****srv_cantidad12=0,00,
         ****srv_cantidad11=0,00,
         ****srv_cantidad10=0,00,
         ****srv_cantidad15=0,00,
         ****srv_cantidad14=0,00,
         ****srv_cantidad13=0,00,
         ****srv_cantidad1=20,00,
         ****srv_cantidad21=0,00,
         ****srv_cantidad4=0,00,
         ****srv_cantidad20=0,00,
         ****srv_cantidad5=0,00,
         ****srv_cantidad23=0,00,
         ****srv_cantidad2=0,00,
         ****srv_cantidad22=0,00,
         ****srv_cantidad3=0,00,
         ****srv_cantidad25=0,00,
         ****srv_cantidad24=0,00,
         ****srv_cantidad19=0,00,
         ****srv_cantidad6=0,00,
         ****srv_cantidad26=0,00
         }*/
    });
}

module.exports = {
    checkImputeHours: checkImputeHours,
    countHoursProjectUser: countHoursProjectUser,
    getDailyReports: getDailyReports,
    getDailyReportsGrid: getDailyReportsGrid,
    getDaysBlocked: getDaysBlocked,
    getDailyConcepts: getDailyConcepts,
    imputeHours: imputeHours,
    rejectDailyReports: rejectDailyReports,
    searchDailyReports: searchDailyReports,
    sendDailyReports: sendDailyReports,
    sendDailyReportsBySupervisor: sendDailyReportsBySupervisor,
    sendDailyReportsToITRH: sendDailyReportsToITRH,
    validateDailyReports: validateDailyReports
};

