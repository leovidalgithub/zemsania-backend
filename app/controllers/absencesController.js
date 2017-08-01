// /**
//  * @swagger
//  * resourcePath: /absences
//  * description: Utilidades para las Ausencias
//  */
// var express = require('express');
// var router = express.Router();
// var absencesService = require('../services/absencesService');


// /**
//  * @swagger
//  * path: /absences/get
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve listado de todas las ausencias del usuario
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: get
//  *      consumes:
//  *        - application/json
//  */
// router.get('/get', userTokenValidation, function (req, res) {
//     absencesService.getAbsencesByUserId(req.userId, function (data) {
//         res.status(200).jsonp(data);
//     }, function (result) {
//         globalMethods.error(res, result, 500);
//     });
// });


// /**
//  * @swagger
//  * path: /absences/search
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Busca las ausencias
//  *      notes: Requiere token de manager (x-auth-token).
//  *      nickname: get
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para buscar asuencias
//  *          paramType: body
//  *          dataType: AbsenceSearchScheme
//  */
// router.post('/search', userTokenValidation, function (req, res) {
//     absencesService.searchAbsence(req.body, function (data) {
//         res.status(200).jsonp(data);
//     }, function (result) {
//         globalMethods.error(res, result, 500);
//     });
// });


// /**
//  * @swagger
//  * path: /absences/get/{userId}
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve listado de todas ausencias del usuario pasado por path
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: get
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: userId
//  *          description: User ID
//  *          paramType: path
//  *          dataType: String
//  */
// router.get('/get/:userId', managerTokenValidation, function (req, res) {
//     if (!req.params.userId) {
//         res.json({success: false, errors: 'NOT USER ID!'});
//     } else {
//         absencesService.getAbsencesByUserId(req.params.userId, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * path: /absences/approve
//  * operations:
//  *   -  httpMethod: PUT
//  *      summary: Aprueba el gasto
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: approve
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la aprobación de la ausencia
//  *          paramType: body
//  *          dataType: AbsenceIdScheme
//  */
// router.put('/approve', managerTokenValidation, function (req, res) {
//     req.checkBody('absenceId', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         absencesService.approveAbsences(req.userId, req.body.absenceId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /absences/reject
//  * operations:
//  *   -  httpMethod: PUT
//  *      summary: Rechaza el gasto
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: reject
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para rechazar la ausencia
//  *          paramType: body
//  *          dataType: AbsenceIdScheme
//  */
// router.put('/reject', managerTokenValidation, function (req, res) {
//     req.checkBody('absenceId', 'required').notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         absencesService.rejectAbsence(req.userId, req.body.absenceId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /absences/impute
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Imputa un gasto
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para imputar una ausencia
//  *          paramType: body
//  *          dataType: AbsenceScheme
//  */
// router.post('/impute', userTokenValidation, function (req, res) {
//     req.checkBody('date', 'required').isDate();
//     req.checkBody('conceptAbsenceId', 'required').notEmpty();

//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         req.body.userId = req.userId;
//         absencesService.saveAbsence(req.body,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 // globalMethods.error(res, result, 500);
//                 res.status(200).jsonp(result);
//             });
//     }
// });

// /**
//  * @swagger
//  * path: /absences/{absenceId}
//  * operations:
//  *   -  httpMethod: DELETE
//  *      summary: Elimina la ausencia en estado 'sent' pasado por path,
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: delete
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: absenceId
//  *          description: Absence ID
//  *          paramType: path
//  *          dataType: String
//  */
// router.delete('/:absenceId', userTokenValidation, function (req, res) {
//     if (!req.params.absenceId) {
//         res.json({success: false, errors: 'NOT AUSENCIA ID!'});
//     } else {
//         absencesService.deleteAbsence(req.userId, req.params.absenceId, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /*-------------------------------------- TIPOS ----------------------------------*/

// /**
//  * @swagger
//  * path: /absences/types
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve listado de todos los tipos de ausencia a imputar
//  *      notes: Requiere token de autenticación (x-auth-token).
//  *      nickname: get
//  *      consumes:
//  *        - application/json
//  */
// router.get('/types', userTokenValidation, function (req, res) {
//     absencesService.getAbsenceTypes(function (data) {
//         res.status(200).jsonp(data);
//     }, function (result) {
//         globalMethods.error(res, result, 500);
//     });
// });

// /**
//  * @swagger
//  * path: /absences/types
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Cambia el tipo de gasto
//  *      notes: Requiere token de autenticación backoffice(x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para cambiar un tipo de ausencia
//  *          paramType: body
//  *          dataType: AbsenceTypeScheme
//  */
// router.post('/types', backofficeTokenValidation, function (req, res) {
//     req.checkBody('nameRef', 'required').notEmpty();

//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         req.body.userId = req.userId;
//         absencesService.saveAbsenceType(req.body,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 // globalMethods.error(res, result, 500);
//                 res.status(200).jsonp(result);
//             });
//     }
// });

// /**
//  * @swagger
//  * path: /absences/delete
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Elimina la ausencia en estado 'requested' pasado por path,
//  *      notes: Requiere token de autenticación backoffice(x-auth-token).
//  *      nickname: delete
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: absenceId
//  *          description: Absence ID
//  *          paramType: path
//  *          dataType: AbsenceIdScheme
//  */
// router.post('/delete', backofficeTokenValidation, function (req, res) {
//     if (!req.body.absenceId) {
//         res.json({success: false, errors: 'NOT ABSENCE ID!'});
//     } else {
//         absencesService.deleteAbsenceById(req.body.absenceId, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * models:
//  *   AbsenceScheme:
//  *     properties:
//  *       _id:
//  *         type: String
//  *       date:
//  *         type: Date
//  *         required: true
//  *       conceptAbsenceId:
//  *         type: String
//  *         required: true
//  *       hours:
//  *         type: Number
//  *         required: true
//  *       imageId:
//  *         type: String
//  *       comment:
//  *         type: String
//  *   AbsenceIdScheme:
//  *     properties:
//  *       absenceId:
//  *         type: String
//  *         required: true
//  *   AbsenceTypeScheme:
//  *     properties:
//  *       _id:
//  *         type: String
//  *       nameRef:
//  *         type: String
//  *         required: true
//  *   AbsenceSearchScheme:
//  *     properties:
//  *       _id:
//  *         type: String
//  *       userId:
//  *         type: String
//  *       status:
//  *         type: String
//  *       initDate:
//  *         type: Date
//  *       endDate:
//  *         type: Date
//  *       conceptAbsenceId:
//  *         type: String
//  *       initHours:
//  *         type: Number
//  *       endHours:
//  *         type: Number
//  *       attachment:
//  *         type: Boolean
//  */

// module.exports = router;
