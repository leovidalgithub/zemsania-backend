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

function getEnterprisesCollection( onSuccess, onError ) { // lEO WAS HERE
    models.Enterprises.find( { "enabled" : true }, function ( err, results ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Enterprises collection.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Enterprises collection.', results: results } );
        }
    })
}

// returns all supervisors except the user itself if MANAGER (supervisor)
function getSupervisors( _id, onSuccess, onError ) { // lEO WORKING HERE
    models.User.find( {"_id" : { $ne:_id }, "roles" : "ROLE_MANAGER", "enabled" : true }, function ( err, results ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Enterprises collection.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Enterprises collection.', results: results } );                    
        }
    })
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
    getSupervisors: getSupervisors,
    getProductsCollection: getProductsCollection,
    getZonesCollection: getZonesCollection
};

