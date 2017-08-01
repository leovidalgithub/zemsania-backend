'use strict';
var mongoose  = require( 'mongoose' );
var Schema    = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;
var constants = require( '../config/constants' );
// var FormatDate = mongoose.Schema.Types.FormatDate = require( 'mongoose-schema-formatdate' );

module.exports = function( mongoose ) {

    var UserSchema = new Schema( {
        candidatoId :     { type : String, trim : true }, // candidatoId - index: { unique: true }
        cp :              { type : String, trim : true }, // empleadoContratoCp - index: { unique: true }
        username :        { type : String, trim : true, index: { unique: true } }, // candidatoEmailInterno
        password :        { type : String, trim : true },
        name :            { type : String, trim : true }, // candidatoNombre
        surname :         { type : String, trim : true }, // candidatoApellidos
        nif :             { type : String, trim : true, index: { unique: true } }, // candidatoIdentificacion
        enabled :         { type : Boolean, index : true, default : true },
        defaultPassword : { type : Boolean, index : true, default : true },
        // activationDate :  { type : Date, default : Date.now },
        lastLoginDate :   { type : Date, default : Date.now },
        birthdate :       { type : Date }, // candidatoNacimiento
        locale :          { type : String, trim : true, default : 'es' },
        sex :             { type : String, trim : true }, // candidatoSexo (llega 1 male, 2 female o nada)
        phone :           { type : String, trim : true }, // CONCAT: candidatoTelefono1 + candidatoTelefono2
        uuid :            { type : String, trim : true, index : true },
        roles :           { type : Array, default : ['ROLE_USER'] },
        zimbra_cosID :    { type : String, trim : true },
        zimbra_server :   { type : String, trim : true },
        calendarID :      { type : Schema.Types.ObjectId, ref : 'Calendar' },
        superior :        { type : Schema.Types.ObjectId, ref : 'User' },
        company :         { type : Schema.Types.ObjectId, ref : 'Enterprises' }
    }, { collection: 'users', timestamps: { createdAt: 'created_at' } });

    var EnterprisesSchema = new Schema({
        enterpriseName : { type : String, index: true },
        band           : { type : Boolean, trim: true, default: false },
        enabled        : { type : Boolean, index : true, default : true },
        disabledAt     : { type : Date, default : Date.now }
    }, { collection : 'enterprises', timestamps: { createdAt: 'created_at' } });

        // CALENDARS
    var hours = {
                    initialHour : { type : String, required: true },
                    endHour     : { type : String, required: true }
                };
    var groupDays = {
                        type : { type  : String, index: true, required: true },
                        days : { days  : [ { type : Date } ],
                                 hours : [ hours ]
                               }
                    };
    var years = {
                    year :  { type : Number, trim : true },
                    groupDays : [ groupDays ]
                };
                
    var CalendarSchema = new Schema({
        isLocal       : { type : Boolean, required: true },
        inheritedFrom : { type : Schema.Types.ObjectId, ref: 'Calendar' },
        name          : { type : String, trim : true, index : true, required: true },
        description   : { type : String, trim : true, index : false, required: false },
        years         : [ years ],
        enabled       : { type   : Boolean, default: true }
    }, { collection   : 'calendar', timestamps: { createdAt: 'created_at' } });

    var TimesheetSchema = new mongoose.Schema( {
        userId          : { type: ObjectId, ref: 'User', required: true },
        projectId       : { type: ObjectId, ref: 'Project', required: true },
        type            : { type: Number, required: true },
        subType         : { type: Number, required: true },
        status          : { type: String, default: 'pending' },
        date            : { type: Date, required: true },
        value           : { type: Number, required: true, trim: true },
        comment         : { type: String },
        requestedDate   : { type: Date, default: new Date() },
        processingDate  : { type: Date, default: new Date() },
        verifierReason  : { type : String },
        company         : { type : String }
    }, { collection: 'timesheets', timestamps: { createdAt: 'created_at' } });

    var ProjectSchema = new Schema({
        idOrigen: { type: String, required: true }, // idOrigen
        origenTipo: { type: String, required: true }, // origenTipo
        code: { type: String, trim: true, required: true, index: { unique: true } }, // código (prohibido modificarlo)
        name: { type: String, trim: true, required: true }, // descripción (prohibido modificarlo)
        alias: { type: String, trim: true }, // código (se permite modificarse)
        description: { type: String, trim: true }, // descripción (se permite modificarse)
        // status: { type: String, trim: true, default: "disabled" }, // 
        enabled: { type : Boolean, index : true, default : true },
        initDate: { type: Date, default: new Date() }, // fechaInicio
        lastModifiedDate: { type: Date }, // fechaUltimoCambio
        parentRef: { type: Schema.Types.ObjectId, ref: 'Project' },
        notes: { type: String, trim: true }
    }, { collection: 'projects', timestamps: { createdAt: 'created_at' } });

    var ProjectUsersSchema = new Schema({
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
        roles: { type: Array, default: ['WORKER'] },
        joinDate: { type: Date, default: new Date() },
        maxHours: { type: Number, default: 0, trim: true }
    }, { collection: 'project_users' });

    ProjectUsersSchema.index( { projectId : 1, userId : 1 }, { unique : true } );

    var NotificationSchema = new Schema({
        senderId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', index: true },        
        type: { type: String, trim: true, index: true },
        issueDate: { type: Object }, // stores month/year of each notification. This is to land on 'approval page' from 'Ir a ello' button
        status: { type: String, index: true, default: constants.notification_status_unread },
        text: { type: String, trim: true },
        initDate: { type: Date, default: Date.now },
        endDate: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now }
    }, { collection: 'notifications' });

