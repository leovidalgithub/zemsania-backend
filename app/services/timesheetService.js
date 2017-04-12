var express             = require( 'express' );
var router              = express.Router();
var ObjectId            = require( 'mongoose' ).Types.ObjectId;
// var calendarService     = require( '../services/calendarService' );
var projectUsersService = require( '../services/projectUsersService' );
// var moment              = require( 'moment' );
// var mongoose            = require( 'mongoose' );
// var async               = require( 'async' );
// var authnService        = require( '../services/securityService' );
// var userService         = require( '../services/userService' );
// var Timesheet           = models.Timesheet;
// var json2xls            = require( 'json2xls' );
// var path                = require( 'path' );
// var fs                  = require( 'fs' );
// var mailService         = require( './mailService' );

// API
// RETURNS ALL TIMESHEETS BY 'USERID' AND 'DATE-RANGE' (USUALLY A COMPLETE MONTH)
function getTimesheets( data, onSuccess, onError ) {
console.log('\033c');    
        data.year  = parseInt( data.year, 10),
        data.month = parseInt( data.month, 10);
        data.firstMonthDay = new Date( data.year, data.month, 1 );
        data.lastMonthDay  = new Date( data.year, data.month + 1, 0);

    // var calendarPromise = new Promise( function( resolve, reject ) {
    //     calendarService.getCalendarById( data, function ( response ) {
    //             resolve( response );
    //         }, function ( err ) {
    //             reject( err );
    //         });
    //     });

    var timeSheetsPromise = models.Timesheet.find( {
                                $and: [
                                  { "userId" : data.userID },
                                  { "date"   : { "$gte" : new Date( data.firstMonthDay ), "$lte" : new Date( data.lastMonthDay ) } }
                              ]
    });

    Promise.all( [ timeSheetsPromise ] )
        .then( function( response ) {
            var timesheets = response[0];
            var timesheetDataModel = getTimesheetDataModel( timesheets );
            onSuccess({ success: true, timesheetDataModel : timesheetDataModel });
        })
        .catch( function( err ) {
        });
}

// API
// SAVES BACK TO DB ALL NEW AND MODIFIED TIMESHEETS
function setAllTimesheets( userId, data, onSuccess, onError ) {
console.log('\033c');

    var tsArray = [];
    data.forEach( function( ts ) {
        for( var projectId in ts ) {
            for ( var day in ts[ projectId ] ) {
                for ( var type in ts[ projectId ][day] ) {
                    for ( var subType in ts[ projectId ][day][type] ) {
                        if( ts[ projectId ][day][type][subType].modified ) {
                            var value = ts[ projectId ][day][type][subType].value;
                            tsArray.push( {
                                            userId : userId,
                                            projectId : projectId,
                                            day : day,
                                            type : type,
                                            subType : subType,
                                            value : value,
                                            status : 'draft'
                                        });
                        }
                    }
                }
            }
        }
    });

// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO
// HOW TO FIND BY DATE ON MONGO

    // console.log( tsArray[0] );
    var userId    = tsArray[0].userId;
    var projectId = tsArray[0].projectId;
    var date      = tsArray[0].day;
    var type      = tsArray[0].type;
    var subType   = tsArray[0].subType;
    // console.log(userId);
    // console.log(projectId);
    // console.log(date);
    // console.log(type);
    // console.log(subType);

        models.Timesheet.findOne( {
                                        "userId": userId,
                                        "projectId": projectId,
                                        // "date": date,
                                        "type": type,
                                        "subType": subType,
            })
            .exec(function(err, timesheet) {
                console.log(timesheet);
            });

        onSuccess({ success: true, data : data });
        // onError( { success: false, code: 500, msg: 'Error getting Projects documents!' } );





}

// INTERNAL FUNCTION
function getTimesheetDataModel( timesheets ) {
    var timesheetDataModel = {};
    timesheets.forEach( function( ts ) {
        // creating associative arrays
        if( !timesheetDataModel[ ts.projectId ] ) timesheetDataModel[ ts.projectId ] = {};
        if( !timesheetDataModel[ ts.projectId ][ ts.date ] ) timesheetDataModel[ ts.projectId ][ ts.date ] = {};
        if( !timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ] ) timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ] = {};
        if( !timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ][ ts.subType ] ) timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ][ ts.subType ] = {};
        // storing available data
        timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ][ ts.subType ].value    = ts.value;
        timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ][ ts.subType ].status   = ts.status;
        timesheetDataModel[ ts.projectId ][ ts.date ][ ts.type ][ ts.subType ].modified = false;
    });
    return timesheetDataModel;
}

