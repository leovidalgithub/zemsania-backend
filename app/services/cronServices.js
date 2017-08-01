var express = require('express');
var router = express.Router();


/**
 * Test Cron
 */
function testCron() {
    console.log('CRON Executed....');
}


module.exports = {
    testCron: testCron
};

