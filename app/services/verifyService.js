var mailService = require( './mailService' );

function verifyResetPasswordToken( data, onSuccess ) { // LEO WORKING HERE
    var uuidEmail = data.token;
    models.User.findOne( {
        username : data.username
    }, function ( err, user ) {
        if( err ) {
            onSuccess( { success: false, code: 401, message: 'Error finding User.'} );
        } else {
            if( !user ) {
                onSuccess( { success: false, code: 101, message: 'User not found.'} );
            } else {
                var uuidUser = user.uuid;
                if ( verifyUuid( uuidEmail, uuidUser) ) { // token valid (both token the same and on-time)
                    onSuccess( { success: true, code: 200, message: 'Token OK.', user: user} );
                } else { // token not valid
                    onSuccess( { success: false, code: 102, message: 'Token not valid.'} );
                }
            }
        }
    });
}

// ONCE TOKEN WAS VERIFIED, IT GENERATES NEW-PASSWORD, SAVE NEW-PASSWORD AND EMPTY UUID ON BDD AND SEND EMAIL WITH THE NEW-PASSWORD
function sendNewPassword( res, data ) {
    var user = data.user;
    var newPassword = generateRandomPassword();

    // user.password = passwordHash.generate( newPassword );
    // user.uuid = ''; // remove uuid because it already has been used
    // user.save( function( err ) {
    //     if ( err ) {
    //     } else {
    //         console.log('new password and uuid SAVED That´s really great!');
    //     };
    // });

    mailService.sendNewPassword( data );
    res.end();
    // res.send('<a href="http://google.es" ui-sref="login">Échale bolas!!!</a><hr>');
};

// VERIFY BOTH UUID ARE THE SAME AND HAS NOT EXPIRE
function verifyUuid( uuidEmail, uuidUser ) {
    var uuidTime   = get_date_obj( uuidEmail );
    var actualTime = new Date();
    return ( uuidEmail === uuidUser ) && ( actualTime < uuidTime );
};

// CODE TO GETBACK THE TIMESTAMP FROM UUID
    var GREGORIAN_OFFSET = 122192928000000000;
    function get_time_int( uuid_str ) {
        // (string) uuid_str format =>      '11111111-2222-#333-4444-555555555555'
        var uuid_arr = uuid_str.split( '-' ),
            time_str = [
                uuid_arr[ 2 ].substring( 1 ),
                uuid_arr[ 1 ],
                uuid_arr[ 0 ]
            ].join( '' );
            // time_str is convert  '11111111-2222-#333-4444-555555555555'  to  '333222211111111'
        return parseInt( time_str, 16 );
    };
    function get_date_obj( uuid_str ) {
        // (string) uuid_str format =>      '11111111-2222-#333-4444-555555555555'
        var int_time = get_time_int( uuid_str ) - GREGORIAN_OFFSET,
            int_millisec = Math.floor( int_time / 10000 );
        return new Date( int_millisec );
    };

// GENERATE RANDOM PASSWORD
    function generateRandomPassword() {
        return Math.random().toString( 36 ).slice( -6 );    
    };

module.exports = {
    verifyResetPasswordToken : verifyResetPasswordToken,
    generateRandomPassword   : generateRandomPassword,
    sendNewPassword          : sendNewPassword
};
