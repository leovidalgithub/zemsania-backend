var express          = require( 'express' ),
    app              = express(),
    bodyParser       = require( 'body-parser' ),
    fs               = require( 'fs' ),
    mongoose         = require( 'mongoose' );
    methodOverride   = require( 'method-override' ),
    mongoskin        = require( 'mongoskin' ),
    multer           = require( 'multer' ),
    Grid             = require( 'gridfs-stream' ),
    expressValidator = require( 'express-validator' ),
    cors             = require( 'cors' ),
    mongoose.Promise = Promise;

//--> https://github.com/andris9/Nodemailer
var environment     = process.env.NODE_ENV || 'dev',
    swagger         = require( 'swagger-express' ),
    config          = require( './config/' + environment ),
    securityService = require( './services/securityService' ),
    constants       = require( './config/constants' ),
    i18n            = require( './config/i18n' ),
    globalFunctions = require( './global/globalFunctions' ),
    gridSchema      = new mongoose.Schema( {}, {strict: false} ),
    fileGrid        = mongoose.model( 'Grid', gridSchema, 'docs.files' );

//Carga de los modelos:
var models    = require( './models/entities' )(mongoose); // get our mongoose model
global.models = models;

//Configuracion global de la app
global.config        = config;
global.constants     = constants;
global.i18n          = i18n;
global.globalMethods = globalFunctions;

//Variables globales
global.db                        = mongoskin.db( config.database, {safe: true} );
global.userTokenValidation       = securityService.userTokenValidation;
global.backofficeTokenValidation = securityService.backofficeTokenValidation;
global.managerTokenValidation    = securityService.managerTokenValidation;
global.deliveryTokenValidation   = securityService.deliveryTokenValidation;
global.fs                        = fs;
global.fileGrid                  = fileGrid;

mongoose.connect( config.database );

var conn   = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs    = Grid( conn.db );
global.gfs = gfs;

// Middlewares
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( bodyParser.json() );
app.use( expressValidator() );
app.use( methodOverride() );
app.use( cors() );

//configuracion upload de ficheros
app.use( '/uploads', express.static( __dirname + '/uploads' ) );
app.use( multer( {dest: './uploads/'} ) )

//configuracion swagger
// app.use(swagger.init(app, {
//     apiVersion: '1.0',
//     swaggerVersion: '1.0',
//     // basePath: config.swaggerBasePath,
//     basePath: "http://localhost:3000/",
//     swaggerURL: '/swagger',
//     swaggerJSON: '/api-docs.json',
//     swaggerUI: './public/swagger/',
//     apis: [
//         './controllers/absencesController.js',
//         './controllers/authController.js',
//         './controllers/calendarController.js',
//         './controllers/configController.js',
//         './controllers/dailyReportController.js',
//         './controllers/holidaysController.js',
//         './controllers/filesApi.js',
//         './controllers/notificationsController.js',
//         './controllers/projectController.js',
//         './controllers/projectUsersController.js',
//         './controllers/spentsController.js',
//         './controllers/userController.js',
//         './controllers/masterCollectionsController.js',
//         './controllers/testController.js'
//     ]
// }));

// Make our db accessible to our router
// app.use(function (req, res, next) {
//     next();
// });


// production error handler
// no stacktraces leaked to user
// app.use(function (err, req, res, next) {

//     res.status(err.status || 500);
//     res.render('error', {
//         message: err,
//         error: {}
//     });
// });

// app.use('/absences', require('./controllers/absencesController'));
app.use( '/authn', require( './controllers/authController' ));
app.use( '/calendar', require( './controllers/calendarController' ));
// app.use('/config', require('./controllers/configController'));
// app.use('/dailyReport', require('./controllers/dailyReportController'));
// app.use('/holidays', require('./controllers/holidaysController'));
// app.use('/files', require('./controllers/filesApi'));
app.use( '/notifications', require( './controllers/notificationsController' ));
// app.use('/project', require('./controllers/projectController'));
// app.use('/projectUsers', require('./controllers/projectUsersController'));
// app.use('/spents', require('./controllers/spentsController'));
// app.use('/timesheets', userTokenValidation, require('./controllers/timesheetController'));
// app.use('/holidaySchemes', userTokenValidation, require('./controllers/holidaySchemesController'));
// app.use('/workloadSchemes', userTokenValidation, require('./controllers/workloadSchemesController'))

