var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var projectUsersService = require('../services/projectUsersService');
var authnService = require('../services/securityService');
var userService = require('../services/userService');

/**
 * import new project from CRM
 */
function importCRMProject(CRMData, onSuccess, onError) {
    validateCRMData(CRMData, function(errors) {
        if (errors.length)
            return onError(errors);

        var projects = [];
        CRMData.Projects.forEach(function(project) {
            projects.push(normalizeProject(project));
        });
        models.User.find().exec(function(err, users) {
            if (err || !users.length) return onError(errors.concat('was unable to process users'));

            projects.forEach(function(project) {
                var supervisors = [],
                    workers = [];
                users.forEach(function(user) {
                    if (!user || !user.username) return;
                    for (var i = 0; i < project.supervisors.length; i++) {
                        if (user.username.replace(/@zemsania.com/gi, '').toLowerCase() === project.supervisors[i].replace(/@zemsania.com/gi, '').toLowerCase()) {
                            supervisors.push(user._id);
                        }
                    }
                    for (var j = 0; j < project.workers.length; j++) {
                        if (user.username.replace(/@zemsania.com/gi, '').toLowerCase() === project.workers[j].replace(/@zemsania.com/gi, '').toLowerCase()) {
                            workers.push(user._id);
                        }
                    }
                });
                project.workers = workers;
                project.supervisors = supervisors;
            });

            var _errors = [];
            async.each(projects, function(project, tick) {

                project.resources = {}
                var arr = []
                project.supervisors.forEach(function(uid) {
                    if (!project.resources[uid.toString()]) { project.resources[uid.toString()] = [] }
                    project.resources[uid.toString()].push('MANAGER');
                });
                project.workers.forEach(function(uid) {
                    if (!project.resources[uid.toString()]) { project.resources[uid.toString()] = [] }
                    project.resources[uid.toString()].push('WORKER');
                });

                var resource_docs = [];
                for (var user_id in project.resources)
                    if (project.resources.hasOwnProperty(user_id)) {
                        var roles = project.resources[user_id]
                        var resource_doc = {
                            userId: user_id,
                            roles: roles
                        };
                        resource_docs.push(resource_doc);
                    }

                new models.Project(project).save(function(err, projectDoc) {
                    if (err) {
                        if (err.code == 11000) _errors.push(`duplicate project with crm ${project.crm_id}`);
                        else _errors.push(`error occured while inserting project with crm ${project.crm_id}`);
                        return tick();
                    }
                    async.each(resource_docs, function(resource_doc, _tick) {
                        resource_doc.projectId = projectDoc._id;
                        new models.ProjectUsers(resource_doc).save(function(err, projectResourceDoc) {
                            if (err) {
                                _errors.push(err.message);
                                _errors.push(`error occured while inserting project resource ${resource_doc.userId}`);
                            }
                            _tick();
                        });
                    }, tick);
                });
            }, function() {
                if (_errors.length) return onError(_errors);
                onSuccess();
            });
        }, function(err) {
            errors.push(`error while fetching system users`)
            onError(errors)
        })


    });

}

function normalizeProject(project) {
    var mapping = {
            'Crm_id': 'crm_id',
            'Cod': 'code',
            'ProjectName': 'name',
            'ProjectAlias': 'alias',
            'ProjectDescription': 'description',
            'ProjectStatus': 'status',
            'ProjectOwners': 'supervisors',
            'ProjectWorkers': 'workers'
        },
        _project = {};
    for (var attr in mapping) {
        if (mapping.hasOwnProperty(attr) && project.hasOwnProperty(attr)) {
            _project[mapping[attr]] = project[attr]
        }
    }
    if (_project.status) _project.status = _project.status.toLowerCase();
    return _project;
}

function validateCRMData(data, cb, isUpdateProcedure) {
    var errors = [];
    if (data) {
        if (data.Projects && data.Projects.length) {
            data.Projects.forEach(function(project, index) {
                var errs = validateProjectNode(project, index);
                errors = errors.concat(errs);
            });
        } else errors.push('no valid project entries found');
    } else errors.push('invalid response provided');

    cb(errors);

    function validateProjectNode(project, index) {
        var errors = [];
        if (project) {
            if (!project.Crm_id) errors.push(`invalid Crm id at [${index}]`);
            if (isUpdateProcedure === true) return errors
            if (!project.ProjectName) errors.push(`invalid projectName at [${index}]`);
            if (!project.ProjectOwners) errors.push(`invalid data in projectOwners at [${index}]`);
            if (!project.ProjectWorkers) errors.push(`invalid data in projectWorkers at [${index}]`);
            // for (var prop in project) {
            //     if (project.hasOwnProperty(prop)) {
            //         var propName = prop[0].toLowerCase() + prop.substr(1);
            //         project[propName] = project[prop];
            //         delete project[prop];
            //     }
            // }
        } else errors.push(`invalid project entry at [${index}]`);
        return errors;
    }
}


