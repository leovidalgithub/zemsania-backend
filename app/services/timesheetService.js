var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var projectUsersService = require('../services/projectUsersService');
var authnService = require('../services/securityService');
var userService = require('../services/userService');
var Timesheet = models.Timesheet;
var json2xls = require('json2xls');
var path = require('path');
var fs = require('fs');
var mailService = require('./mailService');

function saveBulkTimesheets(data, callback) {
    var timesheets = []
    async.each(data, function(each, tick) {
        var dt = new Date(each.date);
        var startDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
        var endDate = new Date(startDate.getTime());
        endDate.setDate(endDate.getDate() + 1);
        Timesheet
            .findOne({
                employee: each.employee,
                project: each.project,
                container: each.container,
                type: each.type,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            })
            .exec(function(err, timesheet) {
                if (!err && timesheet) {
                    timesheet.comment = each.comment;
                    timesheet.value = each.value;
                    timesheet.status = each.status;
                    timesheet.save(function(err) {
                        if (!err) timesheets.push(timesheet);
                        tick()
                    });
                } else {
                    saveTimesheet(each, function(err, timesheet) {
                        if (!err) timesheets.push(timesheet);
                        tick();
                    });
                }
            });
    }, function() {
        callback(timesheets);
    });
}

function saveTimesheet(data, callback) {
    new Timesheet(data).save(callback);
};

function query(query, callback) {
    if (query instanceof Function) callback = query;
    var _q = query && query.constructor == Object ? query : {};
    Timesheet
        .find(_q)
        .exec(callback);
};

function getTimesheetsUnderSuperior(superiorId, callback, advanced_query) {
    advanced_query = advanced_query || {};
    userService.queryUsers({ superior: superiorId }, function(users) {
        var userIds = users.map(u => u._id);
        var query = { employee: { $in: userIds }, status: { $ne: 'draft' } };
        for (var key in advanced_query)
            if (advanced_query.hasOwnProperty(key)) query[key] = advanced_query[key];
        if (query.date) query.date = normalizeQueryDate(query.date);
        getGroupedTimesheets(query, callback);
    }, callback);
}

function getProjectTimesheets(projectId, callback) {
    getGroupedTimesheets({ project: ObjectId(projectId), status: { $ne: 'draft' } }, callback);
}

function getGroupedTimesheets(query, callback) {
    aggregate(
        [{
            $match: query
        }, {
            $group: {
                _id: {
                    employee: '$employee',
                    requestedDate: '$requestedDate',
                    status: '$status',
                    project: '$project',
                    type: '$type',
                    container: '$container'
                },
                timesheets: { $push: '$$ROOT' },
                startDate: { $min: '$date' },
                endDate: { $max: '$date' }
            }
        }, {
            $project: {
                employee: '$_id.employee',
                date: '$_id.requestedDate',
                status: '$_id.status',
                project: '$_id.project',
                type: '$_id.type',
                container: '$_id.container',
                startDate: 1,
                endDate: 1,
                timesheets: 1,
                _id: 0
            }
        }, {
            $sort: { date: -1 }
        }],
        function(err, timesheets) {
            if (err) return callback(err);
            models.Timesheet.populate(
                timesheets, [
                    { path: 'employee', select: 'name surname username email company', model: 'User' },
                    { path: 'project', select: 'name code', model: 'Project' }
                ],
                function(err) {
                    timesheets.forEach(t => {
                        t.timesheets.forEach(t => {
                            delete t.project;
                            delete t.employee;
                            delete t.requestedDate;
                            delete t.status;
                            delete t.type;
                            delete t.container;
                        });
                    });
                    callback(null, timesheets);
                })
        });
}

function aggregate(aggregationPipeline, callback) {
    var _q = aggregationPipeline && aggregationPipeline.constructor == Array ? aggregationPipeline : [{ $match: {} }]
    Timesheet.aggregate(aggregationPipeline).exec(callback);
};

function getTimesheet(timesheetId, callback) {
    Timesheet
        .findById(timesheetId)
        .exec(callback);
};

