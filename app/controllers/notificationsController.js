/**
 * @swagger
 * resourcePath: /notifications
 * description: Utilidades para notificaciones
 */
var express = require('express');
var router = express.Router();
var notificationService = require('../services/notificationService');

/**
 * @swagger
 * path: /notifications
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve las notificaciones de usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: notifications
 *      consumes:
 *        - application/json
 *
 */

// router.use(function ( req, res, next ) {
//     console.log( 'EPA from Controller 111!' );
//     next();
// });

router.get('/', userTokenValidation, function (req, res) {
    notificationService.getNotifications(req.userId,
        function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });
});

/**
 * @swagger
 * path: /notifications/unreads
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve las notificaciones sin leer de usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: notificationsUnread
 *      consumes:
 *        - application/json
 *
 */


router.get('/unreads', function ( req, res, next ) {
    console.log( 'unreads MIDDLEWARE 1!' );
    next();
});

router.get('/unreads', userTokenValidation, function (req, res) {
    console.log( 'unreads INSIDE!' );
    notificationService.getNotificationsUnread(req.userId,
        function (data) {
            res.status(200).jsonp(data);
        }, function (result) {
            globalMethods.error(res, result, 500);
        });

});


/**
 * @swagger
 * path: /notifications/markRead
 * operations:
 *   -  httpMethod: POST
 *      summary: Marca como leída la notificación
 *      nickname: markNotificationsReaded
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: ID de notificación
 *          paramType: body
 *          dataType: NotificationID
 *
 */
router.post('/markRead', userTokenValidation, function (req, res) {
    req.checkBody('notificationId', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({success: false, errors: errors});
    }
    else {
        notificationService.markNotificationsReaded(req.userId, req.body.notificationId,
            function (data) {
                res.status(200).jsonp(data);
            }, function (result) {
                globalMethods.error(res, result, 401);
            });
    }
});

/**
 * @swagger
 * models:
 *   NotificationID:
 *     properties:
 *       notificationId:
 *         type: String
 *         description: El id de la notificacion.
 *
 */

module.exports = router;
