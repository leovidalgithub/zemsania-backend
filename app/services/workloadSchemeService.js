var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var userService = require('../services/userService');
var WorkloadScheme = models.WorkloadScheme;

function saveWorkloadScheme(data, callback) {
    new WorkloadScheme(data).save(callback);
};

function getScheme(schemeId, callback) {
    WorkloadScheme
        .findById(schemeId)
        .exec(callback);
};

function query(query, callback) {
    if (query instanceof Function) callback = query;
    var _q = query && query.constructor == Object ? query : {};
    WorkloadScheme
        .find(_q)
        .exec(callback);
};

function aggregate(aggregationPipeline, callback) {
    var aggregationPipeline = aggregationPipeline && aggregationPipeline.constructor == Array ? aggregationPipeline : [{ $match: {} }]
    WorkloadScheme.aggregate(aggregationPipeline, callback);
};

function update(schemeId_or_query, updates, callback) {
    var query = typeof schemeId_or_query === "string" ? { _id: schemeId_or_query } : schemeId_or_query;
    WorkloadScheme.findOneAndUpdate(query, updates, function(err) {
        callback(err);
    });
};

function setDefaultWorkloadScheme(schemeId_or_query, callback) {
    var query = typeof schemeId_or_query === "string" ? { _id: schemeId_or_query } : schemeId_or_query;

    WorkloadScheme.update({ default: true }, { $unset: { default: null } }, { multi: true }).exec(function(err) {
        if (err) return callback(err);
        WorkloadScheme.findOneAndUpdate(query, { default: true }, function(err) {
            callback(err);
        });
    })
};

function deleteWorkloadScheme(schemeId_or_query, callback) {
    if (!schemeId_or_query) return callback(new Error('invalid or no arguments provided'));
    var query = typeof schemeId_or_query === "string" ? { _id: schemeId_or_query } : schemeId_or_query;
    WorkloadScheme.remove(query, callback);
};

module.exports = {
    save: saveWorkloadScheme,
    get: getScheme,
    query: query,
    update: update,
    aggregate: aggregate,
    setDefaultScheme: setDefaultWorkloadScheme,
    delete: deleteWorkloadScheme
};
