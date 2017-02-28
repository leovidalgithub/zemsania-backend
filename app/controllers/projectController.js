/**
 * @swagger
 * resourcePath: /project
 * description: Utilidades para imputar horas
 */
var express = require('express');
var router = express.Router();
var projectService = require('../services/projectService');

/**
 * @custom api
 * path: /project/saveFromCRM
 * description: api for inserting new records obtained from navision service
 * operations:
 *   -  httpMethod: POST
 *      consumes:
 *        - application/json 
 */
router.post('/saveFromCRM', function(req, res) {
    var crmData = require('fs').readFileSync(require('path').join(__dirname, '../data/crm/new.json')).toString();
    if (typeof crmData === 'string') {
        try {
            crmData = JSON.parse(crmData);
        } catch (e) {
            return res.status(400).json({ error: { message: 'error occured while parsing crm response data' } })
        }
    }

    projectService.importProjectFromCRM(crmData, function() {
        res.json({ 'success': true })
    }, function(errors) {
        res.status(400).json({ success: false, message: 'malfunctioned data provided', errors: errors })
    })
});



/**
 * @custom api
 * path: /project/updateFromCRM
 * description: api for updating existing database records with navision data
 * operations:
 *   -  httpMethod: POST
 *      consumes:
 *        - application/json 
 */

router.post('/updateFromCRM', function(req, res) {
    var crmData = require('fs').readFileSync(require('path').join(__dirname, '../data/crm/update.json')).toString();
    if (typeof crmData === 'string') {
        try {
            crmData = JSON.parse(crmData);
        } catch (e) {
            return res.status(400).json({ error: { message: 'error occured while parsing crm response data' } })
        }
    }
    projectService.updateProjectFromCRM(crmData, function() {
        res.json({ 'success': true })
    }, function(errors) {
        res.status(400).json({ success: false, message: 'malfunctioned data provided', errors: errors })
    })
});
/* 
 * path: /project/get/<project_id>
 */
router.get('/get/:projectId', managerTokenValidation, function(req, res) {
    projectService.getProject(req.params.projectId,
        function(data) {
            res.status(200).jsonp(data);
        },
        function(result) {
            globalMethods.error(res, result, 500);
        });
});

/**
 * @swagger
 * path: /project/getAll
 * operations:
 *   -  httpMethod: POST
 *      summary: Devuelve todos los proyecto paginados
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para la obtención de todos los proyectos paginados
 *          paramType: body
 *          dataType: PaginationDto
 */
router.post('/getAll', managerTokenValidation, function(req, res) {
    projectService.searchProject(req.body,
        function(data) {
            res.status(200).jsonp(data);
        },
        function(result) {
            globalMethods.error(res, result, 500);
        });
});

/**
 * @swagger
 * path: /project/search
 * operations:
 *   -  httpMethod: POST
 *      summary: Busca y Devuelve los proyectos paginados
 *      notes: Requiere token de autenticación manager (x-auth-token).
 *      nickname: profile
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para buscar proyectos
 *          paramType: body
 *          dataType: SearchProjectScheme
 */
router.post('/search', managerTokenValidation, function(req, res) {
    projectService.searchProject(req.body,
        function(data) {
            res.status(200).jsonp(data);
        },
        function(result) {
            globalMethods.error(res, result, 500);
        });
});

/* GET /projectService/getProjectsUnderManager manager employee porjects */
router.get('/getProjectsUnderManager', function(req, res) {
    if (!req.query.managerId) return res.status(400).json({ success: false, message: 'managerId is required' });
    projectService.getUnderManager(req.query.managerId,
        function(data) {
            res.status(200).jsonp(data);
        },
        function(result) {
            globalMethods.error(res, result, 500);
        });
});

/**
 * @swagger
 * path: /project/save
 * operations:
 *   -  httpMethod: POST
 *      summary: Actualiza el proyecto y sino existe lo crea
 *      notes: Requiere token de autenticación backoffice (x-auth-token).
 *      nickname: save
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para salvar el proyecto
 *          paramType: body
 *          dataType: ProjectScheme
 */
router.post('/save', backofficeTokenValidation, function(req, res) {
    projectService.saveProject(req.body,
        function(data) {
            res.status(200).jsonp(data);
        },
        function(result) {
            globalMethods.error(res, result, 500);
        });
});


/**
 * @swagger
 * path: /project/delete
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina el proyecto
 *      notes: Requiere token de autenticación backoffice (x-auth-token).
 *      nickname: delete
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para eliminar el proyecto
 *          paramType: body
 *          dataType: ProjectRefAndIDScheme
 */