// INTERNAL FUNCTION
// function getTimesheetDataModel( calendar, timesheets, data ) {
//     var timesheetDataModel = [];
//     for( var day = 1; day < data.lastMonthDay.getDate() + 1; day++ ) { // loop from day 1 to last day on current Month
//         var currentDay = new Date( data.year, data.month, day );
//         var dayType = calendar.eventHours[0].eventDates[ currentDay ].type; // getting dayType (holidays, working, etc.)
//         var findTS_Day = timesheets.filter( function ( ts ) { // finding currentDay inside 'timesheet' object
//             ts.date = ts.date.setHours( 0 , 0 , 0 , 0);
//             return ts.date.getTime() == currentDay.getTime();
//         });
//         if( findTS_Day.length ) { // if currentDay exists inside TS, it is included into 'timesheetDataModel' object
//             findTS_Day.forEach( function( ts ) {
//                 ts.isNew = false;
//                 ts.dayType = dayType;
//                 timesheetDataModel.push( ts );
//             });
//         } else { // if day in timeshhet not exists, we create a new one with default 'type'/'subType' and 'status' in pending 
//             var newTS = {
//                     userID    : data.userID,
//                     projectId : data.projectID,
//                     type      : "Horas",
//                     subType   : "Hora",
//                     date      : new Date( data.year, data.month, day ),
//                     value     : 0,
//                     status    : "pending",
//                     isNew     : true,
//                     dayType   : dayType
// //                    maxhouraimputar : 8,
//             };
//             timesheetDataModel.push( newTS );
//         }
//         // code for get currentDay from calendar and add related calendar-fields to 'timesheetDataModel'
//         // a field with type: working, holidays, etc., to be used by Angular like class to apply CSS colors
//         // a field to know if that day is holiday or non_working, so if it remains on pending to not to be saved back to BDD
//     }

//     console.log('***********************');
//     console.log(timesheetDataModel[0]);
//     console.log(timesheetDataModel[1]);
//     // timesheetDataModel.forEach( function( ts ) {
//     //     console.log( ts.date.getDate() + ' ' + ts.status + ' ' + ts.dayType );
//     // });

//     // timesheetDataModel.forEach( function( ee ) {
//     //     console.log( ee.date.getDate() + ' ' + ee.date.getMonth() + ' ' + ee.date.getFullYear() + ' ' + ee.status + ' ' + ee.isNew + ' '  );
//     // });

//     // function getCalendarDayType() {
//     //     var aa = new Date( data.year, data.month, 3 );
//     //     console.log( calendar.eventHours[0].eventDates[ aa ]. date );
//     //     console.log( calendar.eventHours[0].eventDates[ aa ]. type );


//     //     // for( var day in calendar.eventHours[0].eventDates ) {
//     //     //     console.log( calendar.eventHours[0].eventDates[ day ].date );
//     //     // };
//     // }




//     // console.log( 'getTimesheetDataModel length ' + timesheets.length );
//     // var mm = ['ene','feb','mar','abr','may'];
//     // var currentDay = new Date( year, month, 01 );
//     // var findTS_Day = timesheets.filter( function ( ts ) {
//     //     ts.date = ts.date.setHours( 0 , 0 , 0 , 0);
//     //     return ts.date.getTime() == currentDay.getTime();
//     // });
//     // console.log('**********');
//     // console.log( 'length ' + findTS_Day.length );
//     // console.log('**********');
//     // findTS_Day.forEach( function( ee ) {
//     //     console.log( ee.date.getDate() + ' ' + mm[ee.date.getMonth()] + ' id ' + ee._id );
//     // });


// }

