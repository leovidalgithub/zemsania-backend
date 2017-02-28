'use strict';

var mongoose = require('mongoose');
var FormatDate = mongoose.Schema.Types.FormatDate = require('mongoose-schema-formatdate');
var Schema = mongoose.Schema;
var constants = require('../config/constants');


module.exports = function (mongoose) {

    var AbsenceSchema = new Schema({
        date: {type: Date, index: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        status: {type: String, index: true, default: constants.absences_sent},
        imageId: {type: String},
        conceptAbsenceId: {type: Schema.Types.ObjectId, ref: 'ConceptAbsence', index: true},
        comment: {type: String, index: true},
        hours: {type: Number, trim: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'absences'});

    var CalendarSchema = new Schema({
        name: {type: String, trim: true, index: true},
        bankHoliDays: [Date],
        nonWorkingDays: [Date],
        intensiveDays: [Date],
        specialDays: [Date],
        enabled: {type: Boolean, index: true, default: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'calendars'});

    var CalendarUserSchema = new Schema({
        calendarId: {type: Schema.Types.ObjectId, ref: 'Calendar', index: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        name: {type: String, trim: true, index: true},
        bankHoliDaysUser: [Date],
        nonWorkingDaysUser: [Date],
        intensiveDaysUser: [Date],
        specialDaysUser: [Date],
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'calendar_users'});

    var ConceptAbsenceSchema = new Schema({
        nameRef: {type: String, trim: true, index: true},
        enabled: {type: Boolean, index: true, default: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'concepts_absence'});

    var ConceptDailySchema = new Schema({
        idRef: {type: Number},
        tag: {type: String, trim: true, index: true},
        enabled: {type: Boolean, index: true, default: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'concepts_daily'});

    var ConceptSpentSchema = new Schema({
        nameRef: {type: String, trim: true, index: true},
        enabled: {type: Boolean, index: true, default: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'concepts_spent'});

    var DailyReportSchema = new Schema({
        date: {type: Date, index: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        projectId: {type: Schema.Types.ObjectId, ref: 'Project', index: true},
        units: {type: Number},
        conceptDailyId: {type: Number},
        report: {type: String, trim: true},
        typeDay: {type: String, trim: true, index: true, default: 'business_day'},
        status: {type: String, index: true, default: constants.draft},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'daily_reports'});

    var HolidaysSchema = new Schema({
        date: {type: Date, index: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        status: {type: String, index: true, default: constants.requested},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'holidays'});

    var NotificationSchema = new Schema({
        senderId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        receiverId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        type: {type: String, trim: true, index: true},
        status: {type: String, index: true, default: constants.unread},
        text: {type: String, trim: true},
        initDate: {type: Date, default: Date.now},
        endDate: {type: Date, default: Date.now},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'notifications'});

    var ProjectSchema = new Schema({
        projectParent: {type: Schema.Types.ObjectId, ref: 'Project', index: true},
        projectRef: {type: String, trim: true, index: true},
        projectName: {type: String, trim: true, index: true},
        customerRef: {type: String, trim: true, index: true},
        customerName: {type: String, trim: true, index: true},
        initDate: {type: Date, default: Date.now},
        endDate: {type: Date},
        emailSupervisor: {type: String, trim: true, index: true},
        emailSupervisorDelivery: {type: String, trim: true, index: true},
        subfamilies: {type: Array},
        enabled: {type: Boolean, index: true, default: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'projects'});

    var ProjectUsersSchema = new Schema({
        projectId: {type: Schema.Types.ObjectId, ref: 'Project', index: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        initDate: {type: Date, default: Date.now},
        endDate: {type: Date},
        maxHours: {type: Number, trim: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'project_users'});

    var SpentSchema = new Schema({
        date: {type: Date, index: true},
        userId: {type: Schema.Types.ObjectId, ref: 'User', index: true},
        status: {type: String, index: true, default: constants.spent_sent},
        imageId: {type: String},
        price: {type: Number, trim: true},
        conceptSpentId: {type: Schema.Types.ObjectId, ref: 'ConceptSpent', index: true},
        comment: {type: String, index: true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'spents'});

    var UserSchema = new Schema({
        candidatoId: {type: Number, trim: true},
        username: {type: String, trim: true, index: true},
        password: {type: String, trim: true},
        name: {type: String, trim: true, index: true},
        surname: {type: String, trim: true, index: true},
        nif: {type: String, trim: true, index: true},
        createdAt: {type: Date, default: Date.now},
        lastLoginDate: {type: Date},
        enabled: {type: Boolean, index: true, default: true},
        defaultPassword: {type: Boolean, index: true, default: true},
        activationDate: {type: Date},
        birthdate: {type: Date},
        locale: {type: String, trim: true, default: 'es'},
        sex: {type: String, trim: true},
        phone: {type: String, trim: true},
        uuid: {type: String, trim: true, index: true},
        roles: {type: Array, default: ['ROLE_USER']},
        zimbra_cosID: {type: String, trim: true, index: true},
        zimbra_server: {type: String, trim: true, index: true}
    }, {collection: 'users'});

    var CecoSchema = new Schema({
        cecoName: {type: String, index: true},
        status: {type: Boolean, trim: true, default : true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'ceco'});

    var EnterprisesSchema = new Schema({
        enterpriseName: {type: String, index: true},
        band: {type: Boolean, trim: true, default : false},
        status: {type: Boolean, trim: true, default : true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'enterprises'});

    var ProductsSchema = new Schema({
        productName: {type: String, index: true},
        status: {type: Boolean, trim: true, default : true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'products'});

    var ZonasSchema = new Schema({
        zonaName: {type: String, index: true},
        status: {type: Boolean, trim: true, default : true},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'zonas'});



    var models = {
        Absence: mongoose.model('Absence', AbsenceSchema),
        Calendar: mongoose.model('Calendar', CalendarSchema),
        CalendarUser: mongoose.model('CalendarUser', CalendarUserSchema),
        ConceptDaily: mongoose.model('ConceptDaily', ConceptDailySchema),
        ConceptSpent: mongoose.model('ConceptSpent', ConceptSpentSchema),
        ConceptAbsence: mongoose.model('ConceptAbsence', ConceptAbsenceSchema),
        DailyReport: mongoose.model('DailyReport', DailyReportSchema),
        Holidays: mongoose.model('Holidays', HolidaysSchema),
        Notification: mongoose.model('Notification', NotificationSchema),
        Project: mongoose.model('Project', ProjectSchema),
        ProjectUsers: mongoose.model('ProjectUsers', ProjectUsersSchema),
        Spent: mongoose.model('Spent', SpentSchema),
        User: mongoose.model('User', UserSchema),

        Ceco: mongoose.model('Ceco', CecoSchema),
        Enterprises: mongoose.model('Enterprises', EnterprisesSchema),
        Products: mongoose.model('Products', ProductsSchema),
        Zones: mongoose.model('Zones', ZonasSchema)
    };
    return models;
};