router.delete('/delete', backofficeTokenValidation, function(req, res) {
    req.checkBody('projectRef', 'required').notEmpty();
    req.checkBody('_id', 'required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
        res.json({ success: false, errors: errors });
    } else {
        projectService.deleteProject(req.body,
            function(data) {
                res.status(200).jsonp(data);
            },
            function(result) {
                globalMethods.error(res, result, 500);
            });
    }
});

/**
 * @swagger
 * path: /project/import
 * operations:
 *   -  httpMethod: POST
 *      summary: Importa el proyecto-usuario, si existe lo modifica y sino, lo crea
 *      notes: Requiere token de autenticación backoffice (x-auth-token).
 *      nickname: save
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para importar el proyecto-user
 *          paramType: body
 *          dataType: ProjectUserScheme
 */
router.post('/import', backofficeTokenValidation, function(req, res) {
    req.checkBody('projectRef', 'required').notEmpty();
    req.checkBody('projectName', 'required').notEmpty();
    req.checkBody('customerRef', 'required').notEmpty();
    req.checkBody('customerName', 'required').notEmpty();
    req.checkBody('initDate', 'required').notEmpty();
    req.checkBody('assigmentInitDate', 'required').notEmpty();
    req.checkBody('emailUser', 'required').notEmpty();
    req.checkBody('emailSupervisor', 'required').notEmpty();
    req.checkBody('emailSupervisorDelivery', 'required').notEmpty();
    req.checkBody('subfamilies', 'required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({ success: false, errors: errors });
    } else {
        projectService.importProjectUser(req.body,
            function(data) {
                res.status(200).jsonp(data);
            },
            function(result) {
                globalMethods.error(res, result, 500);
            });
    }
});


/**
 * @swagger
 * path: /project/deleteImported
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Elimina el proyecto importado
 *      notes: Requiere token de autenticación backoffice (x-auth-token).
 *      nickname: delete
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: data
 *          description: DTO para eliminar el proyecto importado
 *          paramType: body
 *          dataType: DeleteProjectRefAndIDScheme
 */
router.delete('/deleteImported', backofficeTokenValidation, function(req, res) {
    req.checkBody('projectRef', 'required').notEmpty();
    req.checkBody('emailUser', 'required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.json({ success: false, errors: errors });
    } else {
        projectService.deleteImportedProjectUser(req.body,
            function(data) {
                res.status(200).jsonp(data);
            },
            function(result) {
                globalMethods.error(res, result, 500);
            });
    }
});

/**
 * @swagger
 * models:
 *   ProjectRefAndIDScheme:
 *     properties:
 *       projectRef:
 *         type: String
 *         required: true
 *       _id:
 *         type: String
 *         required: true
 *   ProjectScheme:
 *     properties:
 *       _id:
 *         type: String
 *       projectRef:
 *         type: String
 *       projectName:
 *         type: String
 *       customerRef:
 *         type: String
 *       customerName:
 *         type: String
 *       initDate:
 *         type: Date
 *       endDate:
 *         type: Date
 *       emailSupervisor:
 *         type: String
 *       emailSupervisorDelivery:
 *         type: String
 *       status:
 *         type: String
 *       enabled:
 *         type: String
 *   SearchProjectScheme:
 *     properties:
 *       _id:
 *         type: String
 *       projectRef:
 *         type: String
 *       projectName:
 *         type: String
 *       customerRef:
 *         type: String
 *       customerName:
 *         type: String
 *       initDate:
 *         type: Date
 *       endDate:
 *         type: Date
 *       emailSupervisor:
 *         type: String
 *       emailSupervisorDelivery:
 *         type: String
 *       enabled:
 *         type: String
 *       page:
 *         type: Number
 *       rows:
 *         type: Number
 *   PaginationDto:
 *     properties:
 *       page:
 *         type: Number
 *       rows:
 *         type: Number
 *   ProjectUserScheme:
 *     properties:
 *       projectRef:
 *         type: String
 *         required: true
 *       projectName:
 *         type: String
 *         required: true
 *       customerRef:
 *         type: String
 *         required: true
 *       customerName:
 *         type: String
 *         required: true
 *       initDate:
 *         type: Date
 *         required: true
 *       endDate:
 *         type: Date
 *       assigmentInitDate:
 *         type: Date
 *         required: true
 *       assigmentEndDate:
 *         type: Date
 *       emailUser:
 *         type: String
 *         required: true
 *       emailSupervisor:
 *         type: String
 *         required: true
 *       emailSupervisorDelivery:
 *         type: String
 *         required: true
 *       subfamilies:
 *         type: Array
 *         required: true
 *       status:
 *         type: String
 *       enabled:
 *         type: String
 *   DeleteProjectRefAndIDScheme:
 *     properties:
 *       projectRef:
 *         type: String
 *         required: true
 *       emailUser:
 *         type: String
 *         required: true
 */

module.exports = router;
