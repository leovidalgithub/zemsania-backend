// /**
//  * @swagger
//  * resourcePath: /test
//  * description: Utilidades de test
//  */
// var express = require('express');
// var router = express.Router();
// var request = require('request');

// /**
//  * @swagger
//  * path: /test/getCalendarGeneric/{calendarId}
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Devuelve los dias festivos
//  *      notes: Devuelve un JSON de Google Calendar, CalendarID de España spain__es
//  *      nickname: getCalendarGeneric
//  *      consumes:
//  *        - application/json
//  *      parameters:
//  *        - name: calendarId
//  *          description: DTO con el calendarId del pais
//  *          paramType: path
//  *          required: true
//  *          dataType: String
//  *
//  */
// router.get('/getCalendarGeneric/:calendarId', function (req, res) {
//     var initUrl = 'https://www.googleapis.com/calendar/v3/calendars/';
//     var endUrl = '%40holiday.calendar.google.com/events?key=AIzaSyDMCxukNCKezmsgQChvFcQJQMQt2C55XG0';
//     var calendarId = req.params.calendarId;
//     var url = initUrl + calendarId + endUrl;
//     request(url, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             res.status(200).jsonp(JSON.parse(body));
//         }
//     });

// });

// /**
//  * @swagger
//  * models:
//  *   DaysImputeScheme:
//  *     properties:
//  *       days:
//  *         type: Array
//  *         items:
//  *              type: Day
//  *         required: true
//  *   CalendarIDScheme:
//  *     properties:
//  *       calendarId:
//  *         type: String
//  *         required: true
//  */
// module.exports = router;
