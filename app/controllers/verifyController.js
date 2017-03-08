var express       = require( 'express' ),
    router        = express.Router(),
    verifyService = require( '../services/verifyService' );

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
                console.log( 'link-token valid' );
                verifyService.newPassword( res, data )
                    .then( function( data ) {
                        console.log( 'New password send' );
                        html = i18n.es.resetPassword.passwordSend;
                    })
                    .catch( function( err ) {
                        console.log( 'Error sending new password' );
                        html = i18n.es.resetPassword.generalError;
                    })
                    .then( function() { // finally
                        res.send( html );
                    })
            } else {
                console.log( 'link-token not valid' );                
                html = i18n.es.resetPassword.unvalidToken;
                res.send( html );
            }
        });
});

module.exports = router;
