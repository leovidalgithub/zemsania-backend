/**
 * @swagger
 * resourcePath: /config
 * description: Configuraciones de la app
 */
var express = require('express');
var router = express.Router();

/**
 * @swagger
 * path: /config/
 * operations:
 *   -  httpMethod: GET
 *      summary: Devuelve configuración de la app para el usuario
 *      notes: Requiere token de autenticación (x-auth-token).
 *      nickname: categories
 *      consumes: 
 *        - application/json
 *        
 */
 router.get('/', function(req, res) {
 	var data = {
 		success:true	
 	}; 	
	res.status( 200 ).jsonp( data );
});


module.exports = router;
