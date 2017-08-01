/**
 * @swagger
 * resourcePath: /approval
 * description: Approval Hours utilities
 */
var express         = require( 'express' ),
    router          = express.Router(),
    approvalService = require( '../services/approvalService' );

/**
 * @swagger
 * path: /approval/getEmployeesTimesheets
 * operations:
 *   -  httpMethod: GET
 *      summary: Returns al employees from a managerId by month and year
 *      notes: manager autentication token is required (x-auth-token)
 *      nickname: getEmployeesTimesheets
 *      consumes:
 *        - application/json
 */
router.get( '/getEmployeesTimesheets/:managerId', managerTokenValidation, function ( req, res ) {
    var data = {
        managerId : req.params.managerId,
        month     : req.query.month,
        year      : req.query.year
    };
    approvalService.getEmployeesTimesheets( data, 
       function ( data ) {
        globalMethods.successResponse( res, data );
    }, function ( err ) {
        globalMethods.errorResponse( res, err );
    });
});

module.exports = router;
