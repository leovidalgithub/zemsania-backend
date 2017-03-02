// var express = require('express');

var sendResponse = function ( res, obj ) {
    // console.log( msg );
    return res.status( obj.code ).jsonp( obj );
};

// var error = function ( res, msg, code ) {
//     console.log( msg );
//     return res.status( code ).jsonp( msg );
// };

// var success = function ( res, msg, code ) {
//     return res.status( code ).jsonp(result);
// };

function parse(str) {
    // var args = [].slice.call(arguments, 1),
    var args = Array.slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function () {
        return args[i++];
    });
}

module.exports = {
    sendResponse : sendResponse,
    // error: error,
    // success: success,
    parse: parse
};