// *********************************************** **************************************************

    // var AbsenceSchema = new Schema({
    //     date: { type: Date, index: true },
    //     userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    //     status: { type: String, index: true, default: constants.absences_sent },
    //     imageId: { type: String },
    //     conceptAbsenceId: { type: Schema.Types.ObjectId, ref: 'ConceptAbsence', index: true },
    //     comment: { type: String, index: true },
    //     hours: { type: Number, trim: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'absences' });

    // var CalendarSchema = new Schema({
    //     name: { type: String, trim: true, index: true },
    //     bankHoliDays: [Date],
    //     nonWorkingDays: [Date],
    //     intensiveDays: [Date],
    //     specialDays: [Date],
    //     enabled: { type: Boolean, index: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'calendars' });

    // var CalendarUserSchema = new Schema({
    //     calendarId: { type: Schema.Types.ObjectId, ref: 'Calendar', index: true },
    //     userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    //     name: { type: String, trim: true, index: true },
    //     bankHoliDaysUser: [Date],
    //     nonWorkingDaysUser: [Date],
    //     intensiveDaysUser: [Date],
    //     specialDaysUser: [Date],
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'calendar_users' });

    // var ConceptAbsenceSchema = new Schema({
    //     nameRef: { type: String, trim: true, index: true },
    //     enabled: { type: Boolean, index: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'concepts_absence' });

    // var ConceptDailySchema = new Schema({
    //     idRef: { type: Number },
    //     tag: { type: String, trim: true, index: true },
    //     enabled: { type: Boolean, index: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'concepts_daily' });

    // var ConceptSpentSchema = new Schema({
    //     nameRef: { type: String, trim: true, index: true },
    //     enabled: { type: Boolean, index: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'concepts_spent' });

    // var DailyReportSchema = new Schema({
    //     date: { type: Date, index: true },
    //     userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    //     projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    //     units: { type: Number },
    //     conceptDailyId: { type: Number },
    //     report: { type: String, trim: true },
    //     typeDay: { type: String, trim: true, index: true, default: 'business_day' },
    //     status: { type: String, index: true, default: constants.draft },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'daily_reports' });

    // var HolidaysSchema = new Schema({
    //     date: { type: Date, index: true },
    //     userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    //     status: { type: String, index: true, default: constants.requested },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'holidays' });

    // var SpentSchema = new Schema({
    //     date: { type: Date, index: true },
    //     userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    //     status: { type: String, index: true, default: constants.spent_sent },
    //     imageId: { type: String },
    //     price: { type: Number, trim: true },
    //     conceptSpentId: { type: Schema.Types.ObjectId, ref: 'ConceptSpent', index: true },
    //     comment: { type: String, index: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'spents' });

    // var CecoSchema = new Schema({
    //     cecoName: { type: String, index: true },
    //     status: { type: Boolean, trim: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'ceco' });

    // var ProductsSchema = new Schema({
    //     productName: { type: String, index: true },
    //     status: { type: Boolean, trim: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'products' });

    // var ZonasSchema = new Schema({
    //     zonaName: { type: String, index: true },
    //     status: { type: Boolean, trim: true, default: true },
    //     createdAt: { type: Date, default: Date.now }
    // }, { collection: 'zonas' });

    // var HolidaySchemeSchema = new Schema({
    //     name: { type: String, required: true, index: { unique: true } },
    //     description: { type: String },
    //     date: { type: Date, required: true },
    //     default: { type: Boolean }
    // }, { collection: 'holiday_schemes' });

    // var HolidaySchemeEntrySchema = new Schema({
    //     scheme: { type: ObjectId, ref: 'HolidayScheme', required: true },
    //     name: { type: String, required: true },
    //     description: { type: String },
    //     duration: { type: Number, required: true },
    //     date: { type: Date, required: true }
    // }, { collection: 'holiday_schemes_entries' });

    // var WorkloadSchemeTimelineSchema = new Schema({
    //     day: { type: Number, required: true },
    //     value: { type: Number, required: true }
    // });

    // var WorkloadSchemeSchema = new Schema({
    //     name: { type: String, required: true, index: { unique: true } },
    //     description: { type: String },
    //     timeline: [WorkloadSchemeTimelineSchema],
    //     date: { type: Date, required: true },
    //     default: { type: Boolean }
    // }, { collection: 'workload_schemes' });