function updateTimesheet(timesheetId_or_query, updates, callback) {
    var doMulti = typeof timesheetId_or_query != "string" ? true : false;
    var query = doMulti ? timesheetId_or_query : { _id: timesheetId_or_query };
    Timesheet.update(query, updates, { multi: doMulti }).exec(callback);
};

function deleteTimesheet(timesheetId_or_query, callback) {
    if (!timesheetId_or_query) return callback(new Error('invalid or no arguments provided'));
    var query = typeof timesheetId_or_query === "string" ? { _id: timesheetId_or_query } : timesheetId_or_query;
    Timesheet.remove(query, callback);
};

function exportExcel(opt, callback) {
    if (!opt) opt = {};
    if (!opt.employee || !opt.startDate || !opt.endDate || !opt.exportAs)
        return callback({ message: 'invalid or incomplete arguments' });

    getGroupedTimesheets({
        employee: new ObjectId(opt.employee),
        status: 'approved',
        date: {
            $gte: new Date(parseInt(opt.startDate)),
            $lte: new Date(parseInt(opt.endDate))
        }
    }, (err, timesheets) => {
        if (err) return respond(err.message);
        if (!timesheets.length) return respond();

        var xlsData = [];
        Array.prototype.forEach.call(timesheets, function(each) {
            var ts = each.timesheets;
            for (var i = 0; i < ts.length; i++) {
                for (var j = 0; j < ts.length - 1; j++) {
                    var cur = ts[j],
                        next = ts[j + 1],
                        tmp;
                    if (new Date(cur.date).getTime() > new Date(next.date).getTime()) {
                        tmp = ts[j];
                        ts[j] = ts[j + 1];
                        ts[j + 1] = tmp;
                    }
                }
            }
            Array.prototype.forEach.call(ts, function(t) {
                xlsData.push({
                    date: t.date.toLocaleDateString(),
                    Project_code: each.project.code || '-',
                    description: each.project.description || each.project.name,
                    Project_company: each.project.company || '-',
                    Employee_id: each.employee._id,
                    Employee_name: `${each.employee.name || ''}, ${each.employee.surname || ''}`,
                    hours: typeof t.value == 'boolean' ? (t.value ? 'Si' : 'No') : t.value,
                    comentarios: t.comment || '-',
                    employee_company: each.employee.company
                });
            });

        });

        xlsData = json2xls(xlsData, {});
        var tmpPath = path.join(__dirname, '../tmp/', `${Date.now()}.xlsx`);
        fs.writeFile(tmpPath, xlsData, 'binary', function(err) {
            if (err) throw err;
            
            if (opt.exportAs == 'download') return respond(null, path.basename(tmpPath));
            else if (opt.exportAs == 'email') {
                if (opt.recipient)
                    mailService.execEmail({
                        to: opt.recipient,
                        subject: 'Timesheet Report | Zemsania Portal',
                        html: 'Please find attached timesheet report.<br>Thank You',
                        attachments: [{
                            filename: 'timesheetReport.xlsx',
                            path: tmpPath
                        }]
                    }, () => {
                        respond();
                        try { fs.unlinkSync(tmp) } catch (e) {};
                    }, () => {
                        respond('failed to send email to recipient');
                    })
                else respond('no recipient specified');
            } else respond();
        });

        function respond(error_message, response) {
            var err, res = { timesheetCount: timesheets.length };
            if (error_message) err = { message: error_message }
            if (response) res.response = response;
            callback(err, res);
        }

    });
}

module.exports = {
    save: saveTimesheet,
    saveBulk: saveBulkTimesheets,
    query: query,
    aggregate: aggregate,
    get: getTimesheet,
    update: updateTimesheet,
    delete: deleteTimesheet,
    getTimesheetsUnderSuperior: getTimesheetsUnderSuperior,
    getProjectTimesheets: getProjectTimesheets,
    exportExcel: exportExcel
};

function normalizeQueryDate(param) {
    var paramType = typeof param;
    if (!param) return;
    else if (paramType == 'string' || paramType == 'number') return new Date(param);
    else if (typeof param == 'object') {
        for (var key in param)
            if (param.hasOwnProperty(key)) param[key] = normalizeQueryDate(param[key]);
    }
    return param;
}