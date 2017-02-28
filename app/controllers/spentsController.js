/**
 * @swagger
 * resourcePath: /spents
 * description: Utilidades para los gastos
 */
var express = require('express');
var router = express.Router();
var spentsService = require('../services/spentsService');


/**
 * @swagger
 * path: /spents/get
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve listado de todos los gastos del usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: get
 *      consumes:
 *        - application/json
 */
router.get('/get', userTokenValidation, function (req, res) {
    spentsService.getSpentsByUserId(req.userId, function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});


/**
 * @swagger
 * path: /spents/search
 * operations:
 *   -  httpMethod: POST
 *      summary: Busqueda en spents
 *      notes: Requiere token de manager (x-auth-token).
 *      nickname: get
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para buscar un gasto
 *          paramType: body
 *          dataType: SearchSpentScheme
 */
router.post('/search', userTokenValidation, function (req, res) {
    spentsService.searchSpent(req.body, function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});

/**
 * @swagger
 * path: /spents/get/{userId}
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve listado de todos gastos del usuario pasado por path
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: get
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: userId
 *          description: User ID
 *          paramType: path
 *          dataType: String
 */
router.get('/get/:userId', managerTokenValidation, function (req, res) {
    if (!req.params.userId) {
        res.json({success: false, errors: 'NOT USER ID!'});
    } else {
        spentsService.getSpentsByUserId(req.params.userId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /spents/approve
 * operations:
 *   -  httpMethod: PUT
 *      summary: Aprueba el gasto
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: approve
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la aprobación del gasto
 *          paramType: body
 *          dataType: SpentIdScheme
 */
router.put('/approve', managerTokenValidation, function (req, res) {
    req.checkBody('spentId', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        spentsService.approveSpents(req.userId, req.body.spentId,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /spents/reject
 * operations:
 *   -  httpMethod: PUT
 *      summary: Rechaza el gasto
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: reject
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para rechazar el gasto
 *          paramType: body
 *          dataType: SpentIdScheme
 */
router.put('/reject', managerTokenValidation, function (req, res) {
    req.checkBody('spentId', 'required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        spentsService.rejectSpent(req.userId, req.body.spentId,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /spents/impute
 * operations:
 *   -  httpMethod: POST
 *      summary: Imputa un gasto
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para imputar un gasto
 *          paramType: body
 *          dataType: SpentScheme
 */
router.post('/impute', userTokenValidation, function (req, res) {
    req.checkBody('date', 'required').isDate();
    req.checkBody('conceptSpentId', 'required').notEmpty();
    req.checkBody('price', 'required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        req.body.userId = req.userId;
        spentsService.saveSpent(req.body,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                // globalMethods.error(res, result, 500);
                res.status(200).jsonp(result);
            });
    }
});

/**
 * @swagger
 * path: /spents/{spentId}
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina el gasto en estado 'sent' pasado por path,
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: delete
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: spentId
 *          description: Spent ID
 *          paramType: path
 *          dataType: String
 */
router.delete('/:spentId', userTokenValidation, function (req, res) {
    if (!req.params.spentId) {
        res.json({success: false, errors: 'NOT SPENT ID!'});
    } else {
        spentsService.deleteSpent(req.userId, req.params.spentId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/*-------------------------------------- TIPOS ----------------------------------*/

/**
 * @swagger
 * path: /spents/types
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve listado de todos los tipos de gastos a imputar
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: get
 *      consumes:
 *        - application/json
 */
router.get('/types', userTokenValidation, function (req, res) {
    spentsService.getSpentTypes(function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});

/**
 * @swagger
 * path: /spents/types
 * operations:
 *   -  httpMethod: POST
 *      summary: Cambia el tipo de gasto
 *      notes: Requiere token de autenticación backoffice(x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para cambiar un tipo de gasto
 *          paramType: body
 *          dataType: SpentTypeScheme
 */
router.post('/types', backofficeTokenValidation, function (req, res) {
    req.checkBody('nameRef', 'required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        req.body.userId = req.userId;
        spentsService.saveSpentType(req.body,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                // globalMethods.error(res, result, 500);
                res.status(200).jsonp(result);
            });
    }
});

/**
 * @swagger
 * path: /spents/delete
 * operations:
 *   -  httpMethod: POST
 *      summary: Elimina el spents.
 *      notes: Requiere token de autenticación backoffice(x-auth-token).
 *      nickname: delete
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: spentId
 *          description: Absence ID
 *          paramType: path
 *          dataType: SpentIdScheme
 */
router.post('/delete', backofficeTokenValidation, function (req, res) {
    if (!req.body.spentId) {
        res.json({success: false, errors: 'NOT ABSENCE ID!'});
    } else {
        spentsService.deleteSpentById(req.body.spentId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * models:
 *   SpentScheme:
 *     properties:
 *       _id:
 *         type: String
 *       date:
 *         type: Date
 *         required: true
 *       conceptSpentId:
 *         type: String
 *         required: true
 *       price:
 *         type: Number
 *         required: true
 *       imageId:
 *         type: String
 *       comment:
 *         type: String
 *   SpentIdScheme:
 *     properties:
 *       spentId:
 *         type: String
 *         required: true
 *   SpentTypeScheme:
 *     properties:
 *       _id:
 *         type: String
 *       nameRef:
 *         type: String
 *         required: true
 *   SearchSpentScheme:
 *     properties:
 *       _id:
 *         type: String
 *       userId:
 *         type: String
 *       status:
 *         type: String
 *       initDate:
 *         type: Date
 *       endDate:
 *         type: Date
 *       conceptSpentId:
 *         type: String
 *       initPrice:
 *         type: Number
 *       endPrice:
 *         type: Number
 *       attachment:
 *         type: Boolean
 */

module.exports = router;
