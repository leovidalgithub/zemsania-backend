var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

function getCecoCollection(onSuccess) {
    models.Ceco.find({}, function (err, results) {
        if (err) throw err;
        var response = {
            success : true,
            collection : results
        };
        onSuccess(response);
    });
}

function getEnterprisesCollection(onSuccess) {
    models.Enterprises.find({}, function (err, results) {
        if (err) throw err;
        var response = {
            success : true,
            collection : results
        };
        onSuccess(response);
    });
}

function getProductsCollection(onSuccess) {
    models.Products.find({}, function (err, results) {
        if (err) throw err;
        var response = {
            success : true,
            collection : results
        };
        onSuccess(response);
    });
}

function getZonesCollection(onSuccess) {
    models.Zones.find({}, function (err, results) {
        if (err) throw err;
        var response = {
            success : true,
            collection : results
        };
        onSuccess(response);
    });
}

module.exports = {
    getCecoCollection: getCecoCollection,
    getEnterprisesCollection: getEnterprisesCollection,
    getProductsCollection: getProductsCollection,
    getZonesCollection: getZonesCollection
};