/**
 * update existing project from CRM data
 */

function updateCRMProject(CRMData, onSuccess, onError) {
    validateCRMData(CRMData, function(errors) {
        if (errors.length)
            return onError(errors);
        var projects = [];
        return models
            .Project
            .find({ crm_id: { $in: CRMData.Projects.map(p => p.Crm_id) } })
            .exec(function(err, projects) {
                if (err || !projects.length) return onError(errors.concat('no projects found agains provided crm_id(s)'));
                models.User.find().exec(function(err, users) {
                    if (err || !users.length) return onError(errors.concat('was unable to process users'));
                    var actions = [];
                    CRMData.Projects.forEach(function(project, index) {
                        var p = projects.find(p => p.crm_id === project.Crm_id);
                        if (!p) return;
                        ['ProjectOwners', 'ProjectWorkers'].forEach(function(resource) {
                            for (var action in project[resource])
                                if (project[resource].hasOwnProperty(action)) {
                                    project[resource][action].forEach(function(username, index) {
                                        var user = users.find(u => {
                                            // if (u && u.username) return u.username.replace(/@zemsania.com/gi, '').toLowerCase() === username.toLowerCase();
                                            if (u && u.username) return u.username.replace(/@zemsania.com/gi, '').toLowerCase() === username.replace(/@zemsania.com/gi, '').toLowerCase();
                                        });
                                        if (user) {
                                            var r = resource == 'ProjectOwners' ? 'MANAGER' : (resource == 'ProjectWorkers' ? 'WORKER' : undefined);
                                            if (r) actions.push({ user_id: user._id, project_id: p._id, role: r, action: action });
                                        }
                                    });
                                }
                        });
                    });
                    if (!actions.length) return onSuccess();
                    var query = {
                        $or: actions.map(each => {
                            return { userId: each.user_id, projectId: each.project_id }
                        })
                    };
                    var nonExistingTasks = [];
                    models
                        .ProjectUsers
                        .find(query)
                        .exec(function(err, projectRoles) {
                            if (err || !projectRoles.length) return verifyNonExistingTasks((nonExistingTasks = actions));
                            actions.forEach(function(task) {
                                var projectRole = projectRoles.find(each => each.userId.toString() == task.user_id && each.projectId.toString() == task.project_id.toString());
                                if (!projectRole || !projectRole.roles) return nonExistingTasks.push(task);
                                var index;

                                if (task.action == 'add') {
                                    if ((index = projectRole.roles.indexOf(task.role)) == -1) {
                                        projectRole.roles.push(task.role);
                                    }
                                } else if (task.action == 'remove') {
                                    if ((index = projectRole.roles.indexOf(task.role)) > -1) {
                                        projectRole.roles.splice(index, 1);
                                    }
                                }
                            });
                            async.each(projectRoles, function(projectRole, tick) {
                                projectRole.save(_ => {
                                    models.ProjectUsers.remove({ roles: { $size: 0 } }).exec(tick);
                                });
                            }, verifyNonExistingTasks);
                        });

                    function verifyNonExistingTasks() {
                        if (!nonExistingTasks.length || !(nonExistingTasks = nonExistingTasks.filter(t => t.action == 'add')).length) return onSuccess();
                        var normalized_list = {};
                        for (var i = 0; i < nonExistingTasks.length; i++) {
                            var t;
                            if ((t = nonExistingTasks[i])) {
                                var key = `${t.user_id}__${t.project_id}`;
                                if (!normalized_list[key]) {
                                    normalized_list[key] = {
                                        userId: t.user_id,
                                        projectId: t.project_id,
                                        roles: [t.role]
                                    };
                                    continue;
                                }
                                normalized_list[key].roles.push(t.role)
                            }
                        }
                        nonExistingTasks = Object.keys(normalized_list).map(key => normalized_list[key]);
                        if (!nonExistingTasks.length) return onSuccess();
                        async.each(nonExistingTasks, (task, tick) => {
                            new models.ProjectUsers(task).save(tick);
                        }, onSuccess);
                    }
                }, function(err) {
                    onError(errors.concat(`error while fetching system users`));
                });
            });
    }, true);
}

