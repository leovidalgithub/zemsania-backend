var express = require('express');

var ids = {

    // database: 'mongodb://192.168.16.40:27017/zemtime', // PRODUCTION
    database: 'mongodb://192.168.16.40:27017/zemtimedev', // DEV

    itrhUrl: 'http://192.168.0.131:8080',
    //database: 'mongodb://dev-db.zemsania.com:27017/zemtime',
    //database: 'mongodb://localhost:27017/zemtime',
    //user: zemtime
    //password: 58yd4rtf68g7y
    secret: 'stxdryjhni46gy8ouht789g',
    zimbraUrl: 'http://smtp.zemsania.com',
    swaggerBasePath: 'http://maqueta.zemsania.com:3000',
    logLevel: 'error',

    email: {
        host: 'smtp.zemsania.com',
        port: 25,
        user: 'gitlab@zemsania.com',
        pass: 'K1Y32Q8bKMbaG6q'
    },
    activeDriectory: {
        url: 'ldap://192.168.2.200',
        port: '389',
        //    baseDN: 'CN=Users,DC=zemsania,DC=com',
        baseDN: 'CN=Administrador,CN=Users,DC=zemsania,DC=com',
        username: 'Administrador@zemsania.com',
        password: 'W1nt3r1sc0m1ng!'
    }
}


module.exports = ids
