var express  = require( 'express' );
var router   = express.Router();
var ObjectId = require( 'mongoose' ).Types.ObjectId;
// var mongoose = require( 'mongoose' );
// var moment   = require( 'moment' );
// var async    = require( 'async' );

// API
// Finds all documents in 'ProjectUsersSchema' by userID and then returns all projects
function getProjectsByUserId( userId, onSuccess, onError ) { // LEO WAS HERE
    models.ProjectUsers.find( { $or : [ { userId : new ObjectId( userId ) }, { projectId : new ObjectId( userId ) } ] },
     function( err, projectUsers ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting ProjectUser documents!' } );
        } else if ( projectUsers ) {
            var myPromises = [];
            var myProjects = [];
            projectUsers.forEach( function( projectUser, key ) {
                myPromises.push ( new Promise( function( resolve, reject ) {
                    return models.Project.findOne( { _id: new ObjectId( projectUser.projectId ), enabled : true }, function( err, project ) {
                        if( err ) {
                            reject( { success: false, code: 500, msg: 'Error getting Projects documents!' } );
                        } else if ( project ) {
                            var projectObject      = project.toObject();
                            projectObject.userId   = projectUser.userId;
                            projectObject.maxHours = projectUser.maxHours;
                            projectObject.joinDate = projectUser.joinDate;
                            myProjects.push( projectObject );
                            resolve();
                        } else {
                            resolve();
                        }
                    });
                }) );
            }); // for each
            promisesResolved( myPromises, myProjects );
        } else {
            onError( { success: false, code: 500, msg: 'Not projects found!', projects : null } );
        };
    });

    function promisesResolved( myPromises, myProjects ) {
        Promise.all( myPromises )
            .then( function( data ) {
                onSuccess({ success: true, projects : myProjects });
            })
            .catch( function( err ) {
                    onError( { success: false, code: 500, msg: 'Error getting Projects documents!' } );
            });
    }
}

// API
// Finds all documents in 'ProjectUsersSchema' by projectID and then returns all users
function getUsersByProjectId( projectId, onSuccess, onError ) { // LEO WAS HERE
    models.ProjectUsers.find( { $or : [ { projectId : new ObjectId( projectId ) }, { projectId : new ObjectId( projectId ) } ] },
     function( err, projectUsers ) {
        if ( err ) {
            onError( { success: false, code: 500, msg: 'Error getting ProjectUser documents!' } );
        } else if ( projectUsers ) {
            var myPromises = [];
            var myUsers    = [];
            projectUsers.forEach( function( projectUser, key ) {
                myPromises.push ( new Promise( function( resolve, reject ) {
                    return models.User.findOne( { _id: new ObjectId( projectUser.userId ), enabled : true } )
                    .populate( [ { path :'superior', select :'name surname' }, { path : 'calendarID', select : 'name' } ] )
                    .exec( function( err, user ) {
                        if( err ) {
                            reject( { success: false, code: 500, msg: 'Error getting Users documents!' } );
                        } else if ( user ) {
                            var userObject      = user.toObject();
                            userObject.userId   = projectUser.userId;
                            userObject.maxHours = projectUser.maxHours;
                            userObject.joinDate = projectUser.joinDate;
                            myUsers.push( userObject );
                            resolve();
                        } else {
                            resolve();
                        }
                    });
                }) );
            }); // for each
            promisesResolved( myPromises, myUsers );
        } else {
            onError( { success: false, code: 500, msg: 'Not Users found!', users : null } );
        };
    });

    function promisesResolved( myPromises, myUsers ) {
        Promise.all( myPromises )
            .then( function( data ) {
                onSuccess({ success: true, users : myUsers });
            })
            .catch( function( err ) {
                    onError( { success: false, code: 500, msg: 'Error getting Users documents!' } );
            });
    }
}

// INTERNAL API
// RETURNS PROJECT NAME BY ITS ID
function getProjectName( projectId ) { // LEO WAS HERE
    return models.Project.findOne( { _id: new ObjectId( projectId ) }, { "name" : 1 } );
}

