var express             = require( 'express' ),
    router              = express.Router(),
    userService         = require( '../services/userService' ),
    notificationService = require( '../services/notificationService' );

/**
 * @swagger
 * path: /user/getAllUsers
 * operations:
 *   -  httpMethod: GET
 *      summary: returns all user profiles
 *      notes: requieres manager token autentication (x-auth-token).
 *      nickname: getAllUsers
 *      consumes:
 *        - application/json
 */
router.get( '/getAllUsers', managerTokenValidation, function ( req, res ) { // LEO WAS HERE
    userService.getAllUsers( function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

// CHANGE USER PASSWORD
router.post( '/password', userTokenValidation, function ( req, res ) { // LEO WAS HERE 
    // req.checkBody('newPassword', 'required').notEmpty();
    // req.checkBody('oldPassword', 'required').notEmpty();
    // var errors = req.validationErrors();
    // if (errors) {
    //     res.json({success: false, errors: errors});
    // } else {
        userService.changePassword( req.userId, req.body,
            function ( data ) {
                globalMethods.successResponse( res, data );
                // globalMethods.sendResponse( res, data );
            }, function ( err ) {
                globalMethods.errorResponse( res, err );
                // globalMethods.sendResponse( res, err );
            });
    // };
    // onSuccess( { success: true, code: 200, message: 'Password changed successfully.' } );
});

/**
 * @swagger
 * path: /user/profile
 * operations:
 *   -  httpMethod: PUT
 *      summary: Updates user profile info
 *      notes: Requieres token autentication (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          paramType: body
 *          dataType: UserProfile
 */
router.put( '/profile', userTokenValidation, function ( req, res ) { // ******* LEO WAS HERE *******
    userService.updateProfile(req.body,
        function (data) {
            globalMethods.sendResponse(res, data);
        },
        function (err) {
            globalMethods.sendResponse(res, err);
        });
    // MAKE ALL VALIDATIONS
    // req.checkBody( 'birthdate','is not an email' ).isEmail();
    // req.checkBody( 'nif','is not a number' ).isIxnt();
    // req.getValidationResult().then( function( result ) {
    //     if ( !result.isEmpty() ) { // some error found
    //         var errors = result.array();
    //         errors.forEach( function( element ) {
    //             console.log( element.param + ' / ' + element.msg );
    //         });
    //         globalMethods.sendResponse( res, { success: false, code: 400, msg: 'Error validating User Profile', errors: errors } );
    //     } else { // not errors found
    //         userService.updateProfile( req.body,
    //             function ( data ) {
    //                 globalMethods.sendResponse( res, data ); 
    //             },
    //             function ( err ) {
    //                 globalMethods.sendResponse( res, err );
    //             });
    //     }
    // });
});

// VERIFIES IF AN GIVEN EMAIL ALREADY EXIST
router.get( '/profile/:emailToVerify', userTokenValidation, function ( req, res ) { // ******* LEO WAS HERE *******
    var emailToVerify = req.params.emailToVerify;
    userService.verifyUniqueUserEmail( emailToVerify,
        function ( data ) {
            globalMethods.sendResponse( res, data ); 
        },
        function ( err ) {
            globalMethods.sendResponse( res, err );
        });
});

/**
 * @swagger
 * path: /user/advancedUserSearch
 * operations:
 *   -  httpMethod: POST
 *      summary: returns all user profiles matched with search
 *      notes: requieres manager token autentication (x-auth-token).
 *      nickname: advancedUserSearch
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          paramType: body
 *          dataType: SearchUserProfile
 */
router.post( '/advancedUserSearch', managerTokenValidation, function ( req, res ) { // LEO WAS HERE
    userService.advancedUserSearch( req.body, 
    function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

// MANAGER-EMPLOYEE-EDIT: GET USER PROFILE WITH COMPANY-ENTERPRISE POPULATED
router.post( '/newSearch', managerTokenValidation, function ( req, res ) { // LEO WAS HERE
    userService.newSearchUsers( req.body, function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

// ******************************************************* *******************************************************
// *
//  * @swagger
//  * path: /user/all
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Devuelve listado paginado de todos los usuarios
//  *      notes: Requiere token de autenticación manager (x-auth-token).
//  *      nickname: searchUsers
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: data
//  *          description: Usuarios paginados
//  *          paramType: body
//  *          dataType: PaginationDto
 
// router.post('/all', managerTokenValidation, function (req, res) {
//     userService.OLDsearchUsers(req.body, function (data) {
//         res.status(200).jsonp(data);
//     }, function (result) {
//         globalMethods.error(res, result, 500);
//     });
// });

/**
 * @swagger
 * path: /user/delete
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina el usuario
 *      notes: Requiere token de autenticación backoffice (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la eliminación del usuario
 *          paramType: body
 *          dataType: UserID
 */
// router.delete('/delete', backofficeTokenValidation, function (req, res) {
//     //Form validation
//     if (!req.body.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         userService.deleteUser(req.body.userId, req.body,
//             function () {
//                 res.status(200);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


/**
 * @swagger
 * path: /user/password
 * operations:
 *   -  httpMethod: POST
 *      summary: Cambia la contraseña del usuario
 *      nickname: changePassword
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: Nueva contraseña
 *          paramType: body
 *          dataType: PasswordForm
 *
 */

/**
 * @swagger
 * path: /user/profile
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve el perfil de un usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: getProfile
 *      consumes:
 *        - application/json
 *
 */
// router.get('/profile', userTokenValidation, function (req, res) {
//     userService.getProfile(req.userId,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
// });



/**
 * @swagger
 * path: /user/profile/{userId}
 * operations:
 *   -  httpMethod: PUT
 *      summary: Actualiza el profile de un usuario
 *      notes: Requiere token de autenticación backoffice (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la actualización de los datos de un usuario
 *          paramType: path
 *          dataType: UserProfile
 */
// router.put('/profile/:userId', backofficeTokenValidation, function (req, res) {
//     //Form validation
//     if (!req.params.userId) {
//         res.json({success: false, errors: 'NOT USER!'});
//     } else {
//         userService.updateProfile(req.params.userId, req.body,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 500);
//             });
//     }
// });


/**
 * @swagger
 * models:
 *
 *   UserProfile:
 *     properties:
 *       name:
 *         type: String
 *       surname:
 *         type: String
 *       birthdate:
 *         type: Date
 *         description: dd/mm/aaaa format
 *       username:
 *         type: String
 *       nif:
 *         type: String
 *       enabled:
 *         type: Boolean
 *       locale:
 *         type: String
 *         description: default es
 *       sex:
 *         type: String
 *       zimbra_cosID:
 *         type: String
 *       zimbra_server:
 *         type: String
 *       roles:
 *         type: Array
 *         items:
 *              type: String
 *              description: ROLE_USER, ROLE_BACKOFFICE *
 *   SearchUserProfile:
 *     properties:
 *       name:
 *         type: String
 *       surname:
 *         type: String
 *       birthdate:
 *         type: Date
 *         description: dd/mm/aaaa format
 *       username:
 *         type: String
 *       nif:
 *         type: String
 *       enabled:
 *         type: Boolean
 *       locale:
 *         type: String
 *         description: default es
 *       sex:
 *         type: String
 *       zimbra_cosID:
 *         type: String
 *       zimbra_server:
 *         type: String
 *       roles:
 *         type: Array
 *         items:
 *              type: String
 *              description: ROLE_USER, ROLE_BACKOFFICE
 *       page:
 *         type: Number
 *       rows:
 *         type: Number
 *   PasswordForm:
 *     properties:
 *       newPassword:
 *         type: String
 *         required: true
 *       oldPassword:
 *         type: String
 *         required: true
 *   PaginationDto:
 *     properties:
 *       page:
 *         type: Number
 *       rows:
 *         type: Number
 *   UserID:
 *     properties:
 *       userId:
 *         type: String
 *         description: El id de la BBDD MongoDB.
 */

module.exports = router;
