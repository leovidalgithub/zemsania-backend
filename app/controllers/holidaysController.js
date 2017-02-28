/**
 * @swagger
 * resourcePath: /holidays
 * description: Utilidades para vacaciones
 */
var express = require('express');
var router = express.Router();
var holidaysService = require('../services/holidaysService');


/**
 * @swagger
 * path: /holidays
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve listado de todos los dias de vacaciones del usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: getHolidays
 *      consumes:
 *        - application/json
 */
router.get('/', userTokenValidation, function (req, res) {
  console.log(req);

    holidaysService.getHolidaysByUserID(req.userId, function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});


/**
 * @swagger
 * path: /holidays/{userId}
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve listado de todos los dias de vacaciones del usuario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: getHolidays
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: userId
 *          description: User ID
 *          paramType: path
 *          dataType: String
 */
router.get('/:userId', managerTokenValidation, function (req, res) {
    if (!req.params.userId) {
        res.json({success: false, errors: 'NOT USER ID!'});
    } else {
        holidaysService.getHolidaysByUserID(req.params.userId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /holidays/approve
 * operations:
 *   -  httpMethod: PUT
 *      summary: Aprueba los dias de vacaciones
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: approve
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la aprobación de las vacaciones
 *          paramType: body
 *          dataType: HolidaysIdArrayScheme
 */
router.put('/approve', managerTokenValidation, function (req, res) {
    //Form validation
    if (!req.body.holidays) {
        res.json({success: false, errors: 'NOT ARRAY HOLIDAYS!'});
    } else {
        holidaysService.approveHolidays(req.body.holidays,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /holidays/reject
 * operations:
 *   -  httpMethod: PUT
 *      summary: Rechaza los dias de vacaciones
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: reject
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para rechazar las vacaciones
 *          paramType: body
 *          dataType: HolidaysIdArrayScheme
 */
router.put('/reject', managerTokenValidation, function (req, res) {
    //Form validation
    if (!req.body.holidays) {
        res.json({success: false, errors: 'NOT ARRAY HOLIDAYS!'});
    } else {
        holidaysService.rejectHolidays(req.body.holidays,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /holidays/request
 * operations:
 *   -  httpMethod: POST
 *      summary: Solicitar dias de vacaciones
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la solicitud de vacaciones
 *          paramType: body
 *          dataType: DateArrayScheme
 */
router.post('/request', userTokenValidation, function (req, res) {
    //Form validation
    if (!req.body.days) {
        res.json({success: false, errors: 'NOT ARRAY DAYS!'});
    } else {
        holidaysService.requestUserHolidays(req.userId, req.body.days,
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
 * path: /holidays/{holidayId}
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina el dia de vacaciones en estado 'requested' pasado por path,
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: delete
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: holidayId
 *          description: Holiday ID
 *          paramType: path
 *          dataType: String
 */
router.delete('/:holidayId', userTokenValidation, function (req, res) {
    if (!req.params.holidayId) {
        res.json({success: false, errors: 'NOT HOLIDAY ID!'});
    } else {
        holidaysService.deleteHoliday(req.userId, req.params.holidayId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /holidays/search
 * operations:
 *   -  httpMethod: POST
 *      summary: Busca las vacaciones
 *      notes: Requiere token de manager (x-auth-token).
 *      nickname: get
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para buscar vacaciones
 *          paramType: body
 *          dataType: HolidaySearchScheme
 */
router.post('/search', managerTokenValidation, function (req, res) {
    holidaysService.searchHoliday(req.body, function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});

/**
 * @swagger
 * models:
 *   DateArrayScheme:
 *     properties:
 *       days:
 *         type: Array
 *         required: true
 *         items:
 *              type: Date String
 *              required: true
 *              description: Date
 *   HolidaysIdArrayScheme:
 *     properties:
 *       holidays:
 *         type: Array
 *         required: true
 *         items:
 *              type: String
 *              required: true
 *              description: Date
 *   HolidaySearchScheme:
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
 *
 */

module.exports = router;
