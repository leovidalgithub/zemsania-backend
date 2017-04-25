var passwordHash = require( 'password-hash' );
var mailService  = require( './mailService' );

function verifyResetPasswordToken( data, onResponse ) { // LEO WAS HERE
    var uuidEmail = data.token;
    models.User.findOne( {
        username : data.username
    }, function ( err, user ) {
        if( err ) {
            onResponse( { success: false, code: 401, message: 'Error finding User.'} );
        } else {
            if( !user ) {
                onResponse( { success: false, code: 101, message: 'User not found.'} );
            } else {
                var uuidUser = user.uuid;
                if ( verifyUuid( uuidEmail, uuidUser) ) { // token valid (both token the same and on-time)
                    onResponse( { success: true, code: 200, message: 'Token OK.', user: user} );
                } else { // token not valid
                    onResponse( { success: false, code: 102, message: 'Token not valid.'} );
                }
            }
        }
    });
}

// ONCE TOKEN WAS VERIFIED, IT GENERATES NEW-PASSWORD, SAVE NEW-PASSWORD AND EMPTY UUID ON BDD AND SEND EMAIL WITH THE NEW-PASSWORD
function newPassword( res, data ) { // LEO WAS HERE
    var user = data.user;
    var newPassword = generateRandomPassword();
    data.newPassword = newPassword;

    user.password = passwordHash.generate( newPassword );
    user.uuid = ''; // remove uuid because it already has been used
    user.defaultPassword = true; // user has to change this new password when login

    return new Promise( function( resolve, reject ) {
        user.save( function( err, user ) {
            if ( err ) {
                reject( err );
            } else {
                mailService.sendNewPassword( data )
                    .then( function( data ) {
                        resolve( data );
                    })
                    .catch( function( err ) {
                        reject( err );
                    });
            }
        });
    });
};

// VERIFY BOTH UUID ARE THE SAME AND HAS NOT EXPIRE
function verifyUuid( uuidEmail, uuidUser ) { // LEO WAS HERE
    var uuidTime   = get_date_obj( uuidEmail );
    var actualTime = new Date();
    return ( uuidEmail === uuidUser ) && ( actualTime < uuidTime );
};

// CODE TO GETBACK THE TIMESTAMP FROM UUID // LEO WAS HERE
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
    function generateRandomPassword() { // LEO WAS HERE
        var charLength = 5,
        numLength      = 2,
        charSet        = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ',
        numSet         = '0123456789',
        charRetVal     = '',
        numRetVal      = '';
        for ( var i = 0, n = charSet.length; i < charLength; ++i ) {
            charRetVal += charSet.charAt( Math.floor( Math.random() * n ) );
        };
        for ( var i = 0, n = numSet.length; i < numLength; ++i ) {
            numRetVal += numSet.charAt( Math.floor( Math.random() * n ) );
        };
        return charRetVal + numRetVal;
    };

module.exports = {
    verifyResetPasswordToken : verifyResetPasswordToken,
    newPassword              : newPassword
};
