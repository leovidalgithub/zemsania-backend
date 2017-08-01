'use strict';
var mongoose            = require( 'mongoose' );
var ObjectId            = require( 'mongoose' ).Types.ObjectId;
var async               = require( 'async' );
var timesheetService    = require( '../services/timesheetService' );
var calendarService     = require( '../services/calendarService' );
var projectUsersService = require( '../services/projectUsersService' );

// API - RETURNS ALL EMPLOYEES TIMESHEET INFO AND CALENDARS INFO BY MANAGERID AND DATE RANGE (MONTH AND YEAR)
function getEmployeesTimesheets( data, onSuccess, onError ) { // LEO WORKING HERE
    var managerId  = data.managerId;

    //first get all employees by managerId
    models.User.find( { superior: new ObjectId( managerId ) }, function ( err, employees ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Employees list!', err: err } );
        } else if ( employees ) {
            getTimesheetsArray( data, employees, onSuccess, onError );            
        } else {
            onSuccess( { success: false, code: 501, msg: 'Employees not found!' } );
        }
    });
}

// INTERNAL FUNCTION FOR getEmployeesTimesheets()
// FROM A ARRAY OF EMPLOYEES, IT RETURNS AN ARRAY OF TIMESHEETS BY MONTH AND YEAR FOR EACH EMPLOYEE
function getTimesheetsArray( data, employees, onSuccess, onError ) {
    var employeesArray = [];
    async.each( employees, function( employee, callback ) {
        data.userID = employee._id;
        timesheetService.getTimesheets( data, 
            function ( data ) {
                data.employeeId = employee._id;
                data.name       = employee.name;
                data.surname    = employee.surname;
                data.calendarID = employee.calendarID;
                employeesArray.push( data );
                callback( null );
            },
            function ( err ) {
                callback( 'ERROR !!!' );
            });
    }, function( err ) { // callback when all done
        if( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Employees timesheets!', err: err } );
        } else {
            getCalendarsInfo( data, employeesArray, onSuccess, onError );
        }
    });
}

// INTERNAL FUNCTION FOR getTimesheetsArray()
// ONCE ALL EMPLOYEES TIMESHEETS INFO IS GATHERED, IT RETURNS ALL CALENDARS INFO
function getCalendarsInfo( data, employeesArray, onSuccess, onError ) {
    var calendars = {};
    async.each( employeesArray, function( employee, callback ) {
        data.calendarID = employee.calendarID;
        if( !calendars[ employee.calendarID ] ) {
            calendars[ employee.calendarID ] = {};
            calendarService.getCalendarById( data, 
               function ( response ) {
                    if( response.success ) {
                        calendars[ employee.calendarID ] = response;
                    }
                    callback( null );
            }, function ( err ) {
                    callback( 'ERROR !!!' );
            });                    
        } else {
                callback( null );
        }
    }, function( err ) { // callback when all done
        if( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Calendars info!', err: err } );
        } else {
            getProjectsInfo( employeesArray, calendars, onSuccess, onError );
            // onSuccess( { success: true, code: 200, msg: 'Employees timesheets and Calendars info', employees: employeesArray, calendars : calendars } );

        }
    });
}

// INTERNAL FUNCTION FOR getProjectsInfo()
// GET PROJECTS INFO (NAME)
function getProjectsInfo( employeesArray, calendars, onSuccess, onError ) {
    // store all promises to get name from Project entity
    var myPromises = [];
    employeesArray.forEach( function( employee ) {
        for( var projectId in employee.timesheetDataModel ) {
            myPromises.push( projectUsersService.getProjectName( projectId ) );
        }
    });

    Promise.all( myPromises )
        .then( function( data ) {
            var projectInfo = {}; // prepare this object to be able to access easily to any name
            data.forEach( function( project ) {
                if( project ) {
                    if( !projectInfo[ project._id ] ) projectInfo[ project._id ] = {};
                    projectInfo[ project._id ].name = project.name;                    
                }
            });
            employeesArray.forEach( function( employee ) {
                for( var projectId in employee.timesheetDataModel ) {
                    if( projectInfo[ projectId ] ) {
                        // inside each project we create an object called 'info' to put all necessary info
                        if( !employee.timesheetDataModel[ projectId ].info ) employee.timesheetDataModel[ projectId ].info = {};
                        // 'tables' to store all tables for the frontend inside each project (Horas_Hora, Guardias_Turnicidad, etc.)
                        if( !employee.timesheetDataModel[ projectId ].info.tables ) employee.timesheetDataModel[ projectId ].info.tables = {};
                        employee.timesheetDataModel[ projectId ].info.name = projectInfo[ projectId ].name; // store name into 'employeesArray'
                    }
                }
            });
            onSuccess( { success: true, code: 200, msg: 'Employees timesheets and Calendars info', employees: employeesArray, calendars : calendars } );
        })
        .catch( function( err ) {
            onError( { success: false, code: 500, msg: 'Error getting Projects name!', err: err } );
        });
}

// // INTERNAL FUNCTION FOR getCalendarArray()
// // FROM A ARRAY OF EMPLOYEES, IT RETURNS THE CALENDAR OF EACH EMPLOYEE
// function getCalendarArray( data, employees, onSuccess, onError ) {
//     var employeesTS = [];
//     async.each( employees, function( employee, callback ) {

//         data.userID = employee._id;
//         timesheetService.getTimesheets( data, 
//             function ( data ) {
//                 data.employeeId = employee._id;
//                 data.name = employee.name;
//                 data.surname = employee.surname;
//                 employeesTS.push( data );
//                 callback( null );
//             },
//             function ( err ) {
//                 callback( 'ERROR !!!' );
//             });
//     }, function( err ) { // callback when all done
//         if( err ) {
//             onError( { success: false, code: 500, msg: 'Error getting Employees timesheets!', err: err } );
//         } else {
//             onSuccess( { success: true, code: 200, msg: 'Employees timesheets', employeesTS: employeesTS } );
//         }
//     });

// }


module.exports = {
    getEmployeesTimesheets : getEmployeesTimesheets
};

