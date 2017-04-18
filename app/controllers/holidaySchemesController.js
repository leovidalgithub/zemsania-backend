// var express = require('express');
// var router = express.Router();
// var holidaySchemeService = require('../services/holidaySchemeService');

// /* POST /holidaySchemes */
// router.post('/', function(req, res, next) {
//     holidaySchemeService.save(req.body, function(err, scheme) {
//         if (err)
//             return res
//                 .status(400)
//                 .json({ success: false, message: 'invalid or incompleted arguments provided' });
//         res.json(scheme);
//     });
// });

// /* POST /holidaySchemes/query listing by query. */
// router.post('/query', function(req, res, next) {
//     req.body.$query = req.body.$query || {}
//     holidaySchemeService.query(req.body.$query, (err, schemes) => {
//         if (err) res.status(400);
//         res.json(schemes);
//     });
// });

// /* POST /holidaySchemes/aggregate listing by query. */
// router.post('/aggregate', function(req, res, next) {
//     holidaySchemeService.aggregate(req.body, (err, results) => {
//         if (err) res.status(400);
//         res.json(results);
//     });
// });

// /* GET /holidaySchemes/id */
// router.get('/:id', function(req, res, next) {
//     holidaySchemeService.get(req.params.id, (err, scheme) => {
//         if (err || !scheme) res.status(400);
//         res.json(scheme);
//     });
// });

// /* PUT /holidaySchemes/setDefault/:id */
// router.put('/setDefault/:id', function(req, res, next) {
//     var d = {}
//     holidaySchemeService.setDefaultScheme(req.params.id, function(err, arg) {
//         if (err) return res.status(400);
//         res.json({ updated: true });
//     }, req.query.update_initiator);
// });

// /* DELETE /holidaySchemes/:id */
// router.delete('/:id', function(req, res, next) {
//     holidaySchemeService.delete(req.params.id, function(err, arg) {
//         if (err) res.status(400);
//         res.json({ delete: true });
//     });
// });

// /* ---------- Holiday Scheme Entry routes ------------ */

// /* GET /holidaySchemes/getSchemeHolidays */
// router.get('/getSchemeHolidays/:schemeId', function (req, res, next) {
//     holidaySchemeService.getSchemeHolidays(req.params.schemeId, function(err, holidays) {
//         if (err)
//             return res
//                 .status(400)
//                 .json({ success: false, message: 'invalid or incompleted arguments provided' });
//         res.json(holidays);
//     });
// });

// /* POST /holidaySchemes/SchemeEntry */
// router.post('/schemeEntry', function(req, res, next) {
//     holidaySchemeService.saveEntry(req.body, function(err, entry) {
//         if (err)
//             return res
//                 .status(400)
//                 .json({ success: false, message: 'invalid or incompleted arguments provided' });
//         res.json(entry);
//     });
// });

// /* POST /holidaySchemes/querySchemeEntries listing by query. */
// router.post('/schemeEntry/query', function(req, res, next) {
//     req.body.$query = req.body.$query || {}
//     if (!Object.keys(req.body.$query).length) return res.status(400).json({ success: false, message: 'invalid or incompleted arguments provided' });
//     holidaySchemeService.querySchemeEntries(req.body.$query, (err, schemes) => {
//         if (err) res.status(400);
//         res.json(schemes);
//     });
// });

// /* POST /holidaySchemes/aggregate listing by query. */
// router.post('/schemeEntry/aggregate', function(req, res, next) {
//     holidaySchemeService.aggregateSchemeEntries(req.body, (err, results) => {
//         if (err) res.status(400);
//         res.json(results);
//     });
// });

// /* 
//     ROUTE -> /holidaySchemes/schemeEntry/:id 
// */

// /*[GET]*/
// router.get('/schemeEntry/:id', function(req, res, next) {
//     holidaySchemeService.getSchemeEntry(req.params.id, (err, scheme) => {
//         if (err || !scheme) res.status(400);
//         res.json(scheme);
//     });
// });

// /*[DELEE]*/
// router.delete('/schemeEntry/:id', function(req, res, next) {
//     holidaySchemeService.deleteSchemeEntry(req.params.id, function(err, arg) {
//         if (err) res.status(400);
//         res.json({ delete: true });
//     });
// });

// module.exports = router;
