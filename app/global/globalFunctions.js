// var express = require('express');

var sendResponse = function ( res, obj ) { // LEO WAS HERE

    console.log(obj);
    // console.log( msg );
    return res.status( obj.code ).jsonp( obj );
    // return res.status( 200 ).jsonp( obj );
};

var successResponse = function ( res, obj ) { // LEO WAS HERE
    return res.status( 200 ).jsonp( obj );
};
var errorResponse = function ( res, obj ) { // LEO WAS HERE
    return res.status( 400 ).jsonp( obj );
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
    successResponse : successResponse,
    errorResponse : errorResponse,
    parse: parse
};
