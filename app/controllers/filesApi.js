// /**
//  * @swagger
//  * resourcePath: /files
//  * description: Servicio de ficheros
//  */
// var express = require('express');
// var fileServices = require('../services/fileServices');
// var router = express.Router();
// var path = require('path');
// var fs = require('fs');

// /**
//  * @swagger
//  * path: /files/upload
//  * operations:
//  *   -  httpMethod: POST
//  *      summary: Guarda un fichero
//  *      notes: Se devuelve {id:docId} donde docId es el identificador del fichero guardado.
//  *      nickname: Upload
//  *      consumes:
//  *        - multipart/form-data
//  *      parameters:
//  *        - name: file
//  *          description: Imagen a subir
//  *          paramType: body
//  *          dataType: file
//  *          allowMultiple: true
//  *
//  */
// router.all('/upload', function (req, res) {

//     fileServices.uploadFile(req.files.file, 'file', true,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             res.status(500).jsonp(result);
//         });

// });


// /**
//  * @swagger
//  * path: /files/view/{id}
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Descarga un fichero almacenado
//  *      nickname: View
//  *      consumes:
//  *        - text/html
//  *      parameters:
//  *        - name: id
//  *          description: Id del fichero
//  *          paramType: path
//  *          required: true
//  *          dataType: string
//  */
// router.get('/view/:id', function (req, res) {
//     fileServices.downloadFile(req.params.id, res);
// });


// /**
//  * @swagger
//  * path: /files/remove/{id}
//  * operations:
//  *   -  httpMethod: GET
//  *      summary: Descarga un fichero almacenado en la bbdd
//  *      nickname: View
//  *      consumes:
//  *        - text/html
//  *      parameters:
//  *        - name: id
//  *          description: Id del fichero
//  *          paramType: path
//  *          required: true
//  *          dataType: string
//  */
// router.get('/remove/:id', backofficeTokenValidation, function (req, res) {
//     fileServices.removeFile(req.params.id,
//         function (data) {
//             res.status(200).jsonp(data);
//         }, function (result) {
//             res.status(500).jsonp(result);
//         });
// });


// /* GET /timesheet/exportUserTimesheets export users timesheets. */
// router.get('/downloadExportedTimesheetReport', function(req, res, next) {
//     if (!req.query.exportId) return res.send('exported file id is required');
//     var filepath = path.join(__dirname, '../tmp/', req.query.exportId); 
//     fs.stat(filepath, err => {
//         if (err) return res.send('invalid export id specified');
//         // download excel report
//         res.setHeader("content-disposition", "attachment;filename=TimesheetReport.xlsx");
//         res.setHeader("content-type", "application/vnd.ms-excel");
//         fs.createReadStream(filepath).pipe(res);
//     });
// });

// module.exports = router;