// API
// Removes a document from 'ProjectUsers' entity
function demarcateUserProject( data, onSuccess, onError ) { // LEO WAS HERE
    var user    = data.user;
    var project = data.project;
    models.ProjectUsers.findOneAndRemove( { $and: [ { userId : new ObjectId( user._id ) } ,{ projectId : new ObjectId( project._id ) } ] } )
        .exec( function( err, result ) {
            if( err ) {
            } else if ( result ) {
                onSuccess( { success: true, msg: 'ProjectUser relationship demarcated corretly', result : result } );
            } else {
                onError( { success: false, code: 501, msg: 'Error: ProjectUser relationship not found!', result : null } );
            }
    });
}

// API
// Returns the occurences of 'id' either on projectId or userId
function countOcurrences( id, onSuccess, onError ) { // LEO WAS HERE
    models.ProjectUsers.count( { $or : [ { projectId : new ObjectId( id ) },
                                         { userId    : new ObjectId( id ) } ] },
                                    function( err, count ) {
        onSuccess( { success: true, msg: 'ProjectUser ocurrences', count : count || 0 } );
    });
}

// ***************************************************** *****************************************************
// /*
//  * Elimina la asignación del Proyecto Usuario por el ID
//  */
// function deleteProjectUser(projectUserId, onSuccess, onError) {
//     models.ProjectUsers.remove({
//         _id: new ObjectId(projectUserId)
//     }, function(err, project) {
//         if (err) throw err;
//         onSuccess({ success: true });
//     });
// }

// /*
//  * Guarda o actualiza la asignación proyecto
//  */
// function saveProjectUser(projectUserForm, onSuccess, onError) {
//     if (projectUserForm._id) {
//         models.ProjectUsers.findOneAndUpdate({ _id: new ObjectId(projectUserForm._id) }, projectUserForm, { upsert: true },
//             function(err, doc) {
//                 if (err) throw err;
//             });
//     } else if (projectUserForm.projectId && projectUserForm.userId) {
//         models.ProjectUsers.findOneAndUpdate(projectUserForm, projectUserForm, { upsert: true },
//             function(err, doc) {
//                 if (err) throw err;
//             });
//     } else {
//         var projectUser = new models.ProjectUsers(projectUserForm);
//         projectUser.save();
//     }
//     onSuccess({ success: true });
// }

// /*
//  * Buscar usuarios por email de supervisor
//  */

// function getUsersBySupervisor(email, onSuccess) {
//     models.Project.find({
//         $or: [
//             { emailSupervisor: email },
//             { emailSupervisorDelivery: email }
//         ]
//     }, function(err, projects) {
//         if (err) throw err;
//         searchUserByProject(projects);
//     });

//     function searchUserByProject(projects) {
//         var projectIds = [];
//         projects.forEach(function(project) {
//             projectIds.push(project._id);
//         });

//         models.ProjectUsers.find({
//             projectId: { $in: projectIds }
//         }, function(err, users) {
//             if (err) throw err;
//             searchUsersById(users);
//         });
//     }

//     function searchUsersById(users) {
//         var usersId = [];
//         users.forEach(function(user) {
//             if (usersId.indexOf(user.userId) < 0) {
//                 usersId.push(user.userId);
//             }
//         });

//         models.User.find({
//             _id: { $in: usersId }
//         }, function(err, users) {
//             if (err) throw err;
//             onSuccess({ success: true, users: users });
//         });
//     }
// }