// ***************************************************** *****************************************************
function saveBulkTimesheets(data, callback) {
    var timesheets = []
    async.each(data, function(each, tick) {
        var dt = new Date(each.date);
        var startDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
        var endDate = new Date(startDate.getTime());
        endDate.setDate(endDate.getDate() + 1);
        Timesheet
            .findOne({
                employee: each.employee,
                project: each.project,
                container: each.container,
                type: each.type,
                date: {
                    $gte: startDate,
                    $lt: endDate
                }
            })
            .exec(function(err, timesheet) {
                if (!err && timesheet) {
                    timesheet.comment = each.comment;
                    timesheet.value = each.value;
                    timesheet.status = each.status;
                    timesheet.save(function(err) {
                        if (!err) timesheets.push(timesheet);
                        tick()
                    });
                } else {
                    saveTimesheet(each, function(err, timesheet) {
                        if (!err) timesheets.push(timesheet);
                        tick();
                    });
                }
            });
    }, function() {
        callback(timesheets);
    });
}

function saveTimesheet(data, callback) {
    new Timesheet(data).save(callback);
};

// function query(query, callback) {
//     if (query instanceof Function) callback = query;
//     var _q = query && query.constructor == Object ? query : {};
//     Timesheet
//         .find(_q)
//         .exec(callback);
// };

// function getTimesheetsUnderSuperior(superiorId, callback, advanced_query) {
//     advanced_query = advanced_query || {};
//     userService.queryUsers({ superior: superiorId }, function(users) {
//         var userIds = users.map(u => u._id);
//         var query = { employee: { $in: userIds }, status: { $ne: 'draft' } };
//         for (var key in advanced_query)
//             if (advanced_query.hasOwnProperty(key)) query[key] = advanced_query[key];
//         if (query.date) query.date = normalizeQueryDate(query.date);
//         getGroupedTimesheets(query, callback);
//     }, callback);
// }

// function getProjectTimesheets(projectId, callback) {
//     getGroupedTimesheets({ project: ObjectId(projectId), status: { $ne: 'draft' } }, callback);
// }

// function getGroupedTimesheets(query, callback) {
//     aggregate(
//         [{
//             $match: query
//         }, {
//             $group: {
//                 _id: {
//                     employee: '$employee',
//                     requestedDate: '$requestedDate',
//                     status: '$status',
//                     project: '$project',
//                     type: '$type',
//                     container: '$container'
//                 },
//                 timesheets: { $push: '$$ROOT' },
//                 startDate: { $min: '$date' },
//                 endDate: { $max: '$date' }
//             }
//         }, {
//             $project: {
//                 employee: '$_id.employee',
//                 date: '$_id.requestedDate',
//                 status: '$_id.status',
//                 project: '$_id.project',
//                 type: '$_id.type',
//                 container: '$_id.container',
//                 startDate: 1,
//                 endDate: 1,
//                 timesheets: 1,
//                 _id: 0
//             }
//         }, {
//             $sort: { date: -1 }
//         }],
//         function(err, timesheets) {
//             if (err) return callback(err);
//             models.Timesheet.populate(
//                 timesheets, [
//                     { path: 'employee', select: 'name surname username email company', model: 'User' },
//                     { path: 'project', select: 'name code', model: 'Project' }
//                 ],
//                 function(err) {
//                     timesheets.forEach(t => {
//                         t.timesheets.forEach(t => {
//                             delete t.project;
//                             delete t.employee;
//                             delete t.requestedDate;
//                             delete t.status;
//                             delete t.type;
//                             delete t.container;
//                         });
//                     });
//                     callback(null, timesheets);
//                 })
//         });
// }

// function aggregate(aggregationPipeline, callback) {
//     var _q = aggregationPipeline && aggregationPipeline.constructor == Array ? aggregationPipeline : [{ $match: {} }]
//     Timesheet.aggregate(aggregationPipeline).exec(callback);
// };

// function getTimesheet(timesheetId, callback) {
//     Timesheet
//         .findById(timesheetId)
//         .exec(callback);
// };

// function updateTimesheet(timesheetId_or_query, updates, callback) {
//     var doMulti = typeof timesheetId_or_query != "string" ? true : false;
//     var query = doMulti ? timesheetId_or_query : { _id: timesheetId_or_query };
//     Timesheet.update(query, updates, { multi: doMulti }).exec(callback);
// };