/*
 * Get project by project id
 */
function getProject(projectId, onSuccess, onError) {
    models.Project.findById(projectId, function (err, doc) {
        if (err) return onError(err);
        onSuccess({ success: doc != null, project: doc });
    });
}

/*
 * Borra el proyecto
 */
function deleteProject(projectForm, onSuccess, onError) {
    if (projectForm._id) {
        models.Project.findOneAndUpdate({
            _id: new ObjectId(projectForm._id)
        }, { enable: false }, function(err, project) {
            if (err) throw err;
        });
    } else if (projectForm.projectRef) {
        models.Project.remove({
            projectRef: projectForm.projectRef
        }, function(err, project) {
            if (err) throw err;
        });
    }
    onSuccess({ success: true });
}

/*
 * Salva el proyecto
 */
function saveProject(projectForm, onSuccess, onError) {
    if (projectForm._id) {
        models.Project.findOneAndUpdate({ _id: new ObjectId(projectForm._id) }, projectForm, function(err, doc) {
            if (err) {
                return onError({ error: err });
            }
        });
    } else if (projectForm.projectParent) {
        models.Project.findOneAndUpdate({ _id: new ObjectId(projectForm._id) }, projectForm, { upsert: true },
            function(err, doc) {
                if (err) {
                    return onError({ error: err });
                }
            });
    } else if (projectForm.projectRef) {
        models.Project.findOneAndUpdate({ projectRef: projectForm.projectRef }, projectForm, { upsert: true },
            function(err, doc) {
                if (err) {
                    return onError({ error: err });
                }
            }
        );
    } else {
        var project = new models.Project(projectForm);
        project.save();
    }
    onSuccess({ success: true });
}

/*
 * Busca los proyectos
 */
function searchProject(form, onSuccess, onError) {

    var query = [];

    if (form._id) {
        query.push({
            _id: new ObjectId(form._id)
        });
    }
    if (form.projectParent) {
        query.push({
            projectParent: {
                '$regex': form.projectParent
            }
        });
    }
    if (form.projectRef) {
        query.push({
            projectRef: {
                '$regex': form.projectRef
            }
        });
    }
    if (form.projectName) {
        query.push({
            projectName: {
                '$regex': new RegExp(form.projectName, 'i')
            }
        });
    }
    if (form.customerRef) {
        query.push({
            customerRef: {
                '$regex': form.customerRef
            }
        });
    }

    if (form.customerName) {
        query.push({
            customerName: {
                '$regex': new RegExp(form.customerName, 'i')
            }
        });
    }
    if (form.initDate) {
        query.push({
            initDate: form.initDate
        });
    }
    if (form.endDate) {
        query.push({
            endDate: form.endDate
        });
    }
    if (form.emailSupervisor) {
        query.push({
            emailSupervisor: {
                '$regex': form.emailSupervisor
            }
        });
    }
    if (form.emailSupervisorDelivery) {
        query.push({
            emailSupervisorDelivery: {
                '$regex': form.emailSupervisorDelivery
            }
        });
    }
    if (form.status) {
        query.push({
            type: {
                '$regex': form.status
            }
        });
    }
    if (form.enabled) {
        query.push({
            enabled: form.enabled
        });
    } else {
        query.push({
            enabled: true
        });
    }

    var aggregate = [];
    if (query.length > 0) {
        aggregate.push({
            '$match': {
                $and: query
            }
        });
    }

    var page = form.page === undefined ? 0 : form.page;
    var rows = form.rows === undefined ? 10 : form.rows;

    if (page > -1) {

        aggregate.push({
            '$skip': (page * rows)
        });

        aggregate.push({
            '$limit': rows
        });
    }

    models.Project.aggregate(aggregate, function(err, projects) {
        if (err) throw err;
        onSuccess({ success: true, projects: projects });
    });
}

/*
 * Get projects by superior
 */
function getUnderManager(managerId, onSuccess, onError) {
    projectUsersService.query({ userId: managerId, roles: { $in: ['MANAGER'] } }, function(docs) {
        models.Project.find({ _id: { $in: docs.map(d => d.projectId) } }, function(err, projects) {
            if (err) return onError(err);
            onSuccess(projects);
        });
    }, onError);
}

