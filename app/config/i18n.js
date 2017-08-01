
var i18n = {
	es: {
		subjects : {
			welcome: 'Bienvenido',
			test: 'TEST',
			textHoursSent : 'Usuario %s %s ha enviado sus horas desde %s - %s',
			textHoursValidated : 'Usuario %s %s ha validado sus horas desde %s - %s'
		},
		resetPassword : {
			rememberPassword : 'Generar nueva contraseña',
			newPassword      : 'Envío nueva contraseña',
			passwordSend     : '<h4>Se acaba de enviar un correo con la nueva contraseña!<br>Si no ve el correo, recuerde revisar en la carpeta SPAM</h4>',
			generalError     : '<h4>No pudo completarse la operación!<br><br>Por favor, inténtalo de nuevo.</h4>',
			unvalidToken     : '<h4>Ocurrió un problema verificando la información de reinicio de contraseña.<br>Es posible que el identificador único haya expirado o ya haya sido utilizado.<br><br>Por favor, inténtalo de nuevo.</h4>'
		},
		errors: {
			holidaysAlreadyRequested : 'Día ya solicitado',
			exceededHolidays : 'Excedido el número máximo de días disponibles',
			unallocated_project_user : "Proyecto Usuario sin asignar"
		}
	}
};

module.exports = i18n;
