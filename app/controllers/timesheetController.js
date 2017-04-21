var express          = require( 'express' );
var router           = express.Router();
var timesheetService = require( '../services/timesheetService' );
// var userService      = require( '../services/userService' );
// var fs = require( 'fs' );
// var path = require( 'path' );

// RETURN ALL TIMESHEET BY USER, PROJECT, MONTH AND YEAR
router.get( '/getTimesheets/:userID', function( req, res, next ) { // LEO WAS HERE
        var data = {
            userID     : req.params.userID,
            month      : req.query.month,
            year       : req.query.year
    };
    timesheetService.getTimesheets( data,
        function ( data ) {
            globalMethods.successResponse( res, data );
        }, function ( err ) {
            globalMethods.errorResponse( res, err );
        });
});

// SAVES AND UPDATE ALL TIMESHEETS RECEIVED
router.post( '/setAllTimesheets/:userId', function( req, res, next ) { // LEO WAS HERE
    var userId = req.params.userId;
    var data   = req.body;
    timesheetService.setAllTimesheets( userId, data,
        function ( data ) {
                globalMethods.successResponse( res, data );
        }, function ( err ) {
                globalMethods.errorResponse( res, err );
        });
});


// ***************************************************** *****************************************************
// /* POST /timesheet */
// router.post('/', function(req, res, next) {
//     timesheetService.save(req.body, function(err, timesheet) {
//         if (err)
//             return res
//                 .status(400)
//                 .json({ success: false, message: 'invalid or incompleted arguments provided' });
//         res.json(timesheet);
//     });
// });

// router.post('/saveBulk', function(req, res, next) {
//     timesheetService.saveBulk(req.body, function(timesheets) {
//         res.json(timesheets);
//     });
// });

// /* POST /timesheet/query listing by query. */
// router.post('/query', function(req, res, next) {
//     req.body.$query = req.body.$query || {}

//     if (!Object.keys(req.body.$query).length) return res.status(400).json({ success: false, message: 'invalid or incompleted arguments provided' });
//     timesheetService.query(req.body.$query, (err, timesheets) => {
//         if (err) res.status(400);
//         if (!timesheets) res.json({ status: false, message: 'no timesheets founds' });
//         res.json(timesheets)
//     });
// });

// /* GET /timesheet/getUnderSuperior grouped/normalized timesheets for employees under a superior. */
// router.get('/getUnderSuperior', function(req, res, next) {
//     if (!req.query.superiorId) return res.status(400).json({ success: false, message: 'superiorId is required' });
//     timesheetService.getTimesheetsUnderSuperior(req.query.superiorId, (err, timesheets) => {
//         if (err) res.status(400);
//         res.json(timesheets);
//     }, req.query.$query);
// });

// /* GET /timesheet/getProjectTimesheets grouped/normalized timesheets for employees under a superior. */
// router.get('/getProjectTimesheets', function(req, res, next) {
//     if (!req.query.projectId) return res.status(400).json({ success: false, message: 'projectId is required' });
//     timesheetService.getProjectTimesheets(req.query.projectId, (err, timesheets) => {
//         if (err) res.status(400);
//         res.json(timesheets);
//     });
// });

// /* GET /timesheet/exportUserTimesheets export users timesheets. */
// router.get('/exportUserTimesheets', function(req, res, next) {
//     if (!req.query.userEmail) return err('employee email is required');
//     else if (!req.query.startDate || !req.query.endDate) return err('valid date parameters are required');
//     req.query.exportAs = req.query.exportAs || 'download'

//     userService.queryUsers({ username: req.query.userEmail }, function(users) {
//         if (!users.length) return err('employee not found');
//         var emp = users[0];
//         timesheetService.exportExcel({
//             employee: emp._id,
//             startDate: req.query.startDate,
//             endDate: req.query.endDate,
//             exportAs: req.query.exportAs,
//             recipient: req.query.recipient
//         }, (err, result) => {
//             if (err) return res.status(400).json(err);
//             res.json(result);
//         });
//     });

//     function err(message) {
//         res.status(400).json({ success: false, message: message })
//     }
// });

// /* POST /timesheet/aggregate listing by query. */
// router.post('/aggregate', function(req, res, next) {
//     timesheetService.aggregate(req.body, (err, results) => {
//         if (err) res.status(400);
//         res.json(results);
//     });
// });

// /* GET /timesheet/id */
// router.get('/:id', function(req, res, next) {
//     timesheetService.get(req.params.id, (err, timesheet) => {
//         if (err || !timesheet) res.status(400);
//         res.json(timesheet);
//     });
// });

// /* PUT /timesheet/:id */
// router.put('/updateBulk', function(req, res, next) {
//     timesheetService.update(req.body.query, req.body.updates, function(err, arg) {
//         if (err) return res.status(400);
//         res.json({ updated: true });
//     }, req.query.update_initiator);
// });

// /* PUT /timesheet/:id */
// router.put('/:id', function(req, res, next) {
//     timesheetService.update(req.params.id, req.body, function(err, arg) {
//         if (err) return res.status(400);
//         res.json({ updated: true });
//     }, req.query.update_initiator);
// });

// /* DELETE /timesheet/:id */
// router.delete('/:id', function(req, res, next) {
//     timesheetService.delete(req.params.id, function(err, arg) {
//         if (err) res.status(400);
//         res.json({ delete: true });
//     });
// });

module.exports = router;