/*
 * Importa el proyecto-usuario
 */
function importProjectUser(projectUserForm, onSuccess, onError) {
    projectUserForm.enabled = true;
    var initDate = new Date(projectUserForm.initDate);
    models.Project.findOneAndUpdate({
        projectRef: projectUserForm.projectRef,
        projectName: projectUserForm.projectName,
        initDate: initDate
    }, projectUserForm, { upsert: true }, function(err, project) {
        if (err) {
            return onError({ error: err });
        }

        authnService.signup({
            username: projectUserForm.emailSupervisor,
            roles: ['ROLE_USER', 'ROLE_MANAGER'],
            password: constants.defaultPassword
        }, function() {}, function() {});
        authnService.signup({
            username: projectUserForm.emailSupervisorDelivery,
            roles: ['ROLE_USER', 'ROLE_DELIVERY'],
            password: constants.defaultPassword
        }, function() {}, function() {});

        models.User.findOne({ username: projectUserForm.emailUser }, function(err, user) {
            if (user) {
                var projectUserScheme = {};
                projectUserScheme.createdAt = new Date();
                projectUserScheme.projectId = new ObjectId(project._id);
                projectUserScheme.userId = new ObjectId(user._id);
                projectUserScheme.initDate = projectUserForm.assigmentInitDate;
                if (projectUserForm.assigmentEndDate) {
                    projectUserScheme.endDate = projectUserForm.assigmentEndDate;
                }
                projectUsersService.saveProjectUser(projectUserScheme, function() {}, function() {});
            } else {
                var sexUser = 'male';
                if (typeof projectUserForm.sexUser === 'undefined' || projectUserForm.sexUser !== 1) {
                    sexUser = 'female';
                }
                if (typeof projectUserForm.birthDate === 'undefined') {
                    projectUserForm.birthDate = new Date();
                }

                authnService.signup({
                    username: projectUserForm.emailUser,
                    roles: ['ROLE_USER'],
                    password: constants.defaultPassword,
                    name: projectUserForm.nameUser,
                    surname: projectUserForm.surnameUser,
                    nif: projectUserForm.nifUser,
                    sex: sexUser,
                    candidatoId: projectUserForm.candidatoId,
                    birthdate: projectUserForm.birthDate
                }, function(result) {
                    var projectUserScheme = {};
                    projectUserScheme.createdAt = new Date();
                    projectUserScheme.projectId = new ObjectId(project._id);
                    projectUserScheme.userId = new ObjectId(result.user._id);
                    projectUserScheme.initDate = projectUserForm.assigmentInitDate;
                    if (projectUserForm.assigmentEndDate) {
                        projectUserScheme.endDate = projectUserForm.assigmentEndDate;
                    }
                    projectUsersService.saveProjectUser(projectUserScheme, function() {}, function() {});
                }, function() {});
            }
        });
    });
    onSuccess({ success: true });
}

/*
 * Deshabilita el proyecto-usuario
 */
function deleteImportedProjectUser(projectUserForm, onSuccess, onError) {
    models.Project.findOneAndUpdate({
            projectRef: projectUserForm.projectRef,
            projectName: projectUserForm.projectName
        }, { enabled: false },
        function(err, project) {
            if (err) {
                return onError({ error: err });
            }
            models.User.findOne({ username: projectUserForm.emailUser }, function(err, user) {
                if (err) {
                    return onError({ error: err });
                }
                var projectUserScheme = {};
                projectUserScheme.projectId = new ObjectId(project.projectId);
                projectUserScheme.userId = new ObjectId(user._id);
                projectUserScheme.initDate = projectUserForm.assigmentInitDate;
                models.ProjectUsers.findOneAndRemove(projectUserScheme, function(err) {
                    if (err) {
                        return onError({ error: err });
                    }
                    onSuccess({ success: true });
                });
            });
        }
    );
}

module.exports = {
    getProject: getProject,
    searchProject: searchProject,
    saveProject: saveProject,
    deleteProject: deleteProject,
    importProjectUser: importProjectUser,
    deleteImportedProjectUser: deleteImportedProjectUser,
    importProjectFromCRM: importCRMProject,
    updateProjectFromCRM: updateCRMProject,
    getUnderManager: getUnderManager
};
