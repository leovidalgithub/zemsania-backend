var express = require( 'express' );
var router  = express.Router();
// var async = require('async');
// var mongoose = require('mongoose');
// var ObjectId = require('mongoose').Types.ObjectId;

//API /mcollections/enterprises
// RETURNS ALL ENTERPRISES
function getEnterprisesCollection( onSuccess, onError ) { // lEO WAS HERE
    models.Enterprises.find( { "enabled" : true }, function ( err, results ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Enterprises collection.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Enterprises collection.', results: results } );
        }
    })
}

//API /mcollections/supervisorsExceptID/:_id
// RETURNS ALL SUPERVISORS EXCEPT THE USER ITSELF IF MANAGER (supervisor)
function getSupervisorsExceptID( _id, onSuccess, onError ) { // lEO WAS HERE    
    models.User.find( {"_id" : { $ne:_id }, "roles" : "ROLE_MANAGER", "enabled" : true }, function ( err, results ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Supervisors.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Supervisors collection.', results: results } );                    
        }
    })
}

//API /mcollections/allSupervisors
// RETURNS ALL SUPERVISORS
function getAllSupervisors( onSuccess, onError ) { // lEO WAS HERE    
    models.User.find( { "roles" : "ROLE_MANAGER", "enabled" : true }, function ( err, results ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Supervisors.' } );
        } else {
            onSuccess( { success: true, code: 200, msg: 'Supervisors collection.', results: results } );                    
        }
    })
}

//API /mcollections/defaultPassword
// RETURNS THE DEFAULT PASSWORD FROM CONSTANTS OBJECT
function getDefaultPassword( callback ) { // lEO WAS HERE
    callback( { success: true, code: 200, msg: 'Default password.', defaultPassword: constants.defaultPassword } );
}

// ****************************************************** ******************************************************
// function getCecoCollection(onSuccess) {
//     models.Ceco.find({}, function (err, results) {
//         if (err) throw err;
//         var response = {
//             success : true,
//             collection : results
//         };
//         onSuccess(response);
//     });
// }
// function getProductsCollection(onSuccess) {
//     models.Products.find({}, function (err, results) {
//         if (err) throw err;
//         var response = {
//             success : true,
//             collection : results
//         };
//         onSuccess(response);
//     });
// }
// function getZonesCollection(onSuccess) {
//     models.Zones.find({}, function (err, results) {
//         if (err) throw err;
//         var response = {
//             success : true,
//             collection : results
//         };
//         onSuccess(response);
//     });
// }

module.exports = {
    getEnterprisesCollection: getEnterprisesCollection,
    getSupervisorsExceptID: getSupervisorsExceptID,
    getAllSupervisors: getAllSupervisors,
    getDefaultPassword: getDefaultPassword
    // getCecoCollection: getCecoCollection,
    // getProductsCollection: getProductsCollection,
    // getZonesCollection: getZonesCollection
};

