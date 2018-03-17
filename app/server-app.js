var express          = require( 'express' ),
    app              = express(),
    bodyParser       = require( 'body-parser' ),
    fs               = require( 'fs' ),
    mongoose         = require( 'mongoose' );
    mongoskin        = require( 'mongoskin' ),
    Grid             = require( 'gridfs-stream' ),
    cors             = require( 'cors' );
    mongoose.Promise = Promise;

var environment = process.env.NODE_ENV || 'development',
    config          = require( './config/' + environment ),
    securityService = require( './services/securityService' ),
    constants       = require( './config/constants' ),
    i18n            = require( './config/i18n' ),
    globalFunctions = require( './global/globalFunctions' ),
    gridSchema      = new mongoose.Schema( {}, { strict: false } ),
    fileGrid        = mongoose.model( 'Grid', gridSchema, 'docs.files' ),
    models          = require( './models/entities' )( mongoose ); // mongoose models

//Configuracion global de la app
global.models        = models;
global.config        = config;
global.constants     = constants;
global.i18n          = i18n;
global.globalMethods = globalFunctions;

//Variables globales
global.db                        = mongoskin.db( config.database, { safe: true } );
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

app.set( 'port', process.env.PORT || 5000 );

// Middlewares
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( cors() );


app.get('/test', function(req, res,next) {
    res.send('DONE BY ME!');
});

app.use( '/uploads', express.static( __dirname + '/uploads' ) );

app.use( '/authn'        , require( './controllers/authController' ) );
app.use( '/calendar'     , require( './controllers/calendarController' ) );
app.use( '/notifications', require( './controllers/notificationsController' ) );
app.use( '/mcollections' , require( './controllers/masterCollectionsController' ) );
app.use( '/user'         , require( './controllers/userController' ) );
app.use( '/verify'       , require( './controllers/verifyController' ) );
app.use( '/projectUsers' , require( './controllers/projectUsersController' ) );
app.use( '/timesheets'   , require( './controllers/timesheetController' ) );
app.use( '/approval'     , require( './controllers/approvalController' ) );
app.use( '/project'      , require( './controllers/projectController' ));
app.use( '/mongo', require( './mongo' ) ); // only for database developer purposes

// Start server DEV
app.listen( app.get( 'port' ), function () {
    console.log( 'Zemtime server running on port ' + app.get( 'port' ) + ' from process: ' + process.pid );
});
