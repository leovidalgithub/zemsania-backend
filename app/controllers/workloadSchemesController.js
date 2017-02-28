var express = require('express');
var router = express.Router();
var workloadSchemeService = require('../services/workloadSchemeService');

/* POST /workloadSchemes */
router.post('/', function(req, res, next) {
    workloadSchemeService.save(req.body, function(err, scheme) {
        if (err)
            return res
                .status(400)
                .json({ success: false, message: 'invalid or incompleted arguments provided' });
        res.json(scheme);
    });
});

/* POST /workloadSchemes/query listing by query. */
router.post('/query', function(req, res, next) {
    req.body.$query = req.body.$query || {}
    workloadSchemeService.query(req.body.$query, (err, schemes) => {
        if (err) res.status(400);
        res.json(schemes);
    });
});

/* POST /workloadSchemes/aggregate listing by query. */
router.post('/aggregate', function(req, res, next) {
    workloadSchemeService.aggregate(req.body, (err, results) => {
        if (err) res.status(400);
        res.json(results);
    });
});

/* GET /workloadSchemes/id */
router.get('/:id', function(req, res, next) {
    workloadSchemeService.get(req.params.id, (err, scheme) => {
        if (err || !scheme) res.status(400);
        res.json(scheme);
    });
});

/* PUT /workloadSchemes/:id */
router.put('/:id', function(req, res, next) {
    var d = {};
    workloadSchemeService.update(req.params.id, req.body, function(err, arg) {
        if (err) return res.status(400);
        res.json({ updated: true });
    });
});

/* PUT /workloadSchemes/setDefault/:id */
router.put('/setDefault/:id', function(req, res, next) {
    var d = {}
    workloadSchemeService.setDefaultScheme(req.params.id, function(err, arg) {
        if (err) return res.status(400);
        res.json({ updated: true });
    }, req.query.update_initiator);
});

/* DELETE /workloadSchemes/:id */
router.delete('/:id', function(req, res, next) {
    workloadSchemeService.delete(req.params.id, function(err, arg) {
        if (err) res.status(400);
        res.json({ delete: true });
    });
});

module.exports = router;