app.use( '/mcollections', require('./controllers/masterCollectionsController' ));
app.use( '/user',   require( './controllers/userController' ));
app.use( '/verify', require( './controllers/verifyController' ));
// app.use('/test', require('./controllers/testController'));

// ---------------------------------------------------------
// route middleware to authenticate and check token. From this point, a token is required
// ---------------------------------------------------------
// app.use(function (req, res, next) {
//     securityService.userTokenValidation(req, res, next);
// });

// Start server
app.listen( 3000, function () {
    console.log( 'Node server running on port 3000 from process: ' + process.pid );
});

app.get( '/mongo', function( req, res, next ) {

    // var calendar = new models.Calendar ({
    //     isLocal       : true,
    //     name          : 'Calendario BCN',
    //     groupDays     : [   {
    //                             type    : 'holidays',
    //                             days    : { days  : [  ],
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'working',
    //                             days    : { days  : [  ],
    //                                         hours : [ 
    //                                                     {   
    //                                                         initialHour : '0800',
    //                                                         endHour     : '1230'
    //                                                     },
    //                                                     { 
    //                                                         initialHour : '0230',
    //                                                         endHour     : '1800'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'intensive',
    //                             days    : { days  : [ ],
    //                                         hours : [ 
    //                                                     {   
    //                                                         initialHour : '0800',
    //                                                         endHour     : '1730'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'friday',
    //                             days    : { days  : [ ],
    //                                         hours : [ 
    //                                                     {
    //                                                         initialHour : '0830',
    //                                                         endHour     : '1130'
    //                                                     },
    //                                                     {
    //                                                         initialHour : '1400',
    //                                                         endHour     : '1830'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'special',
    //                             days    : { days  : [ ],
    //                                         hours : [ 
    //                                                     {
    //                                                         initialHour : '0700',
    //                                                         endHour     : '1445'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'non_working',
    //                             days    : { days  : [ ],
    //                                       }
    //                                 }
    //                      ],
    //     enabled       : true
    // });
    // calendar.save();
    // res.send('GET /mongo here');

    // mongoose     = require( 'mongoose' );
    // ObjectId     = require( 'mongoose' ).Types.ObjectId;
    // models.Calendar.findOne( { _id: new ObjectId( '58d0f27265444210e8bd8a84' ) }, function(err,doc){
    //     res.send(doc);
    // });

    // mongoose     = require( 'mongoose' );
    // ObjectId     = require( 'mongoose' ).Types.ObjectId;
    // models.Calendar.findOne( { _id: new ObjectId( '58d152903710b3163ced978b' ) }, function( err, doc ){
    //     doc.groupDays.forEach( function( element ) {
    //         if ( element.type == 'holidays' ) {
    //             element.days.days.push( new Date( '01/01/2017' ) );
    //             element.days.days.push( new Date( '01/06/2017' ) );
    //             element.days.days.push( new Date( '04/03/2017' ) );
    //             element.days.days.push( new Date( '04/06/2017' ) );
    //             element.days.days.push( new Date( '05/01/2017' ) );
    //             element.days.days.push( new Date( '06/01/2017' ) );
    //             element.days.days.push( new Date( '06/24/2017' ) );
    //             element.days.days.push( new Date( '08/25/2017' ) );
    //             element.days.days.push( new Date( '08/26/2017' ) );
    //             element.days.days.push( new Date( '08/27/2017' ) );
    //             element.days.days.push( new Date( '08/28/2017' ) );
    //             element.days.days.push( new Date( '09/25/2017' ) );
    //             element.days.days.push( new Date( '11/01/2017' ) );
    //             element.days.days.push( new Date( '11/02/2017' ) );
    //             element.days.days.push( new Date( '12/09/2017' ) );
    //             element.days.days.push( new Date( '12/25/2017' ) );
    //         }
    //         if ( element.type == 'special' ) {
    //             element.days.days.push( new Date( '01/05/2017' ) );
    //             element.days.days.push( new Date( '04/02/2017' ) );
    //             element.days.days.push( new Date( '05/31/2017' ) );
    //             element.days.days.push( new Date( '06/23/2017' ) );
    //             element.days.days.push( new Date( '08/24/2017' ) );
    //             element.days.days.push( new Date( '09/24/2017' ) );
    //             element.days.days.push( new Date( '12/08/2017' ) );
    //             element.days.days.push( new Date( '12/24/2017' ) );
    //         }
    //         if ( element.type == 'friday' ) {
    //             element.days.days.push( new Date( '01/13/2017' ) );
    //             element.days.days.push( new Date( '01/20/2017' ) );
    //             element.days.days.push( new Date( '01/27/2017' ) );
    //             element.days.days.push( new Date( '02/03/2017' ) );
    //             element.days.days.push( new Date( '02/10/2017' ) );
    //             element.days.days.push( new Date( '02/17/2017' ) );
    //             element.days.days.push( new Date( '02/24/2017' ) );

    //             element.days.days.push( new Date( '03/03/2017' ) );
    //             element.days.days.push( new Date( '03/10/2017' ) );
    //             element.days.days.push( new Date( '03/17/2017' ) );
    //             element.days.days.push( new Date( '03/24/2017' ) );
    //             element.days.days.push( new Date( '03/31/2017' ) );

    //             element.days.days.push( new Date( '04/07/2017' ) );
    //             element.days.days.push( new Date( '04/14/2017' ) );
    //             element.days.days.push( new Date( '04/21/2017' ) );
    //             element.days.days.push( new Date( '04/28/2017' ) );

    //             element.days.days.push( new Date( '05/05/2017' ) );
    //             element.days.days.push( new Date( '05/12/2017' ) );
    //             element.days.days.push( new Date( '05/19/2017' ) );
    //             element.days.days.push( new Date( '05/26/2017' ) );

    //             element.days.days.push( new Date( '06/02/2017' ) );
    //             element.days.days.push( new Date( '06/09/2017' ) );
    //             element.days.days.push( new Date( '06/16/2017' ) );
    //             element.days.days.push( new Date( '06/23/2017' ) );
    //             element.days.days.push( new Date( '06/30/2017' ) );

    //             element.days.days.push( new Date( '07/07/2017' ) );
    //             element.days.days.push( new Date( '07/14/2017' ) );
    //             element.days.days.push( new Date( '07/21/2017' ) );
    //             element.days.days.push( new Date( '07/28/2017' ) );

    //             element.days.days.push( new Date( '08/04/2017' ) );
    //             element.days.days.push( new Date( '08/11/2017' ) );
    //             element.days.days.push( new Date( '08/18/2017' ) );
    //             element.days.days.push( new Date( '08/25/2017' ) );

    //             element.days.days.push( new Date( '09/01/2017' ) );
    //             element.days.days.push( new Date( '09/08/2017' ) );
    //             element.days.days.push( new Date( '09/15/2017' ) );
    //             element.days.days.push( new Date( '09/22/2017' ) );
    //             element.days.days.push( new Date( '09/29/2017' ) );

    //             element.days.days.push( new Date( '10/06/2017' ) );
    //             element.days.days.push( new Date( '10/13/2017' ) );
    //             element.days.days.push( new Date( '10/20/2017' ) );
    //             element.days.days.push( new Date( '10/27/2017' ) );

    //             element.days.days.push( new Date( '11/03/2017' ) );
    //             element.days.days.push( new Date( '11/10/2017' ) );
    //             element.days.days.push( new Date( '11/17/2017' ) );
    //             element.days.days.push( new Date( '11/24/2017' ) );

    //             element.days.days.push( new Date( '12/01/2017' ) );
    //             element.days.days.push( new Date( '12/08/2017' ) );
    //             element.days.days.push( new Date( '12/15/2017' ) );
    //             element.days.days.push( new Date( '12/22/2017' ) );
    //             element.days.days.push( new Date( '12/29/2017' ) );
    //         }
    //         if ( element.type == 'intensive' ) {
    //             element.days.days.push( new Date( '08/01/2017' ) );
    //             element.days.days.push( new Date( '08/02/2017' ) );
    //             element.days.days.push( new Date( '08/03/2017' ) );
    //             element.days.days.push( new Date( '08/07/2017' ) );
    //             element.days.days.push( new Date( '08/08/2017' ) );
    //             element.days.days.push( new Date( '08/09/2017' ) );
    //             element.days.days.push( new Date( '08/10/2017' ) );
    //             element.days.days.push( new Date( '08/14/2017' ) );
    //             element.days.days.push( new Date( '08/15/2017' ) );
    //             element.days.days.push( new Date( '08/16/2017' ) );
    //             element.days.days.push( new Date( '08/17/2017' ) );
    //             element.days.days.push( new Date( '08/21/2017' ) );
    //             element.days.days.push( new Date( '08/22/2017' ) );
    //             element.days.days.push( new Date( '08/23/2017' ) );
    //             element.days.days.push( new Date( '08/29/2017' ) );
    //             element.days.days.push( new Date( '08/30/2017' ) );
    //             element.days.days.push( new Date( '08/31/2017' ) );
    //         }

    //         if ( element.type == 'working' ) {
    //             element.days.days.push( new Date( '01/02/2017' ) );
    //             element.days.days.push( new Date( '01/03/2017' ) );
    //             element.days.days.push( new Date( '01/04/2017' ) );
    //             element.days.days.push( new Date( '01/09/2017' ) );
    //             element.days.days.push( new Date( '01/10/2017' ) );
    //             element.days.days.push( new Date( '01/11/2017' ) );
    //             element.days.days.push( new Date( '01/12/2017' ) );
    //             element.days.days.push( new Date( '01/16/2017' ) );
    //             element.days.days.push( new Date( '01/17/2017' ) );
    //             element.days.days.push( new Date( '01/18/2017' ) );
    //             element.days.days.push( new Date( '01/19/2017' ) );
    //             element.days.days.push( new Date( '01/23/2017' ) );
    //             element.days.days.push( new Date( '01/24/2017' ) );
    //             element.days.days.push( new Date( '01/25/2017' ) );
    //             element.days.days.push( new Date( '01/26/2017' ) );
    //             element.days.days.push( new Date( '01/30/2017' ) );
    //             element.days.days.push( new Date( '01/31/2017' ) );

    //             element.days.days.push( new Date( '02/01/2017' ) );
    //             element.days.days.push( new Date( '02/02/2017' ) );
    //             element.days.days.push( new Date( '02/06/2017' ) );
    //             element.days.days.push( new Date( '02/07/2017' ) );
    //             element.days.days.push( new Date( '02/08/2017' ) );
    //             element.days.days.push( new Date( '02/09/2017' ) );
    //             element.days.days.push( new Date( '02/13/2017' ) );
    //             element.days.days.push( new Date( '02/14/2017' ) );
    //             element.days.days.push( new Date( '02/15/2017' ) );
    //             element.days.days.push( new Date( '02/16/2017' ) );
    //             element.days.days.push( new Date( '02/20/2017' ) );
    //             element.days.days.push( new Date( '02/21/2017' ) );
    //             element.days.days.push( new Date( '02/22/2017' ) );
    //             element.days.days.push( new Date( '02/23/2017' ) );
    //             element.days.days.push( new Date( '02/27/2017' ) );
    //             element.days.days.push( new Date( '02/28/2017' ) );

    //             element.days.days.push( new Date( '03/01/2017' ) );
    //             element.days.days.push( new Date( '03/02/2017' ) );
    //             element.days.days.push( new Date( '03/06/2017' ) );
    //             element.days.days.push( new Date( '03/07/2017' ) );
    //             element.days.days.push( new Date( '03/08/2017' ) );
    //             element.days.days.push( new Date( '03/09/2017' ) );
    //             element.days.days.push( new Date( '03/13/2017' ) );
    //             element.days.days.push( new Date( '03/14/2017' ) );
    //             element.days.days.push( new Date( '03/15/2017' ) );
    //             element.days.days.push( new Date( '03/16/2017' ) );
    //             element.days.days.push( new Date( '03/20/2017' ) );
    //             element.days.days.push( new Date( '03/21/2017' ) );
    //             element.days.days.push( new Date( '03/22/2017' ) );
    //             element.days.days.push( new Date( '03/23/2017' ) );
    //             element.days.days.push( new Date( '03/27/2017' ) );
    //             element.days.days.push( new Date( '03/28/2017' ) );
    //             element.days.days.push( new Date( '03/29/2017' ) );
    //             element.days.days.push( new Date( '03/30/2017' ) );

    //             element.days.days.push( new Date( '04/04/2017' ) );
    //             element.days.days.push( new Date( '04/05/2017' ) );
    //             element.days.days.push( new Date( '04/10/2017' ) );
    //             element.days.days.push( new Date( '04/11/2017' ) );
    //             element.days.days.push( new Date( '04/12/2017' ) );
    //             element.days.days.push( new Date( '04/13/2017' ) );
    //             element.days.days.push( new Date( '04/17/2017' ) );
    //             element.days.days.push( new Date( '04/18/2017' ) );
    //             element.days.days.push( new Date( '04/19/2017' ) );
    //             element.days.days.push( new Date( '04/20/2017' ) );
    //             element.days.days.push( new Date( '04/24/2017' ) );
    //             element.days.days.push( new Date( '04/25/2017' ) );
    //             element.days.days.push( new Date( '04/26/2017' ) );
    //             element.days.days.push( new Date( '04/27/2017' ) );

    //             element.days.days.push( new Date( '05/02/2017' ) );
    //             element.days.days.push( new Date( '05/03/2017' ) );
    //             element.days.days.push( new Date( '05/04/2017' ) );
    //             element.days.days.push( new Date( '05/08/2017' ) );
    //             element.days.days.push( new Date( '05/09/2017' ) );
    //             element.days.days.push( new Date( '05/10/2017' ) );
    //             element.days.days.push( new Date( '05/11/2017' ) );
    //             element.days.days.push( new Date( '05/15/2017' ) );
    //             element.days.days.push( new Date( '05/16/2017' ) );
    //             element.days.days.push( new Date( '05/17/2017' ) );
    //             element.days.days.push( new Date( '05/18/2017' ) );
    //             element.days.days.push( new Date( '05/22/2017' ) );
    //             element.days.days.push( new Date( '05/23/2017' ) );
    //             element.days.days.push( new Date( '05/24/2017' ) );
    //             element.days.days.push( new Date( '05/25/2017' ) );
    //             element.days.days.push( new Date( '05/29/2017' ) );
    //             element.days.days.push( new Date( '05/30/2017' ) );

    //             element.days.days.push( new Date( '06/05/2017' ) );
    //             element.days.days.push( new Date( '06/06/2017' ) );
    //             element.days.days.push( new Date( '06/07/2017' ) );
    //             element.days.days.push( new Date( '06/08/2017' ) );
    //             element.days.days.push( new Date( '06/12/2017' ) );
    //             element.days.days.push( new Date( '06/13/2017' ) );
    //             element.days.days.push( new Date( '06/14/2017' ) );
    //             element.days.days.push( new Date( '06/15/2017' ) );
    //             element.days.days.push( new Date( '06/19/2017' ) );
    //             element.days.days.push( new Date( '06/20/2017' ) );
    //             element.days.days.push( new Date( '06/21/2017' ) );
    //             element.days.days.push( new Date( '06/22/2017' ) );
    //             element.days.days.push( new Date( '06/26/2017' ) );
    //             element.days.days.push( new Date( '06/27/2017' ) );
    //             element.days.days.push( new Date( '06/28/2017' ) );
    //             element.days.days.push( new Date( '06/29/2017' ) );

    //             element.days.days.push( new Date( '07/03/2017' ) );
    //             element.days.days.push( new Date( '07/04/2017' ) );
    //             element.days.days.push( new Date( '07/05/2017' ) );
    //             element.days.days.push( new Date( '07/06/2017' ) );
    //             element.days.days.push( new Date( '07/10/2017' ) );
    //             element.days.days.push( new Date( '07/11/2017' ) );
    //             element.days.days.push( new Date( '07/12/2017' ) );
    //             element.days.days.push( new Date( '07/13/2017' ) );
    //             element.days.days.push( new Date( '07/17/2017' ) );
    //             element.days.days.push( new Date( '07/18/2017' ) );
    //             element.days.days.push( new Date( '07/19/2017' ) );
    //             element.days.days.push( new Date( '07/20/2017' ) );
    //             element.days.days.push( new Date( '07/24/2017' ) );
    //             element.days.days.push( new Date( '07/25/2017' ) );
    //             element.days.days.push( new Date( '07/26/2017' ) );
    //             element.days.days.push( new Date( '07/27/2017' ) );
    //             element.days.days.push( new Date( '07/31/2017' ) );

    //             element.days.days.push( new Date( '09/04/2017' ) );
    //             element.days.days.push( new Date( '09/05/2017' ) );
    //             element.days.days.push( new Date( '09/06/2017' ) );
    //             element.days.days.push( new Date( '09/07/2017' ) );
    //             element.days.days.push( new Date( '09/11/2017' ) );
    //             element.days.days.push( new Date( '09/12/2017' ) );
    //             element.days.days.push( new Date( '09/13/2017' ) );
    //             element.days.days.push( new Date( '09/14/2017' ) );
    //             element.days.days.push( new Date( '09/18/2017' ) );
    //             element.days.days.push( new Date( '09/19/2017' ) );
    //             element.days.days.push( new Date( '09/20/2017' ) );
    //             element.days.days.push( new Date( '09/21/2017' ) );
    //             element.days.days.push( new Date( '09/26/2017' ) );
    //             element.days.days.push( new Date( '09/27/2017' ) );
    //             element.days.days.push( new Date( '09/28/2017' ) );

    //             element.days.days.push( new Date( '10/02/2017' ) );
    //             element.days.days.push( new Date( '10/03/2017' ) );
    //             element.days.days.push( new Date( '10/04/2017' ) );
    //             element.days.days.push( new Date( '10/05/2017' ) );
    //             element.days.days.push( new Date( '10/09/2017' ) );
    //             element.days.days.push( new Date( '10/10/2017' ) );
    //             element.days.days.push( new Date( '10/11/2017' ) );
    //             element.days.days.push( new Date( '10/12/2017' ) );
    //             element.days.days.push( new Date( '10/16/2017' ) );
    //             element.days.days.push( new Date( '10/17/2017' ) );
    //             element.days.days.push( new Date( '10/18/2017' ) );
    //             element.days.days.push( new Date( '10/19/2017' ) );
    //             element.days.days.push( new Date( '10/23/2017' ) );
    //             element.days.days.push( new Date( '10/24/2017' ) );
    //             element.days.days.push( new Date( '10/25/2017' ) );
    //             element.days.days.push( new Date( '10/26/2017' ) );
    //             element.days.days.push( new Date( '10/30/2017' ) );
    //             element.days.days.push( new Date( '10/31/2017' ) );

    //             element.days.days.push( new Date( '11/06/2017' ) );
    //             element.days.days.push( new Date( '11/07/2017' ) );
    //             element.days.days.push( new Date( '11/08/2017' ) );
    //             element.days.days.push( new Date( '11/09/2017' ) );
    //             element.days.days.push( new Date( '11/13/2017' ) );
    //             element.days.days.push( new Date( '11/14/2017' ) );
    //             element.days.days.push( new Date( '11/15/2017' ) );
    //             element.days.days.push( new Date( '11/16/2017' ) );
    //             element.days.days.push( new Date( '11/20/2017' ) );
    //             element.days.days.push( new Date( '11/21/2017' ) );
    //             element.days.days.push( new Date( '11/22/2017' ) );
    //             element.days.days.push( new Date( '11/23/2017' ) );
    //             element.days.days.push( new Date( '11/27/2017' ) );
    //             element.days.days.push( new Date( '11/28/2017' ) );
    //             element.days.days.push( new Date( '11/29/2017' ) );
    //             element.days.days.push( new Date( '11/30/2017' ) );

    //             element.days.days.push( new Date( '12/04/2017' ) );
    //             element.days.days.push( new Date( '12/05/2017' ) );
    //             element.days.days.push( new Date( '12/06/2017' ) );
    //             element.days.days.push( new Date( '12/07/2017' ) );
    //             element.days.days.push( new Date( '12/11/2017' ) );
    //             element.days.days.push( new Date( '12/12/2017' ) );
    //             element.days.days.push( new Date( '12/13/2017' ) );
    //             element.days.days.push( new Date( '12/14/2017' ) );
    //             element.days.days.push( new Date( '12/18/2017' ) );
    //             element.days.days.push( new Date( '12/19/2017' ) );
    //             element.days.days.push( new Date( '12/20/2017' ) );
    //             element.days.days.push( new Date( '12/21/2017' ) );
    //             element.days.days.push( new Date( '12/26/2017' ) );
    //             element.days.days.push( new Date( '12/27/2017' ) );
    //             element.days.days.push( new Date( '12/28/2017' ) );
    //         }

    //         if ( element.type == 'non_working' ) {
    //             element.days.days.push( new Date( '01/07/2017' ) );
    //             element.days.days.push( new Date( '01/08/2017' ) );
    //             element.days.days.push( new Date( '01/14/2017' ) );
    //             element.days.days.push( new Date( '01/15/2017' ) );
    //             element.days.days.push( new Date( '01/21/2017' ) );
    //             element.days.days.push( new Date( '01/22/2017' ) );
    //             element.days.days.push( new Date( '01/28/2017' ) );
    //             element.days.days.push( new Date( '01/29/2017' ) );

    //             element.days.days.push( new Date( '02/04/2017' ) );
    //             element.days.days.push( new Date( '02/05/2017' ) );
    //             element.days.days.push( new Date( '02/11/2017' ) );
    //             element.days.days.push( new Date( '02/12/2017' ) );
    //             element.days.days.push( new Date( '02/18/2017' ) );
    //             element.days.days.push( new Date( '02/19/2017' ) );
    //             element.days.days.push( new Date( '02/25/2017' ) );
    //             element.days.days.push( new Date( '02/26/2017' ) );

    //             element.days.days.push( new Date( '03/04/2017' ) );
    //             element.days.days.push( new Date( '03/05/2017' ) );
    //             element.days.days.push( new Date( '03/11/2017' ) );
    //             element.days.days.push( new Date( '03/12/2017' ) );
    //             element.days.days.push( new Date( '03/18/2017' ) );
    //             element.days.days.push( new Date( '03/19/2017' ) );
    //             element.days.days.push( new Date( '03/25/2017' ) );
    //             element.days.days.push( new Date( '03/26/2017' ) );

    //             element.days.days.push( new Date( '04/01/2017' ) );
    //             element.days.days.push( new Date( '04/08/2017' ) );
    //             element.days.days.push( new Date( '04/09/2017' ) );
    //             element.days.days.push( new Date( '04/15/2017' ) );
    //             element.days.days.push( new Date( '04/16/2017' ) );
    //             element.days.days.push( new Date( '04/22/2017' ) );
    //             element.days.days.push( new Date( '04/23/2017' ) );
    //             element.days.days.push( new Date( '04/29/2017' ) );
    //             element.days.days.push( new Date( '04/30/2017' ) );

    //             element.days.days.push( new Date( '05/06/2017' ) );
    //             element.days.days.push( new Date( '05/07/2017' ) );
    //             element.days.days.push( new Date( '05/13/2017' ) );
    //             element.days.days.push( new Date( '05/14/2017' ) );
    //             element.days.days.push( new Date( '05/20/2017' ) );
    //             element.days.days.push( new Date( '05/21/2017' ) );
    //             element.days.days.push( new Date( '05/27/2017' ) );
    //             element.days.days.push( new Date( '05/28/2017' ) );

    //             element.days.days.push( new Date( '06/03/2017' ) );
    //             element.days.days.push( new Date( '06/04/2017' ) );
    //             element.days.days.push( new Date( '06/10/2017' ) );
    //             element.days.days.push( new Date( '06/11/2017' ) );
    //             element.days.days.push( new Date( '06/17/2017' ) );
    //             element.days.days.push( new Date( '06/18/2017' ) );
    //             element.days.days.push( new Date( '06/25/2017' ) );

    //             element.days.days.push( new Date( '07/01/2017' ) );
    //             element.days.days.push( new Date( '07/02/2017' ) );
    //             element.days.days.push( new Date( '07/08/2017' ) );
    //             element.days.days.push( new Date( '07/09/2017' ) );
    //             element.days.days.push( new Date( '07/15/2017' ) );
    //             element.days.days.push( new Date( '07/16/2017' ) );
    //             element.days.days.push( new Date( '07/22/2017' ) );
    //             element.days.days.push( new Date( '07/23/2017' ) );
    //             element.days.days.push( new Date( '07/29/2017' ) );
    //             element.days.days.push( new Date( '07/30/2017' ) );

    //             element.days.days.push( new Date( '08/05/2017' ) );
    //             element.days.days.push( new Date( '08/06/2017' ) );
    //             element.days.days.push( new Date( '08/12/2017' ) );
    //             element.days.days.push( new Date( '08/13/2017' ) );
    //             element.days.days.push( new Date( '08/19/2017' ) );
    //             element.days.days.push( new Date( '08/20/2017' ) );

    //             element.days.days.push( new Date( '09/02/2017' ) );
    //             element.days.days.push( new Date( '09/03/2017' ) );
    //             element.days.days.push( new Date( '09/09/2017' ) );
    //             element.days.days.push( new Date( '09/10/2017' ) );
    //             element.days.days.push( new Date( '09/16/2017' ) );
    //             element.days.days.push( new Date( '09/17/2017' ) );
    //             element.days.days.push( new Date( '09/23/2017' ) );
    //             element.days.days.push( new Date( '09/30/2017' ) );

    //             element.days.days.push( new Date( '10/01/2017' ) );
    //             element.days.days.push( new Date( '10/07/2017' ) );
    //             element.days.days.push( new Date( '10/08/2017' ) );
    //             element.days.days.push( new Date( '10/14/2017' ) );
    //             element.days.days.push( new Date( '10/15/2017' ) );
    //             element.days.days.push( new Date( '10/21/2017' ) );
    //             element.days.days.push( new Date( '10/22/2017' ) );
    //             element.days.days.push( new Date( '10/28/2017' ) );
    //             element.days.days.push( new Date( '10/29/2017' ) );

    //             element.days.days.push( new Date( '11/04/2017' ) );
    //             element.days.days.push( new Date( '11/05/2017' ) );
    //             element.days.days.push( new Date( '11/11/2017' ) );
    //             element.days.days.push( new Date( '11/12/2017' ) );
    //             element.days.days.push( new Date( '11/18/2017' ) );
    //             element.days.days.push( new Date( '11/19/2017' ) );
    //             element.days.days.push( new Date( '11/25/2017' ) );
    //             element.days.days.push( new Date( '11/26/2017' ) );

    //             element.days.days.push( new Date( '12/02/2017' ) );
    //             element.days.days.push( new Date( '12/03/2017' ) );
    //             element.days.days.push( new Date( '12/10/2017' ) );
    //             element.days.days.push( new Date( '12/16/2017' ) );
    //             element.days.days.push( new Date( '12/17/2017' ) );
    //             element.days.days.push( new Date( '12/23/2017' ) );
    //             element.days.days.push( new Date( '12/30/2017' ) );
    //             element.days.days.push( new Date( '12/31/2017' ) );
    //         }
    //     });
    //     doc.save();
    //     res.send( doc.groupDays );
    // });


});





        // groupDays     : [ {
        //                         type    : 'holidays',
        //                         days    : [ new Date('01/17/2014'), new Date('06/28/2014')  ],
        //                         hours   : [ { 
        //                                         initialHour : '0800',
        //                                         endHour     : '1230'
        //                                   },
        //                                   { 
        //                                         initialHour : '0230',
        //                                         endHour     : '1800'
        //                                   }
        //                                    ]
        //                 } ],

