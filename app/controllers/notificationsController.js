/**
 * @swagger
 * resourcePath: /notifications
 * description: Utilidades para notificaciones
 */
var express             = require( 'express' );
var router              = express.Router();
var notificationService = require( '../services/notificationService' );

/**
 * @swagger
 * path: /notifications/unreads
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns al unreads notifications by UserId
 *      notes: userTokenAutentication is required (x-auth-token).
 *      nickname: notificationsUnread
 *      consumes:
 *        - application/json
 */
router.get( '/unreads', userTokenValidation, function ( req, res ) { // LEO WAS HERE
    notificationService.getNotificationsUnread( req.userId,
        function ( data ) {
            globalMethods.successResponse( res, data );
        }, function ( err ) {
            globalMethods.errorResponse( res, err );
        });
});

/**
 * @swagger
 * path: /notifications/insertNewNotification
 * operations:
 *   -  httpMethod: POST
 *      summary: Inserts a new notification
 *      notes: userTokenAutentication is required (x-auth-token).
 *      nickname: insertNewNotification
 *      consumes:
 *        
 */
router.post( '/insertNewNotification', userTokenValidation, function ( req, res ) { // LEO WORKING HERE
    notificationService.insertNewNotification( req.body,
        function ( data ) {
            globalMethods.successResponse( res, data );
        }, function ( err ) {
            globalMethods.errorResponse( res, err );
        });
});

// ***************************************************** *****************************************************
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
// router.get('/', userTokenValidation, function (req, res) {
//     notificationService.getNotifications(req.userId,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             globalMethods.error(res, result, 500);
//         });
// });


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
// router.post('/markRead', userTokenValidation, function (req, res) {
//     req.checkBody('notificationId', 'required').notEmpty();
//     var errors = req.validationErrors();

//     if (errors) {
//         res.json({success: false, errors: errors});
//     }
//     else {
//         notificationService.markNotificationsReaded(req.userId, req.body.notificationId,
//             function (data) {
//                 res.status(200).jsonp(data);
//             }, function (result) {
//                 globalMethods.error(res, result, 401);
//             });
//     }
// });

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
