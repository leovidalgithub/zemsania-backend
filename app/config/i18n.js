// var express = require('express');

var i18n = {
	es: {
		subjects : {
			welcome: 'Bienvenido',
			rememberPassword: 'Recuerdo de contraseña',
			test: 'TEST',
			textHoursSent : 'Usuario %s %s ha enviado sus horas desde %s - %s',
			textHoursValidated : 'Usuario %s %s ha validado sus horas desde %s - %s'
		},
		errors: {
			holidaysAlreadyRequested : 'Día ya solicitado',
			exceededHolidays : 'Excedido el número máximo de días disponibles',
			unallocated_project_user : "Proyecto Usuario sin asignar"
		}
	}
}



module.exports = i18n