// ***************************************** *****************************************
    // var TestSchema = new Schema({
    //     name: { type: String, required: true, index: true, lowercase: true },
    //     // date: { type: FormatDate, format: 'YYYY-MM-DD', default: Date.now }
    //     date: { type: Date, required: true, default: Date.now }
    // }, { collection: 'test', timestamps: { createdAt: 'created_at' } });
// ***************************************** *****************************************

    var models = {
        // Thing: mongoose.model('Thing', thingSchema),
        // Calendar: mongoose.model('Calendar', CalendarSchema),
        Calendar           : mongoose.model( 'Calendar'          , CalendarSchema ),
        User               : mongoose.model( 'User'              , UserSchema ),
        Enterprises        : mongoose.model( 'Enterprises'       , EnterprisesSchema ),
        // Absence            : mongoose.model( 'Absence'           , AbsenceSchema ),
        // CalendarUser       : mongoose.model( 'CalendarUser'      , CalendarUserSchema ),
        // ConceptDaily       : mongoose.model( 'ConceptDaily'      , ConceptDailySchema ),
        // ConceptSpent       : mongoose.model( 'ConceptSpent'      , ConceptSpentSchema ),
        // ConceptAbsence     : mongoose.model( 'ConceptAbsence'    , ConceptAbsenceSchema ),
        // DailyReport        : mongoose.model( 'DailyReport'       , DailyReportSchema ),
        // Holidays           : mongoose.model( 'Holidays'          , HolidaysSchema ),
        Notification       : mongoose.model( 'Notification'      , NotificationSchema ),
        Project            : mongoose.model( 'Project'           , ProjectSchema ),
        ProjectUsers       : mongoose.model( 'ProjectUsers'      , ProjectUsersSchema ),
        Timesheet          : mongoose.model( 'Timesheet'         , TimesheetSchema )
        // Spent              : mongoose.model( 'Spent'             , SpentSchema ),
        // HolidayScheme      : mongoose.model( 'HolidayScheme'     , HolidaySchemeSchema ),
        // HolidaySchemeEntry : mongoose.model( 'HolidaySchemeEntry', HolidaySchemeEntrySchema ),
        // WorkloadScheme     : mongoose.model( 'WorkloadScheme'    , WorkloadSchemeSchema ),
        // Ceco               : mongoose.model( 'Ceco'              , CecoSchema ),
        // Products           : mongoose.model( 'Products'          , ProductsSchema ),
        // Zones              : mongoose.model( 'Zones'             , ZonasSchema )
    };

    return models;
};

// ***************************************** *****************************************
// TIMESHEET DATA MODELING
    // var ts_impute = {
    //                 date   : { type : Date, required   : true },
    //                 value  : { type : Number, required : true },
    //                 status : { type : String, required : true }
    //             };

// function ts_impute( _date, _value, _status ) {
//     this.date   = _date;
//     this.value  = _value;
//     this.status = _status;
// }     
    //  var group_ts_impute_subtype = {
    //                 subtype: { type : String, required: true },
    //                 ts_impute : [ ts_impute ]
    //             };

    // var group_ts_impute_type = {
    //                  type: { type  : String, required: true },
    //                  group_ts_impute_subtype : [ group_ts_impute_subtype ]
    //  };

    // var group_ts_impute_project = {
    //                  idProject: { type  : id, required: true },
    //                  group_ts_impute_type: [ group_ts_impute_type ]
    //  };

    //  var group_ts_impute_projects = [ group_ts_impute_project ]

// ***************************************** *****************************************

// ************************************ OLD TIMESHEET ********************************
    // var TimesheetSchema = new mongoose.Schema({
    //     employee: { type: ObjectId, ref: 'User', required: true },
    //     project: { type: ObjectId, ref: 'Project', required: true },
    //     container: { type: String, default: 'horas' },
    //     type: { type: String, required: true },
    //     status: { type: String, default: 'pending' },
    //     date: { type: Date, required: true },
    //     value: {},
    //     comment: String,
    //     requestedDate: { type: Date, default: new Date() },
    //     processingDate: Date,
    //     verifierReason: String,
    //     company: String
    // }, { collection: 'timesheets', timestamps: { createdAt: 'created_at' } });

    // TimesheetSchema.pre('save', function(next) {
    //     var timesheet = this;
    //     if (!timesheet.requestedDate) timesheet.requestedDate = new Date();
    //     next();
    // });
// ***************************************** *****************************************
