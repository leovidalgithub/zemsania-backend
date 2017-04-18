/**
 * @swagger
 * resourcePath: /projectUsers
 * description: Utilidades para asignar usuarios a proyectos
 */
var express             = require( 'express' );
var router              = express.Router();
var projectUsersService = require( '../services/projectUsersService' );

/**
 * @swagger
 * path: /projectUsers/getProjectsByUserID
 * operations:
 *   -  httpMethod: GET
 *      summary: Busca y devuelve los proyectos del usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: getUserProjects
 *      consumes:
 *        - application/json
 */
router.get( '/getProjectsByUserID/:id', userTokenValidation, function ( req, res ) { // LEO WAS HERE
    var userId = req.params.id;
    projectUsersService.getProjectsByUserID( userId,
        function ( data ) {
           globalMethods.successResponse( res, data );
        }, function ( result ) {
            globalMethods.errorResponse( res, err );
        });
});




// ***************************************************** *****************************************************
// /**
//  * @swagger
//  * path: /projectUsers/getUsersBySupervisor
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Devuelve todos los usuarios dado un email de supervisor
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: getUsersBySupervisor
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la obtención usuarios asociados a un supervisor
//  *          paramType: body
//  *          dataType: UserInSupervisor
//  */
// router.post('/getUsersBySupervisor', managerTokenValidation, function (req, res) {
//     projectUsersService.getUsersBySupervisor(req.body.email,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
// });


// /**
//  * @swagger
//  * path: /projectUsers/all
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Devuelve todas las asignaciones de proyectos asignados, paginados
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: all
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la obtención de todas las asignaciones de proyectos asignados
//  *          paramType: body
//  *          dataType: PaginationDto
//  */
// router.post('/all', managerTokenValidation, function (req, res) {
//     projectUsersService.searchProjectUsers(req.body,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
// });


// /**
//  * @swagger
//  * path: /projectUsers/delete
//  * operations:
//  *   -  httpMethod: DELETE
//  *      summary: Elimina la asignación proyecto-usuario
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: delete
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la eliminación de la asignación proyecto-usuario
//  *          paramType: body
//  *          dataType: IDScheme
//  */
// router.delete('/delete', managerTokenValidation, function (req, res) {
//     req.checkBody('_id', 'required').notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         projectUsersService.deleteProjectUser(req.body._id,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /projectUsers/getUsersByProjectID
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Busca y devuelve los usuarios de un proyecto
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: getUserProjects
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la obtención de todas las asignaciones de proyectos asignados
//  *          paramType: body
//  *          dataType: ProjectIDScheme
//  */
// router.post('/getUsersByProjectID', managerTokenValidation, function (req, res) {
//     req.checkBody('projectId', 'required').notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         projectUsersService.getUsersByProjectID(req.body.projectId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// *
//  * @swagger
//  * path: /projectUsers/getUserProjects
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Busca y devuelve los proyectos del usuario
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: searchUserProjects
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la obtención de los proyectos del usuario
//  *          paramType: body
//  *          dataType: UserIDScheme
 
// router.post('/getUserProjects', managerTokenValidation, function (req, res) {
//     req.checkBody('userId', 'required').notEmpty();
//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         projectUsersService.getProjectsByUserID(req.body.userId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /projectUsers/save
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Asigna proyecto usuario
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: profile
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la creación de la asignación proyecto-usuario
//  *          paramType: body
//  *          dataType: ProjectIDUserIDDatesScheme
//  */
// router.post('/save', managerTokenValidation, function (req, res) {
//     req.checkBody('projectId', 'required').notEmpty();
//     req.checkBody('userId', 'required').notEmpty();
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();
//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         projectUsersService.saveProjectUser(req.body,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


// /**
//  * @swagger
//  * path: /projectUsers/update
//  * operations:
//  *   -  httpMethod: PUT
//  *      summary: Actaliza las fechas asginadas
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: update
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: DTO para la actualización de las fechas asginadas
//  *          paramType: body
//  *          dataType: ProjectIDDatesScheme
//  */
// router.put('/update', managerTokenValidation, function (req, res) {
//     req.checkBody('_id', 'required').notEmpty();
//     req.checkBody('initDate', 'date').isDate();
//     req.checkBody('endDate', 'date').isDate();
//     var errors = req.validationErrors();
//     if (errors) {
//         res.json({success: false, errors: errors});
//     } else {
//         projectUsersService.saveProjectUser(req.body,
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
//  *   UserIDScheme:
//  *     properties:
//  *       userId:
//  *         type: String
//  *         required: true
//  *   ProjectIDScheme:
//  *     properties:
//  *       projectId:
//  *         type: String
//  *         required: true
//  *   ProjectIDUserIDDatesScheme:
//  *     properties:
//  *       projectId:
//  *         type: String
//  *         required: true
//  *       userId:
//  *         type: String
//  *         required: true
//  *       initDate:
//  *         type: Date
//  *         required: true
//  *       endDate:
//  *         type: Date
//  *         required: true
//  *   ProjectIDDatesScheme:
//  *     properties:
//  *       _id:
//  *         type: String
//  *         required: true
//  *       initDate:
//  *         type: Date
//  *         required: true
//  *       endDate:
//  *         type: Date
//  *         required: true
//  *   IDScheme:
//  *     properties:
//  *       _id:
//  *         type: String
//  *         required: true
//  *   UserInSupervisor:
//  *     properties:
//  *       email:
//  *         type: String
//  *         required: true
//  *   PaginationDto:
//  *     properties:
//  *       page:
//  *         type: Number
//  *       rows:
//  *         type: Number
//  */

module.exports = router;
