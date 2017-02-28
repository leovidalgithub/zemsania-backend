var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var userService = require('../services/userService');
var HolidayScheme = models.HolidayScheme;
var HolidaySchemeEntry = models.HolidaySchemeEntry;

function saveHolidayScheme(data, callback) {
    new HolidayScheme(data).save(callback);
};

function saveHolidaySchemeEntry(data, callback) {
    new HolidaySchemeEntry(data).save(callback);
};

function getScheme(schemeId, callback) {
    HolidayScheme
        .findById(schemeId)
        .exec(callback);
};

function getSchemeEntry(entryId, callback) {
    HolidaySchemeEntry
        .findById(entryId)
        .exec(callback);
};

function getSchemeHolidays(schemeId, callback) {
    if (!schemeId) return callback(true);
    HolidaySchemeEntry
        .find({ scheme: schemeId })
        .exec(function(err, entries) {
            if (err) return callback(err);
            var holidays = [];
            if ((holidays = entries.map(function(entry) {
                var dates = [];
                for (var i = 0; i < entry.duration; i++) {
                    (function(i) {
                        var dt = new Date(entry.date.getTime());
                        dt.setDate(dt.getDate() + i);
                        dates.push(dt.getTime());
                    }(i));
                }
                return dates;
            })).length)
                holidays = holidays.reduce(function (res, next) { return res.concat(next); });

            callback(null, holidays);
        });
};

function query(query, callback) {
    if (query instanceof Function) callback = query;
    var _q = query && query.constructor == Object ? query : {};
    HolidayScheme
        .find(_q)
        .exec(callback);
};

function querySchemeEntries(query, callback) {
    if (query instanceof Function) callback = query;
    var _q = query && query.constructor == Object ? query : {};
    HolidaySchemeEntry
        .find(_q)
        .exec(callback);
};

function aggregate(aggregationPipeline, callback) {
    var aggregationPipeline = aggregationPipeline && aggregationPipeline.constructor == Array ? aggregationPipeline : [{ $match: {} }]
    HolidayScheme.aggregate(aggregationPipeline, callback);
};

function aggregateSchemeEntries(aggregationPipeline, callback) {
    var aggregationPipeline = aggregationPipeline && aggregationPipeline.constructor == Array ? aggregationPipeline : [{ $match: {} }]
    HolidaySchemeEntry.aggregate(aggregationPipeline, callback);
};

function deleteHolidayScheme(schemeId_or_query, callback) {
    if (!schemeId_or_query) return callback(new Error('invalid or no arguments provided'));
    var query = typeof schemeId_or_query === "string" ? { _id: schemeId_or_query } : schemeId_or_query;
    HolidayScheme.remove(query, callback);
};

function setDefaultHolidayScheme(schemeId_or_query, callback) {
    var query = typeof schemeId_or_query === "string" ? { _id: schemeId_or_query } : schemeId_or_query;

    HolidayScheme.update({ default: true }, { $unset: { default: null } }, { multi: true }).exec(function(err) {
        if (err) return callback(err);
        HolidayScheme.findOneAndUpdate(query, { default: true }, function(err) {
            callback(err);
        });
    })
};

function deleteSchemeEntry(entryId_or_query, callback) {
    if (!entryId_or_query) return callback(new Error('invalid or no arguments provided'));
    var query = typeof entryId_or_query === "string" ? { _id: entryId_or_query } : entryId_or_query;
    HolidaySchemeEntry.remove(query, callback);
};

module.exports = {
    save: saveHolidayScheme,
    saveEntry: saveHolidaySchemeEntry,
    get: getScheme,
    getSchemeEntry: getSchemeEntry,
    getSchemeHolidays: getSchemeHolidays,
    query: query,
    querySchemeEntries: querySchemeEntries,
    aggregate: aggregate,
    aggregateSchemeEntries: aggregateSchemeEntries,
    setDefaultScheme: setDefaultHolidayScheme,
    delete: deleteHolidayScheme,
    deleteSchemeEntry: deleteSchemeEntry
};
