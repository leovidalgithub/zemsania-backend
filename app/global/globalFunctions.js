var express = require('express');


var error = function (res, msg, code) {
    console.log(msg);
    return res.status(code).jsonp(msg);
};

var success = function (response, result) {
    return response.status(200).jsonp(result);
};

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function () {
        return args[i++];
    });
}

module.exports = {
    error: error,
    success: success,
    parse: parse

}