// /*
//  * Usuarios por proyectoID
//  */
// function getUsersByProjectId(projectId, onSuccess, onError) {
//     models.ProjectUsers.find({ projectId: new ObjectId(projectId) }, function(err, projectUsers) {
//         if (err) throw err;
//         if (projectUsers) {
//             var users = [];
//             var queries = [];
//             projectUsers.forEach(function(projectUser, key) {
//                 queries.push((function(j) {
//                     return function(callback) {
//                         models.User.findOne({ _id: projectUser.userId }, function(err, user) {
//                             if (err) throw err;
//                             var userObject = user.toObject();
//                             userObject.implicationInit = projectUser.initDate;
//                             userObject.implicationEnd = projectUser.endDate;
//                             userObject.implicationId = projectUser._id;
//                             users.push(userObject);
//                             callback();
//                         });
//                     };
//                 })(key));
//             });
//             async.parallel(queries, function() {
//                 onSuccess({ success: true, users: users });
//             });
//         } else {
//             onSuccess({ success: true, users: null });
//         }
//     });
// }

// function query(query, onSuccess, onError) {
//     models.ProjectUsers.find(query, function (err, docs) {
//         if (err) return callback(err);
//         onSuccess(docs);
//     });
// }

// function queryProjectUsers(query, onSuccess, onError) {
//     models.ProjectUsers.find(query, function(err, projectUsers) {
//         if (err) throw err;
//         if (projectUsers) {
//             var users = [];
//             var queries = [];
//             projectUsers.forEach(function(projectUser, key) {
//                 queries.push((function(j) {
//                     return function(callback) {
//                         models.User.findOne({ _id: projectUser.userId }, function(err, user) {
//                             if (err) throw err;
//                             var userObject = user.toObject();
//                             userObject.implicationInit = projectUser.initDate;
//                             userObject.implicationEnd = projectUser.endDate;
//                             userObject.implicationId = projectUser._id;
//                             users.push(userObject);
//                             callback();
//                         });
//                     };
//                 })(key));
//             });
//             async.parallel(queries, function() {
//                 onSuccess({ success: true, users: users });
//             });
//         } else {
//             onSuccess({ success: true, users: null });
//         }
//     });
// }




// /*
//  * Proyectos por UserID y fechas de inicio y final.
//  */
// function getProjectsByUserIDBetweenDates(userId, initDate, endDate, onSuccess, onError) {
//     models.ProjectUsers.find({
//         userId: new ObjectId(userId),
//         $or: [{
//             $and: [
//                 { initDate: { '$lte': new Date(initDate) } }, //Menor o igual
//                 { endDate: { '$gte': new Date(endDate) } } //Mayor o igual
//             ]
//         }, {
//             $and: [
//                 { initDate: { '$lte': new Date(initDate) } }, //Menor o igual
//                 { initDate: { '$lte': new Date(endDate) } }, //Menor o igual
//                 { endDate: { '$gte': new Date(initDate) } }, //Mayor o igual
//                 { endDate: { '$lte': new Date(endDate) } }, //Mayor o igual
//             ]
//         }, {
//             $and: [
//                 { initDate: { '$gte': new Date(initDate) } }, //Menor o igual
//                 { initDate: { '$lte': new Date(endDate) } }, //Mayor o igual
//                 { endDate: { '$gte': new Date(initDate) } }, //Mayor o igual
//                 { endDate: { '$gte': new Date(endDate) } } //Mayor o igual
//             ]
//         }, {
//             $and: [
//                 { initDate: { '$lte': new Date(initDate) } }, //Menor o igual
//                 { endDate: { $exists: false } } //No definida
//             ]
//         }]
//     }, function(err, projectUsers) {
//         if (err) throw err;
//         if (projectUsers) {
//             var projects = [];
//             var queries = [];
//             projectUsers.forEach(function(projectUser, key) {
//                 queries.push((function(j) {
//                     return function(callback) {
//                         models.Project.findOne({ _id: projectUser.projectId }, function(err, project) {
//                             if (err) throw err;
//                             if (project) {
//                                 var projectObject = project.toObject();
//                                 projectObject.implicationInit = projectUser.initDate;
//                                 if (projectUser.endDate) {
//                                     projectObject.implicationEnd = projectUser.endDate;
//                                 }
//                                 projectObject.implicationId = projectUser._id;
//                                 projects.push(projectObject);
//                             }
//                             callback();
//                         });
//                     };
//                 })(key));
//             });
//             async.parallel(queries, function() {
//                 onSuccess({ success: true, projects: projects });
//             });
//         } else {
//             onSuccess({ success: true, projects: null });
//         }
//     });
// }