// function deleteTimesheet(timesheetId_or_query, callback) {
//     if (!timesheetId_or_query) return callback(new Error('invalid or no arguments provided'));
//     var query = typeof timesheetId_or_query === "string" ? { _id: timesheetId_or_query } : timesheetId_or_query;
//     Timesheet.remove(query, callback);
// };

// function exportExcel(opt, callback) {
//     if (!opt) opt = {};
//     if (!opt.employee || !opt.startDate || !opt.endDate || !opt.exportAs)
//         return callback({ message: 'invalid or incomplete arguments' });

//     getGroupedTimesheets({
//         employee: new ObjectId(opt.employee),
//         status: 'approved',
//         date: {
//             $gte: new Date(parseInt(opt.startDate)),
//             $lte: new Date(parseInt(opt.endDate))
//         }
//     }, (err, timesheets) => {
//         if (err) return respond(err.message);
//         if (!timesheets.length) return respond();

//         var xlsData = [];
//         Array.prototype.forEach.call(timesheets, function(each) {
//             var ts = each.timesheets;
//             for (var i = 0; i < ts.length; i++) {
//                 for (var j = 0; j < ts.length - 1; j++) {
//                     var cur = ts[j],
//                         next = ts[j + 1],
//                         tmp;
//                     if (new Date(cur.date).getTime() > new Date(next.date).getTime()) {
//                         tmp = ts[j];
//                         ts[j] = ts[j + 1];
//                         ts[j + 1] = tmp;
//                     }
//                 }
//             }
//             Array.prototype.forEach.call(ts, function(t) {
//                 xlsData.push({
//                     date: t.date.toLocaleDateString(),
//                     Project_code: each.project.code || '-',
//                     description: each.project.description || each.project.name,
//                     Project_company: each.project.company || '-',
//                     Employee_id: each.employee._id,
//                     Employee_name: `${each.employee.name || ''}, ${each.employee.surname || ''}`,
//                     hours: typeof t.value == 'boolean' ? (t.value ? 'Si' : 'No') : t.value,
//                     comentarios: t.comment || '-',
//                     employee_company: each.employee.company
//                 });
//             });

//         });

//         xlsData = json2xls(xlsData, {});
//         var tmpPath = path.join(__dirname, '../tmp/', `${Date.now()}.xlsx`);
//         fs.writeFile(tmpPath, xlsData, 'binary', function(err) {
//             if (err) throw err;
            
//             if (opt.exportAs == 'download') return respond(null, path.basename(tmpPath));
//             else if (opt.exportAs == 'email') {
//                 if (opt.recipient)
//                     mailService.execEmail({
//                         to: opt.recipient,
//                         subject: 'Timesheet Report | Zemsania Portal',
//                         html: 'Please find attached timesheet report.<br>Thank You',
//                         attachments: [{
//                             filename: 'timesheetReport.xlsx',
//                             path: tmpPath
//                         }]
//                     }, () => {
//                         respond();
//                         try { fs.unlinkSync(tmp) } catch (e) {};
//                     }, () => {
//                         respond('failed to send email to recipient');
//                     })
//                 else respond('no recipient specified');
//             } else respond();
//         });

//         function respond(error_message, response) {
//             var err, res = { timesheetCount: timesheets.length };
//             if (error_message) err = { message: error_message }
//             if (response) res.response = response;
//             callback(err, res);
//         }

//     });
// }

// function normalizeQueryDate(param) {
//     var paramType = typeof param;
//     if (!param) return;
//     else if (paramType == 'string' || paramType == 'number') return new Date(param);
//     else if (typeof param == 'object') {
//         for (var key in param)
//             if (param.hasOwnProperty(key)) param[key] = normalizeQueryDate(param[key]);
//     }
//     return param;
// }

module.exports = {
    getTimesheets: getTimesheets,
    setAllTimesheets: setAllTimesheets
    // save: saveTimesheet,
    // saveBulk: saveBulkTimesheets,
    // query: query,
    // aggregate: aggregate,
    // get: getTimesheet,
    // update: updateTimesheet,
    // delete: deleteTimesheet,
    // getTimesheetsUnderSuperior: getTimesheetsUnderSuperior,
    // getProjectTimesheets: getProjectTimesheets,
    // exportExcel: exportExcel
};