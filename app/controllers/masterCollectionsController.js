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
router.get('/enterprises', userTokenValidation, function (req, res) {
    masterCollectionService.getEnterprisesCollection(function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});


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
