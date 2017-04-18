// /**
//  * @swagger
//  * resourcePath: /dailyReport
//  * description: Utilidades para la imputación de reportes diarios
//  */
// var express = require('express');
// var router = express.Router();
// var dailyReportService = require('../services/dailyReportService');

// /**
//  * @swagger
//  * path: /dailyReport/get
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Devuelve los dias usuario
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la obtención de los dias de un usuario
//  *          paramType: body
//  *          dataType: DatesScheme
//  */
// router.post('/get', userTokenValidation, function (req, res) {
//     //Form validation
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else if (!req.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         dailyReportService.getDailyReportsGrid(req.userId, req.body.initDate, req.body.endDate,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /dailyReport/getByUserID
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Devuelve los dias usuario pasado por parametro
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la obtención de los dias de un usuario
//  *          paramType: body
//  *          dataType: DatesUserIDScheme
//  */
// router.post('/getByUserID', managerTokenValidation, function (req, res) {
//     //Form validation
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();

//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else if (!req.body.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         dailyReportService.getDailyReportsGrid(req.body.userId, req.body.initDate, req.body.endDate,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /dailyReport/getDailyConcepts
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve los conceptos que un usuario puede imputar
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  */
// router.get('/getDailyConcepts', userTokenValidation, function (req, res) {
//         dailyReportService.getDailyConcepts(function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
// });


// /**
//  * @swagger
//  * path: /dailyReport/impute
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Imputa conceptos por dia y proyecto
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: daysImpute
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: Reportes diarios con los conceptos imputados y comentarios.
//  *          paramType: body
//  *          dataType: DailyReportsImputeScheme
//  */
// router.post('/impute', userTokenValidation, function (req, res) {
//     if (typeof req.body.dailyReports == 'object' && req.body.dailyReports.length > 0) {
//         dailyReportService.imputeHours(req.userId, req.body.dailyReports, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     } else {
//         res.json({success: false, errors: 'ERROR!, array null'});
//     }
// });


// /**
//  * @swagger
//  * path: /dailyReport/reject
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Rechaza los reportes diarios del usuario
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: reject
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para el envio de los reportes diarios de un usuario
//  *          paramType: body
//  *          dataType: DatesUserIDScheme
//  */
// router.post('/reject', managerTokenValidation, function (req, res) {
//     //Form validation
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();

//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else if (!req.body.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         dailyReportService.rejectDailyReports(req.userId, req.body.userId, req.body.initDate, req.body.endDate,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /dailyReport/send
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Envia los reportes diarios del usuario al supervisor
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para el envio de los reportes diarios de un usuario
//  *          paramType: body
//  *          dataType: DatesScheme
//  */
// router.post('/send', userTokenValidation, function (req, res) {
//     //Form validation
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();

//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         dailyReportService.sendDailyReports(req.userId, req.body.initDate, req.body.endDate,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /dailyReport/sendByUserID
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Envia los reportes diarios del usuario pasado por parámetro al supervisor
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para el envio de los reportes diarios de un usuario
//  *          paramType: body
//  *          dataType: DatesUserIDScheme
//  */
// router.post('/sendByUserID', managerTokenValidation, function (req, res) {
//     //Form validation
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();

//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else if (!req.body.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         dailyReportService.sendDailyReportsBySupervisor(req.userId, req.body.userId, req.body.initDate, req.body.endDate,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /dailyReport/validateByUserID
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Valida los reportes diarios usuario pasado por parámetro
//  *      notes: Requiere token de autenticación delivery (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la validación de los reportes diarios de un usuario
//  *          paramType: body
//  *          dataType: DatesUserIDScheme
//  */
// router.post('/validateByUserID', deliveryTokenValidation, function (req, res) {
//     //Form validation
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();

//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else if (!req.body.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         dailyReportService.validateDailyReports(req.userId, req.body.userId, req.body.initDate, req.body.endDate,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });

// /**
//  * @swagger
//  * models:
//  *   DatesScheme:
//  *     properties:
//  *       initDate:
//  *         type: Date
//  *         required: true
//  *       endDate:
//  *         type: Date
//  *         required: true
//  *   DatesUserIDScheme:
//  *     properties:
//  *       userId:
//  *         type: String
//  *         required: true
//  *       initDate:
//  *         type: Date
//  *         required: true
//  *       endDate:
//  *         type: Date
//  *         required: true
//  *   DailyReportsImputeScheme:
//  *     properties:
//  *       dailyReports:
//  *         type: Array
//  *         items:
//  *              type: dailyReport
//  *         required: true
//  *   PaginationDto:
//  *     properties:
//  *       page:
//  *         type: Number
//  *       rows:
//  *         type: Number
//  */

// module.exports = router;
