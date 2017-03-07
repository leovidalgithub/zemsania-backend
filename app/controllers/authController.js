/**
 * @swagger
 * resourcePath: /authn
 * description: Controlador de autenticacion
 */
var express = require('express');
var router = express.Router();
var authnService = require('../services/securityService');


/**
 * @swagger
 * path: /authn/password/remember
 * operations:
 *   -  httpMethod: POST
 *      summary: Envía un email para recordar la contraseña del usuario
 *      nickname: rememberPassword
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para recordar contraseña
 *          paramType: body
 *          dataType: RememberPasswordDto
 *
 */
router.post( '/password/remember', function ( req, res ) { // ********** LEO WORKING HERE **********
    // req.checkBody('email', 'required').notEmpty();
    // req.checkBody('email', 'email').isEmail();
    // var errors = req.validationErrors();
    // if (errors) {
    //     res.json({success: false, errors: errors});
    // }
    // else {
        
        authnService.rememberPassword( req.body.email,
            function ( err, data ) {
                if ( err ) {
                    res.status( 500 ).jsonp( err );
                } else {
                  res.status( 200 ).jsonp( data );  
                }
            });
    // }
});


/**
 * @swagger
 * path: /authn/password/reset
 * operations:
 *   -  httpMethod: POST
 *      summary: Establece un nuevo password al usuario
 *      nickname: resetPassword
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para recordar contraseña
 *          paramType: body
 *          dataType: ResetPasswordDto
 *
 */
router.post('/password/reset', function (req, res) {

    authnService.resetPassword(req.body,
        function (err, data) {
            if (err)
                res.status(500).jsonp(err);
            else res.status(200).jsonp(data);
        });

});


/**
 * @swagger
 * path: /authn/validate/{uuid}
 * operations:
 *   -  httpMethod: GET
 *      summary: validate
 *      nickname: validate
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: uuid
 *          description: UUID del usuario
 *          paramType: path
 *          required: true
 *          dataType: string
 *
 */
router.get('/validate/:uuid', function (req, res) {
    console.log("validate nodejs");
    authnService.validate(req.params.uuid,
        function (err, data) {
            if (err)
                res.status(500).jsonp(err);
            else res.status(200).jsonp(data);
        });


});


/**
 * @swagger
 * path: /authn/signup
 * operations:
 *   -  httpMethod: POST
 *      summary: Registra un nuevo usuario en el sistema
 *      notes: Se devuelve un success = true en caso de que se cree el usuario de forma correcta
 *      nickname: signup
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la creación de un usuario
 *          paramType: body
 *          dataType: UserSignup
 *
 */

router.post('/signup', backofficeTokenValidation, function (req, res) {

    //Form validation
    req.checkBody('username', 'required').notEmpty();
    req.checkBody('username', 'email').isEmail();
    req.checkBody('name', 'required').notEmpty();
    req.checkBody('surname', 'required').notEmpty();
    req.checkBody('password', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    } else {
        authnService.signup(req.body,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 500);
            });

    }
});


/**
 * @swagger
 * path: /authn/login
 * operations:
 *   -  httpMethod: POST
 *      summary: Login de un usuario
 *      nickname: login
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la creación de un usuario
 *          paramType: body
 *          dataType: UserLogin
 *
 */
router.post('/login', function (req, res) { // LEO WORKING HERE
    //Form validation
    // req.checkBody('username', 'required').notEmpty();
    // req.checkBody('password', 'required').notEmpty();
    // var errors = req.validationErrors();

    // if (errors) {
    //     res.json({success: false, errors: errors});
    // }
    // else {

        authnService.login( req.body,
            function ( data ) {
                globalMethods.successResponse( res, data );
            }, function ( err ) {
                globalMethods.errorResponse( res, err );
            });
    // }



});


/**
 * @swagger
 * models:
 *   RememberPasswordDto:
 *     properties:
 *       email:
 *         type: String
 *         required: true
 *   ResetPasswordDto:
 *     properties:
 *       uuid:
 *         type: String
 *         required: true
 *       password:
 *         type: String
 *         required: true
 *   UserSignup:
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
 *              description: ROLE_USER, ROLE_MANAGER, ROLE_DELIVERY, ROLE_BACKOFFICE
 *   UserLogin:
 *     properties:
 *       username:
 *         type: String
 *         required: true
 *       password:
 *         type: String
 *         required: true
 *
 */

module.exports = router;
