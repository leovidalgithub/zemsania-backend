var express       = require( 'express' ),
    router        = express.Router(),
    verifyService = require( '../services/verifyService' );
var passwordHash = require('password-hash');

// VERIFY RESETPASSWORD-TOKEN IS VALID TO GENERATE A NEW PASSWORD AND SEND TO USER EMAIL
router.get( '/:username', function ( req, res ) { // ***************** LEO WORKING HERE *****************
    var data = {
            username : req.params.username,
            token    : req.query.token
    };
    var html = '';
    verifyService.verifyResetPasswordToken( data,
        function ( data ) {
            if ( data.success ) {
                console.log('ON-TIME');
                
                verifyService.sendNewPassword( res, data );

                // html = '<h3>TODO BIEN. SE ENVIARÁ EL CORREO CON UNA NUEVA CONTRASEÑA</h3>';                
            } else {

                console.log('OUT OF TIME');
                html = '<h4>Ocurrió un problema verificando la información de reinicio de contraseña.<br>Es posible que su identificador único haya expirado o ya haya sido utilizado.<br>Por favor, inténtenlo de nuevo.</h4>';
                res.send( html );
            }
        });
});

module.exports = router;
