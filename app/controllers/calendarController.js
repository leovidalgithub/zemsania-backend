/**
 * @swagger
 * resourcePath: /calendar
 * description: Utilidades para la gestión de calendarios
 */
var express = require('express');
var router = express.Router();
var calendarService = require('../services/calendarService');

/**
 * @swagger
 * path: /calendar
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve todos los calendarios
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 */
router.get('/', managerTokenValidation, function (req, res) {
    calendarService.getAllNameCalendar(function (data) {
        res.status(200).jsonp(data);
    }, function (result) {
        globalMethods.error(res, result, 500);
    });
});


/**
 * @swagger
 * path: /calendar/get
 * operations:
 *   -  httpMethod: POST
 *      summary: Devuelve los datos del calendario pasado por parametros
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: calendarId
 *          description: Calendar ID
 *          paramType: body
 *          dataType: CalendarIdScheme
 */
router.post('/get', managerTokenValidation, function (req, res) {
    req.checkBody('calendarId', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        calendarService.getCalendar(req.body.calendarId,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /calendar/insert
 * operations:
 *   -  httpMethod: POST
 *      summary: Inserta un nuevo calendario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO Calendario para su creación.
 *          paramType: body
 *          dataType: CalendarInsertScheme
 */
router.post('/insert', managerTokenValidation, function (req, res) {
    req.checkBody('name', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        calendarService.saveCalendar(req.body, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /calendar/update
 * operations:
 *   -  httpMethod: PUT
 *      summary: Actualiza un calendario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO Calendario para su edición.
 *          paramType: body
 *          dataType: CalendarUpdateScheme
 */
router.put('/update', managerTokenValidation, function (req, res) {
    req.checkBody('name', 'required').notEmpty();
    req.checkBody('_id', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        calendarService.saveCalendar(req.body, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /calendar/{calendarId}
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina un calendario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: calendarId
 *          description: Calendar ID
 *          paramType: path
 *          dataType: String
 */
router.delete('/:calendarId', managerTokenValidation, function (req, res) {
    if (!req.params.calendarId) {
        res.json({success: false, errors: 'NOT CALENDAR ID!'});
    } else {
        calendarService.deleteCalendar(req.params.calendarId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /calendar/own
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve el calendario del usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 */
router.get('/own', userTokenValidation, function (req, res) {
    calendarService.getCalendarByUserID(req.userId,
        function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
});


/**
 * @swagger
 * path: /calendar/{userId}
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve el calendario del usuario pasado por path
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
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
        calendarService.getCalendarByUserID(req.params.userId,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /calendar/insertCalendarUser
 * operations:
 *   -  httpMethod: POST
 *      summary: Asigna el calendario un usuario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO Calendario User para su creación
 *          paramType: body
 *          dataType: CalendarUserInsertScheme
 */
router.post('/insertCalendarUser', managerTokenValidation, function (req, res) {
    req.checkBody('name', 'required').notEmpty();
    req.checkBody('calendarId', 'required').notEmpty();
    req.checkBody('userId', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        calendarService.saveCalendarUser(req.body, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});

/**
 * @swagger
 * path: /calendar/updateCalendarUser
 * operations:
 *   -  httpMethod: PUT
 *      summary: Actualiza el calendario de un usuario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO Calendario User para su edición
 *          paramType: body
 *          dataType: CalendarUserInsertScheme
 */
router.post('/updateCalendarUser', managerTokenValidation, function (req, res) {
    req.checkBody('name', 'required').notEmpty();
    req.checkBody('calendarId', 'required').notEmpty();
    req.checkBody('userId', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        calendarService.saveCalendarUser(req.body, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * path: /calendar/calendarUser
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina un calendario
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: calendar
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: calendarUserId
 *          description: calendarUserID para su eliminación
 *          paramType: body
 *          dataType: CalendarUserIdScheme
 */
router.delete('/deleteCalendarUser', managerTokenValidation, function (req, res) {
    req.checkBody('calendarUserId', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        calendarService.deleteCalendarUser(req.body.calendarUserId, function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
    }
});


/**
 * @swagger
 * models:
 *   CalendarInsertScheme:
 *     properties:
 *       name:
 *         type: String
 *         required: true
 *       intensiveDays:
 *         type: Array
 *         items:
 *              type: Date
 *       bankHoliDays:
 *         type: Array
 *         items:
 *              type: Date
 *       nonWorkingDays:
 *         type: Array
 *         items:
 *              type: Date
 *       specialDays:
 *         type: Array
 *         items:
 *              type: Date
 *   CalendarUpdateScheme:
 *     properties:
 *       _id:
 *         type: String
 *         required: true
 *       name:
 *         type: String
 *         required: true
 *       intensiveDays:
 *         type: Array
 *         items:
 *              type: Date
 *       bankHoliDays:
 *         type: Array
 *         items:
 *              type: Date
 *       nonWorkingDays:
 *         type: Array
 *         items:
 *              type: Date
 *       specialDays:
 *         type: Array
 *         items:
 *              type: Date
 *   CalendarUserInsertScheme:
 *     properties:
 *       userId:
 *         type: String
 *         required: true
 *       calendarId:
 *         type: String
 *         required: true
 *       name:
 *         type: String
 *         required: true
 *       intensiveDaysUser:
 *         type: Array
 *         items:
 *              type: Date
 *       bankHoliDaysUser:
 *         type: Array
 *         items:
 *              type: Date
 *       nonWorkingDaysUser:
 *         type: Array
 *         items:
 *              type: Date
 *       specialDaysUser:
 *         type: Array
 *         items:
 *              type: Date
 *   CalendarUserIdScheme:
 *     properties:
 *       calendarUserId:
 *         type: String
 *         required: true
 *   CalendarIdScheme:
 *     properties:
 *       calendarId:
 *         type: String
 *         required: true
 */

module.exports = router;
