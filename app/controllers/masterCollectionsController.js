/**
 * @swagger
 * resourcePath: /mcollections
 * description: Drop de tablas maestras
 */
var express = require('express');
var router = express.Router();
var masterCollectionService = require('../services/masterCollectionsServices');

/**
 * @swagger
 * path: /mcollections/ceco
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve la tabla ceco
 *      nickname: getMasterCollectionCeco
 *      consumes:
 *        - application/json
 *
 */
router.get('/ceco', userTokenValidation, function (req, res) {
    masterCollectionService.getCecoCollection(function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});


/**
 * @swagger
 * path: /mcollections/enterprises
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve la tabla enterprises
 *      nickname: getMasterCollectionEnterprises
 *      consumes:
 *        - application/json
 *
 */
router.get( '/enterprises', managerTokenValidation, function ( req, res ) {  // lEO WAS HERE
    masterCollectionService.getEnterprisesCollection( function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

/**
 * @swagger
 * path: /mcollections/supervisors
 * operations:
 *   -  httpMethod: GET
 *      summary: returns all supervisors except the user itself if MANAGER
 *      nickname: getSupervisors
 *      consumes:
 *        - application/json
 *
 */
router.get( '/supervisors/:_id', managerTokenValidation, function ( req, res ) {  // lEO WORKING HERE
    var _id = req.params;
    masterCollectionService.getSupervisors( _id, function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

//******************************
// JUST FOR DEVELOPMENT PURPOSES
//******************************
// router.get('/enterprises/test', function (req, res) { // lEO WAS HERE
//     console.log('/enterprises/test');
//     models.Enterprises.find({})
//         .exec(function(err,docs) {
//             docs.forEach( function(e) {
//                 models.Enterprises.findOne( { _id: new ObjectId( e._id ) }, function ( err, user ) {
//                     user.save();
//                 });
//             });
//             console.log('done');
//         });
//     res.end();
// });

// get all enterprises and save a random enterprise_id into all Users-company-field
// router.get( '/development', function ( req, res ) { // lEO WAS HERE
//     models.Enterprises.find( {} )
//         .exec( function( err, enterprises ) {
//         models.User.find( {} )
//             .exec( function( err, users ) {
//                 users.forEach( function(e) {
//                     var x = Math.floor( ( Math.random() * enterprises.length ) + 1 );
//                     var enterprise_id = enterprises[x-1]._id;
//                     e.company = new ObjectId( enterprise_id );
//                     e.save();
//                 });
//             });
//         });
//     res.end();
// });
//******************************
// JUST FOR DEVELOPMENT PURPOSES
//******************************



/**
 * @swagger
 * path: /mcollections/products
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve la tabla products
 *      nickname: getMasterCollectionProducts
 *      consumes:
 *        - application/json
 *
 */
router.get('/products', userTokenValidation, function (req, res) {
    masterCollectionService.getProductsCollection(function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});


/**
 * @swagger
 * path: /mcollections/zones
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve la tabla zones
 *      nickname: getMasterCollectionZones
 *      consumes:
 *        - application/json
 *
 */
router.get('/zones', userTokenValidation, function (req, res) {
    masterCollectionService.getZonesCollection(function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});

module.exports = router;
