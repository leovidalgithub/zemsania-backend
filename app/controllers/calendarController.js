/**
 * @swagger
 * resourcePath: /calendar
 * description: Calendar utilities
 */
var express         = require( 'express' ),
    router          = express.Router(),
    calendarService = require( '../services/calendarService' );

/**
 * @swagger
 * path: /calendar/getCalendarById
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns a calendar by its ID and with options of specific year and/or month (one or every)
 *      notes: Requiere token de autenticación manager (x-auth-token)
 *      nickname: calendarByID
 *      consumes:
 *        - application/json
 */
router.get( '/getCalendarById/:id', managerTokenValidation, function ( req, res ) {
    var data = {
        calendarID : req.params.id,
        month : req.query.month,
        year : req.query.year
    };
    calendarService.getCalendarById( data, 
       function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

/**
 * @swagger
 * path: /calendar/getRefreshCalendarData
 * operations:
 *   -  httpMethod: POST
 *      summary: Receives a calendar object and recalculates all data (range of hours and total of hours by type)
 *      notes: Requiere token de autenticación manager (x-auth-token)
 *      nickname: getRefreshCalendarData
 *      consumes:
 *        - application/json
 */
router.post( '/getRefreshCalendarData', managerTokenValidation, function ( req, res ) {
    var calendar = req.body;
    calendarService.getRefreshCalendarData( calendar, function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

/**
 * @swagger
 * path: /calendar/getCalendarNames
 * operations:
 *   -  httpMethod: POST
 *      summary: Returns all enabled calendars names and description
 *      notes: Requiere token de autenticación manager (x-auth-token)
 *      nickname: getCalendarNames
 *      consumes:
 *        - application/json
 */
router.get( '/getCalendarNames', managerTokenValidation, function ( req, res ) {
      calendarService.getCalendarNames( function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

/**
 * @swagger
 * path: /calendar/advancedCalendarSearch
 * operations:
 *   -  httpMethod: POST
 *      summary: find a string either on name or description
 *      notes: manager token autentication is requiered (x-auth-token).
 *      nickname: advancedCalendarSearch
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          paramType: body
 *          dataType: SearchCalendar
 */
router.post( '/advancedCalendarSearch', managerTokenValidation, function ( req, res ) { // LEO WAS HERE
    calendarService.advancedCalendarSearch( req.body, function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

// *********************************************** ***********************************************
// *********************************************** ***********************************************
/**
 * @swagger
 * path: /calendar/getCalendars
 * operations:
 *   -  httpMethod: GET
 *      summary: Return all calendars
 *      notes: Requiere token de autenticación manager (x-auth-token)
 *      nickname: AllCalendars
 *      consumes:
 *        - application/json
 */
// router.get( '/getCalendars', managerTokenValidation, function ( req, res ) {
//       calendarService.getAllCalendars( function ( data ) {
//         globalMethods.successResponse( res, data );
//     }, function ( err ) {
//         globalMethods.errorResponse( res, err );
//     });
// });

/**
 * @swagger
 * path: /calendar/getCalendarById
 * operations:
 *   -  httpMethod: GET
 *      summary: Return a calendar by its ID / range of hours and total of hours by type
 *      notes: Requiere token de autenticación manager (x-auth-token)
 *      nickname: calendarByID
 *      consumes:
 *        - application/json
 */
// *********************************************** ***********************************************
// /**
//  * @swagger
//  * path: /calendar/getCalendarByIdByMonth
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Return a specific month/year calendar by its ID
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: getCalendarByIdByMonth
//  *      consumes:
//  *        - application/json
//  */
// router.get( '/getCalendarByIdByMonth/:id', managerTokenValidation, function ( req, res ) {
//     var data = {
//         calendarID : req.params.id,
//         month      : req.query.month,
//         year       : req.query.year
//     };

//       calendarService.getCalendarByIdByMonth( data, function ( data ) {
//         globalMethods.successResponse( res, data );
//     }, function ( err ) {
//         globalMethods.errorResponse( res, err );
//     });
// });
// *********************************************** ***********************************************
// /**
//  * @swagger
//  * path: /calendar
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve todos los calendarios
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  */
// router.get('/', managerTokenValidation, function (req, res) {
//     calendarService.getAllNameCalendar(function (data) {
//         res.status(200).jsonp(data);
//     }, function (result) {
//         globalMethods.error(res, result, 500);
//     });
// });
// *********************************************** ***********************************************
// /**
//  * @swagger
//  * path: /calendar/get
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Devuelve los datos del calendario pasado por parametros
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: calendarId
//  *          description: Calendar ID
//  *          paramType: body
//  *          dataType: CalendarIdScheme
//  */
// router.post('/get', managerTokenValidation, function (req, res) {
//     req.checkBody('calendarId', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         calendarService.getCalendar(req.body.calendarId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });
// *********************************************** ***********************************************
// /**
//  * @swagger
//  * path: /calendar/insert
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Inserta un nuevo calendario
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO Calendario para su creación.
//  *          paramType: body
//  *          dataType: CalendarInsertScheme
//  */
// router.post('/insert', managerTokenValidation, function (req, res) {
//     req.checkBody('name', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         calendarService.saveCalendar(req.body, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * path: /calendar/update
//  * operations:
//  *   -  httpMethod: PUT
//  *      summary: Actualiza un calendario
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO Calendario para su edición.
//  *          paramType: body
//  *          dataType: CalendarUpdateScheme
//  */
// router.put('/update', managerTokenValidation, function (req, res) {
//     req.checkBody('name', 'required').notEmpty();
//     req.checkBody('_id', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         calendarService.saveCalendar(req.body, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * path: /calendar/{calendarId}
//  * operations:
//  *   -  httpMethod: DELETE
//  *      summary: Elimina un calendario
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: calendarId
//  *          description: Calendar ID
//  *          paramType: path
//  *          dataType: String
//  */
// router.delete('/:calendarId', managerTokenValidation, function (req, res) {
//     if (!req.params.calendarId) {
//         res.json({success: false, errors: 'NOT CALENDAR ID!'});
//     } else {
//         calendarService.deleteCalendar(req.params.calendarId, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * path: /calendar/own
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve el calendario del usuario
//  *      notes: Requiere token de autenticación (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  */
// router.get('/own', userTokenValidation, function (req, res) {
//     calendarService.getCalendarByUserID(req.userId,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
// });


// /**
//  * @swagger
//  * path: /calendar/{userId}
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve el calendario del usuario pasado por path
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: userId
//  *          description: User ID
//  *          paramType: path
//  *          dataType: String
//  */
// router.get('/:userId', managerTokenValidation, function (req, res) {
//     if (!req.params.userId) {
//         res.json({success: false, errors: 'NOT USER ID!'});
//     } else {
//         calendarService.getCalendarByUserID(req.params.userId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /calendar/insertCalendarUser
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Asigna el calendario un usuario
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO Calendario User para su creación
//  *          paramType: body
//  *          dataType: CalendarUserInsertScheme
//  */
// router.post('/insertCalendarUser', managerTokenValidation, function (req, res) {
//     req.checkBody('name', 'required').notEmpty();
//     req.checkBody('calendarId', 'required').notEmpty();
//     req.checkBody('userId', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         calendarService.saveCalendarUser(req.body, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });

// /**
//  * @swagger
//  * path: /calendar/updateCalendarUser
//  * operations:
//  *   -  httpMethod: PUT
//  *      summary: Actualiza el calendario de un usuario
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO Calendario User para su edición
//  *          paramType: body
//  *          dataType: CalendarUserInsertScheme
//  */
// router.post('/updateCalendarUser', managerTokenValidation, function (req, res) {
//     req.checkBody('name', 'required').notEmpty();
//     req.checkBody('calendarId', 'required').notEmpty();
//     req.checkBody('userId', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         calendarService.saveCalendarUser(req.body, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * path: /calendar/calendarUser
//  * operations:
//  *   -  httpMethod: DELETE
//  *      summary: Elimina un calendario
//  *      notes: Requiere token de autenticación manager (x-auth-token)
//  *      nickname: calendar
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: calendarUserId
//  *          description: calendarUserID para su eliminación
//  *          paramType: body
//  *          dataType: CalendarUserIdScheme
//  */
// router.delete('/deleteCalendarUser', managerTokenValidation, function (req, res) {
//     req.checkBody('calendarUserId', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         calendarService.deleteCalendarUser(req.body.calendarUserId, function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
//     }
// });


// /**
//  * @swagger
//  * models:
//  *   CalendarInsertScheme:
//  *     properties:
//  *       name:
//  *         type: String
//  *         required: true
//  *       intensiveDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       bankHoliDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       nonWorkingDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       specialDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *   CalendarUpdateScheme:
//  *     properties:
//  *       _id:
//  *         type: String
//  *         required: true
//  *       name:
//  *         type: String
//  *         required: true
//  *       intensiveDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       bankHoliDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       nonWorkingDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       specialDays:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *   CalendarUserInsertScheme:
//  *     properties:
//  *       userId:
//  *         type: String
//  *         required: true
//  *       calendarId:
//  *         type: String
//  *         required: true
//  *       name:
//  *         type: String
//  *         required: true
//  *       intensiveDaysUser:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       bankHoliDaysUser:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       nonWorkingDaysUser:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *       specialDaysUser:
//  *         type: Array
//  *         items:
//  *              type: Date
//  *   CalendarUserIdScheme:
//  *     properties:
//  *       calendarUserId:
//  *         type: String
//  *         required: true
//  *   CalendarIdScheme:
//  *     properties:
//  *       calendarId:
//  *         type: String
//  *         required: true
//  */

module.exports = router;
