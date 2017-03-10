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
var environment = process.env.NODE_ENV || 'dev';
var swagger = require('swagger-express'); // swagger
var config = require('./config/' + environment);
var securityService = require('./services/securityService');
var constants = require('./config/constants');
var i18n = require('./config/i18n');
var globalFunctions = require('./global/globalFunctions');
var gridSchema = new mongoose.Schema({}, {strict: false});
var fileGrid = mongoose.model('Grid', gridSchema, 'docs.files');

//Carga de los modelos:
var models = require('./models/entities')(mongoose); // get our mongoose model
global.models = models;

//Configuracion global de la app
global.config = config;
global.constants = constants;
global.i18n = i18n;
global.globalMethods = globalFunctions;

//Variables globales
global.db = mongoskin.db(config.database, {safe: true});
global.userTokenValidation = securityService.userTokenValidation;
global.backofficeTokenValidation = securityService.backofficeTokenValidation;
global.managerTokenValidation = securityService.managerTokenValidation;
global.deliveryTokenValidation = securityService.deliveryTokenValidation;
global.fs = fs;
global.fileGrid = fileGrid;


// configuration ===================================================
// =================================================================

mongoose.connect(config.database); // connect to database

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
global.gfs = gfs;

// Middlewares
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( bodyParser.json() );
app.use( expressValidator() );
app.use( methodOverride() );
app.use( cors() );

//configuracion upload de ficheros
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(multer({dest: './uploads/'}))

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
// app.use('/calendar', require('./controllers/calendarController'));
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