// /*
//  * Busca Asignaciones
//  */
// function searchProjectUsers(form, onSuccess, onError) {

//     var query = [];

//     if (form._id) {
//         query.push({
//             _id: new ObjectId(form._id)
//         });
//     }
//     if (form.projectId) {
//         query.push({
//             projectId: {
//                 '$regex': form.projectId
//             }
//         });
//     }
//     if (form.userId) {
//         query.push({
//             userId: {
//                 '$regex': form.userId
//             }
//         });
//     }
//     if (form.initDate) {
//         query.push({
//             initDate: form.initDate
//         });
//     }
//     if (form.endDate) {
//         query.push({
//             endDate: form.endDate
//         });
//     }

//     var aggregate = [];
//     if (query.length > 0) {
//         aggregate.push({
//             '$match': {
//                 $and: query
//             }
//         });
//     }

//     var page = form.page === undefined ? 0 : form.page;
//     var rows = form.rows === undefined ? 10 : form.rows;

//     if (page > -1) {

//         aggregate.push({
//             '$skip': (page * rows)
//         });

//         aggregate.push({
//             '$limit': rows
//         });
//     }

//     models.ProjectUsers.aggregate(aggregate, function(err, projectUsers) {
//         if (err) throw err;
//         onSuccess({ success: true, projectUsers: projectUsers });
//     });

//     /* models.ProjectUsers.find({userId: form.userId}, {
//      'projectId': 0, 'createdAt': 0, '__v': 0
//      }).
//      populate('userId').populate('projectId').exec(function (err, projectUsers) {
//      if (err) throw err;
//      onSuccess({success: true, projectUsers: projectUsers});
//      });*/
// }

// /**
//  *  Comprueba que el usuario tiene horas disponibles
//  * @param dailyReport
//  * @param onSuccess
//  * @param onError
//  */

// function checkProjectUserDate(userId, dailyReport, hoursTotal, onSuccess, onError) {
//     models.ProjectUsers.findOne({
//         $or: [{
//             $and: [{
//                 initDate: { '$lte': new Date(dailyReport.date) },
//                 endDate: { '$gte': new Date(dailyReport.date) }
//             }]
//         }, {
//             $and: [{
//                 initDate: { '$lte': new Date(dailyReport.date) },
//                 endDate: { $exists: false }
//             }]
//         }],
//         userId: new ObjectId(userId),
//         projectId: new ObjectId(dailyReport.projectId)
//     }, function(err, projectUser) {
//         if (err) throw err;

//         if (projectUser) {
//             if ((typeof projectUser.maxHours === 'undefined') || projectUser.maxHours === 0 ||
//                 (dailyReport.hours + hoursTotal) <= projectUser.maxHours) {
//                 onSuccess(true);
//             } else {
//                 onError('hours_exceeded');
//             }
//         } else {
//             onError('unallocated_project_user');
//         }
//     });
// }


module.exports = {
    getProjectsByUserId: getProjectsByUserId,
    getUsersByProjectId: getUsersByProjectId,
    getProjectName: getProjectName,
    demarcateUserProject: demarcateUserProject,
    countOcurrences: countOcurrences
    // checkProjectUserDate: checkProjectUserDate,
    // deleteProjectUser: deleteProjectUser,
    // getProjectsByUserIdBetweenDates: getProjectsByUserIdBetweenDates,
    // getUsersByProjectId: getUsersByProjectId,
    // saveProjectUser: saveProjectUser,
    // getUsersBySupervisor: getUsersBySupervisor,
    // searchProjectUsers: searchProjectUsers,
    // queryProjectUsers: queryProjectUsers,
    // query: query
};
