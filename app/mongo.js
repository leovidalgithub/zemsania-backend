var express   = require( 'express' ),
    router    = express.Router(),
    mongoose  = require( 'mongoose' ),
    ObjectId  = require( 'mongoose' ).Types.ObjectId;

var request = require('request');
var fs = require("fs");

router.get( '/fill', function ( req, res ) {
console.log('\033c');
// var newId = ObjectId();
// console.log(newId);
// res.end();

//**************************************************************************************************************
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// var url = 'https://itrh-stg.zemsania.com:8443/ZemsaniaITRH/wszt/getTokenParam';
// request.get(
//     url,
//     function ( error, response, body ) {
//         res.send(body);
//         // if ( !error && response.statusCode == 200 ) { res.json( body ) }
//     }
// )
// .pipe( fs.createWriteStream( 'myData' ) );

// console.time('start');
// var myJSON = { json : { "username":"zemtime","secret":"$Zemtime$" } };
// var url = 'https://itrh-stg.zemsania.com:8443/ZemsaniaITRH/wszt/getToken';
// request.post(
//     url, myJSON,
//     function ( error, response, body ) {
//         if( error ) console.log( error );
//         if ( !error && response.statusCode == 200 ) {
//             // res.json( body );
//             var token = body;
//             // getProjects( token );
//             // getGestoresPersonales( token );
//             // getGestoresComerciales( token );
//             // getUsers( token );
//         }
//     }
// );

function getProjects( token ) {
    var url = 'https://itrh-stg.zemsania.com:8443/ZemsaniaITRH/wszt/proyectos/' + token;
    request.get( url,
        function ( error, response, body ) {
            var projects = JSON.parse( body );
            res.json( projects );
            // ************************ INSERT NEW PROJECT ************************
            projects.proyectoList.forEach( function( project ) {
                var newProject = new models.Project ({
                                    idOrigen   : project.idOrigen,
                                    origenTipo : project.origenTipo,
                                    code: project.codigo,
                                    name: project.descripcion,
                                    description: project.descripcion,
                                    alias: project.codigo,
                                    initDate: new Date( project.fechaInicio ),
                                    lastModifiedDate: new Date( project.fechaUltimoCambio )
                });
                // newProject.save( function( err, savedProject ) {
                //     if ( err ) {
                //         console.log( 'ERROR' );
                //         console.log( err ); 
                //     } else {
                //         console.log( 'Great!');                       
                //     }
                // });
            });
            console.timeEnd('start');
        }
    );
}

 // lastLoginDate :   { type : Date, default : Date.now },
function getUsers( token ) {
    var url = 'https://itrh-stg.zemsania.com:8443/ZemsaniaITRH/wszt/empleados/' + token + '/6/2';
    request.get( url,
        function ( error, response, body ) {
            var users = JSON.parse( body );
            res.json( users );
            // ************************ INSERT NEW USER ************************
            users.empleadoList.forEach( function( user, index ) {

                if ( !user.candidatoEmailInterno) {
                    var aa = ( user.candidatoNombre + ' ' + user.candidatoApellidos ).split(' ');
                    if ( !aa[2] ) { aa.push( 'Pedroza' + index ) };
                    user.candidatoEmailInterno = 'test' + aa[0].substr(0, 1) + aa[1].substr(0, 1) + aa[2].substr(0) + '@zemsania.com' ;
                    user.candidatoEmailInterno = user.candidatoEmailInterno.toLowerCase();
                    user.candidatoEmailInterno = user.candidatoEmailInterno.normalize( 'NFD' ).replace(/[\u0300-\u036f]/g, "");
                }

                // models.User.findOne( { cp : user.empleadoContratoCp } ).exec( function( err, doc ) {
                //         if( !doc ) {
                            var superiorEmail = user.empleadoContratoGestorPersonalEmail;
                            if ( superiorEmail ) {
                                models.User.findOne( { username : superiorEmail } )
                                    .exec( function( err, userDoc ) {
                                        if( userDoc ) {
                                            lorenzo( userDoc._id, user );
                                        } else {
                                            lorenzo( null, user );
                                        }
                                    });
                            }

                            function lorenzo( superiorId, user ) {
                                var newUser = new models.User ({
                                                candidatoId : user.candidatoId,
                                                cp : user.empleadoContratoCp,
                                                username : user.candidatoEmailInterno,
                                                password : 'sha1$a735bef9$1$7792945a539a78e254d05e5e6919112346cf99e1',
                                                name : user.candidatoNombre,
                                                surname : user.candidatoApellidos,
                                                nif : user.candidatoIdentificacion,
                                                birthdate : user.candidatoNacimiento,
                                                sex : user.candidatoSexo ? ( user.candidatoSexo === '1' ? 'male' : 'female') : 'male',
                                                phone : user.candidatoTelefono1 + ' / ' + user.candidatoTelefono2,
                                                calendarID : new ObjectId( '58e3a7feca9d9b15f037fae6' ),
                                                superior : superiorId ? new ObjectId( superiorId ) : null
                                });

                                if( user.empleadoContratoCp != 'E1674' ) {                                
                                    newUser.save( function( err, savedUser ) {
                                        if ( err ) {
                                            console.log( 'ERROR' );
                                            console.log( err ); 
                                        } else {
                                            console.log( 'Great!');                       
                                        }
                                    });
                                }
                            }

                    //     }
                    // });




            });
            console.timeEnd('start');
        }
    );
}

function getGestoresPersonales( token ) {
    var url = 'https://itrh-stg.zemsania.com:8443/ZemsaniaITRH/wszt/gestoresPersonalesProyectos/' + token;
    request.get( url,
        function ( error, response, body ) {
            var users = JSON.parse( body );
            users.empleadoList.forEach( function( user, index ) {

                models.User.findOne( { cp : user.empleadoContratoCp  } )
                    .exec( function( err, doc ) {
                        if( !doc ) {
                            var newUser = new models.User ({
                                            candidatoId : user.candidatoId,
                                            cp : user.empleadoContratoCp,
                                            username : user.candidatoEmailInterno,
                                            password : 'sha1$a735bef9$1$7792945a539a78e254d05e5e6919112346cf99e1',
                                            name : user.candidatoNombre,
                                            surname : user.candidatoApellidos,
                                            nif : user.candidatoIdentificacion,
                                            birthdate : user.candidatoNacimiento,
                                            sex : user.candidatoSexo ? ( user.candidatoSexo === '1' ? 'male' : 'female') : 'male',
                                            phone : user.candidatoTelefono1 + ' / ' + user.candidatoTelefono2,
                                            calendarID : '58e3a7feca9d9b15f037fae6',
                                            roles : ['ROLE_USER', 'ROLE_MANAGER']
                            });
                            newUser.save( function( err, savedUser ) {
                                if ( err ) {
                                    console.log( 'ERROR' );
                                    console.log( err ); 
                                } else {
                                    // console.log( 'Great!');                       
                                }
                            });
                        } 
                    })

            });
            console.timeEnd('start');
        }
    );
}

function getGestoresComerciales( token ) {
    var url = 'https://itrh-stg.zemsania.com:8443/ZemsaniaITRH/wszt/gestoresComercialesProyectos/' + token;
    request.get( url,
        function ( error, response, body ) {
            var users = JSON.parse( body );
            res.json(users);
            users.empleadoList.forEach( function( user, index ) {
                models.User.findOne( { cp : user.empleadoContratoCp  } )
                    .exec( function( err, doc ) {
                        if( !doc ) {
                            var newUser = new models.User ({
                                            candidatoId : user.candidatoId,
                                            cp : user.empleadoContratoCp,
                                            username : user.candidatoEmailInterno,
                                            password : 'sha1$a735bef9$1$7792945a539a78e254d05e5e6919112346cf99e1',
                                            name : user.candidatoNombre,
                                            surname : user.candidatoApellidos,
                                            nif : user.candidatoIdentificacion,
                                            birthdate : user.candidatoNacimiento,
                                            sex : user.candidatoSexo ? ( user.candidatoSexo === '1' ? 'male' : 'female') : 'male',
                                            phone : user.candidatoTelefono1 + ' / ' + user.candidatoTelefono2,
                                            calendarID : '58e3a7feca9d9b15f037fae6',
                                            roles : ['ROLE_USER', 'ROLE_DELIVERY']
                            });
                            newUser.save( function( err, savedUser ) {
                                if ( err ) {
                                    console.log( 'ERROR getGestoresComerciales' );
                                }
                            });
                        } else { // if user already exist, we just add 'ROLE_DELIVERY' to 'roles'
                            doc.roles.push( 'ROLE_DELIVERY' );
                            doc.save( function( err, savedUser ) {
                                if ( err ) {
                                    console.log( 'ERROR getGestoresComerciales' );
                                }
                            });
                        } 
                    })
            });
            console.timeEnd('start');
        }
    );
}

// console.log('/*/*/*/*/');
//     models.User.find( {}, function( err, docs ) {
//         console.log(docs._id);
//     });

//     res.end();


    // models.ProjectUsers.find( {}, function( err, docs ) {
        // docs.forEach( function( el ) {
    //         models.ProjectUsers.find( { userId : new ObjectId( el.userId ) }, function( err, users ) {
    //             if( users.length > 1 ) {
    //             // console.log(users[0].projectId + ' ' + users[1].projectId);                    
    //                 if ( users[0].projectId.equals(users[1].projectId) ) {
    //                     // console.log( users );
    //                     // users[1].remove();
    //                 }
    //                 console.log(users.length + ' ' + el.projectId + ' ' + el.userId);
    //             }
    //         });
    //     });
    // });
    // res.end();

//**************************************************************************************************************
// models.Project.find({}, function( err, projects ) {
//     projects.forEach( function( project, index ) {
//         project.name = project.name.substr(0,50);
//         project.save();
//     });
// })
// res.end();
//**************************************************************************************************************
var obj = [
            {project_code: '15MS0643IECEC6', user_cp: 'E1613'},
            {project_code: '15MS0643IECEC6', user_cp: 'E1612'},
            {project_code: '15MS0160EMTSAU', user_cp: 'E1612'},
            {project_code: '15MS0160EMTSAU', user_cp: 'E1670'},
            {project_code: '15MS0160EMTSAU', user_cp: 'E1674'},
            {project_code: '15MS0160EMTSAU', user_cp: 'E1666'},
            {project_code: '15MS0160EMTSAU', user_cp: 'E1688'},
            {project_code: '15MS0160EMTSAU', user_cp: 'E1665'},
            {project_code: '15MS0642IECAC6', user_cp: 'E1671'},
            {project_code: '15MS0642IECAC6', user_cp: 'E1608'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1619'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1408'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1415'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1443'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1471'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1472'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1527'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1532'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1551'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1565'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1574'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1802'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1805'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1810'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1815'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1818'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1759'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1654'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1699'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1644'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1701'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1645'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1676'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1675'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1664'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1655'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1684'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1648'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1658'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1646'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1649'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1668'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1698'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1680'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1673'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1758'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1746'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1647'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1672'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1667'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1702'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1685'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1689'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1707'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1677'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1703'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1760'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1739'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1851'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1869'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1879'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1882'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1883'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1893'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1911'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1910'},
            {project_code: '15MS0147INDSAU', user_cp: 'E1958'}
        ];

//         obj.forEach( function( el ) {
//                 models.User.findOne( { cp : el.user_cp  }, function( err, user ) {
//                     models.Project.findOne( { code : el.project_code  }, function( err, project ) {
//                         // console.log(user._id +  ' - ' + project._id);
//                         var pru = new models.ProjectUsers ({
//                             projectId: project._id,
//                             userId: user._id, 
//                             maxHours: '8'
//                         });
//                         pru.save( function(err,data) {
//                             if ( err ) console.log( err );
//                             console.log('saved!');
//                             // res.send(data);
//                         });
//                     })
//                 })
//         });

// res.end();
//**************************************************************************************************************


// res.end();

    // models.Timesheet.findOne( { _id: new ObjectId( '58e7630deacc350744f34e6a' ) }, function( err, doc ) {
    //         var date = new Date ( doc.date );
    //         console.log( date.getDate());
    //         console.log( date.getMonth());
    //         models.Timesheet.findOne( { date: date, userId: '58a446acdb8d2617dc208d8a' }, function( err,     doc ) {
    //             res.send( doc );   
    //         });
    // });
    // **************************************** INSERT NEW NOTIFICATION ***********************************
    // var nt = new models.Notification ({
    //     senderId: '58a446acdb8d2617dc208d8a', // 
    //     receiverId: '588896327f2dca0f940fd99c', //
    //     type: constants.notification_type_holiday_req,
    //     text: 'Solicitud aprobación de vacaciones',
    // });
    // nt.save( function(err,data) {
    //     if ( err ) console.log( err );
    //     console.log('saved!');
    //     res.send(data);
    // });
// ***************************************** INSERT NEW TIMESHEET ****************************************
    // var ts = new models.Timesheet ({
    //     userId          : '58a446acdb8d2617dc208d8a',
    //     projectId       : '58e760a5ccac571698ef1895',
    //     type            : 'Guardias',
    //     subType         : 'Turnicidad',
    //     status          : 'draft',
    //     date            : new Date( '04/09/2017' ),
    //     value           : 1
    // });
    // ts.save( function(err,data) {
    //     if ( err ) console.log( err );
    //     console.log('saved!');
    //     res.send(data);        
    // });
// ***************************************** INSERT NEW PROJECT *****************************************
    // var pr = new models.Project ({
    //     crm_id: '7811',
    //     code: 'Code_11001',
    //     name: 'TEI OASYS TRANSPORT',
    //     alias: 'TEI Oasys alias',
    //     description: 'Proyecto TEI T.E.i.'
    // });
    // pr.save( function(err,data) {
    //     if ( err ) console.log( err );
    //     console.log('saved!');
    //     res.send(data);
    // });
// ************************************** INSERT NEW PROJECT-USER ***************************************
    // var pru = new models.ProjectUsers ({
    //     projectId: '59147b6efa92a507d4d99c07',
    //     userId: '588896327f2dca0f940fd99c', 
    //     maxHours: '8'
    // });
    // pru.save( function(err,data) {
    //     if ( err ) console.log( err );
    //     console.log('saved!');
    //     res.send(data);
    // });
    // 588896327f2dca0f940fd99c Lorenzo
    // 591ad0ad3fb10c0d00e31e06 Cedric
    // 591c13784010630d7676ec33 carolina
    // 591c4a17e3a0211105594954 víctor
    // 5915b4255fb4c81bf03372d8 guillem
    // 59147b6efa92a507d4d99c07 projectId
// ************************************************** **************************************************
// var date  = new Date();
// var year  = date.getFullYear();
// var month = date.getMonth();
// var firstMonthDay = new Date( year, month, 1 );
// var lastMonthDay  = new Date( year, month + 1, 0);
// console.log(firstMonthDay.getDate() + ' ' + firstMonthDay.getMonth());
// console.log(lastMonthDay.getDate() + ' ' + lastMonthDay.getMonth());

//     models.Timesheet.find( {
//                                 $and: [
//                                   { "userId" : '58a446acdb8d2617dc208d8a' },
//                                   { "project" : '582c4106c405b99578f0b7e2' },
//                                   { "date": { "$gte": new Date( firstMonthDay ), "$lte": new Date( lastMonthDay ) } }
//                               ]
//     }, function( err, docs ) {
//         res.json( docs );
//         console.log('**********');
//         docs.forEach( function( ee ) {
//             console.log( ee.date.getMonth() + ' ' + ee.date.getDate() );

//         });
//     });

// ***************************************** REMOVE ALL DOCUMENTS ****************************************
    // models.ProjectUsers.remove({}, function(err,doc){
    //     console.log(err);
    //     console.log(doc);
    // });
    // res.end();
// ************************************************** **************************************************
// ****************************************
    // models.Calendar.findOne( { _id: new ObjectId( '58d0f27265444210e8bd8a84' ) }, function( err, doc ){
    //     var moment = require( 'moment' );
    //     var fomatted_date = moment( doc.updatedAt ).format('DD MMMM YYYY');
    //         res.send( fomatted_date );
    // });
// ****************************************

    // models.Test.aggregate( [
    //         { $match : { _id: new ObjectId( '58dd07bedef27e159008bbd0' ) } },
    //         { $project : { year  : { $year  : '$date' },
    //                        month : { $month : '$date' },
    //                        hour  : { $hour  : '$date' },
    //                        name : 1, date : 1
    //         } }
    //     ], function( err, docs ) {
    //         res.send( docs );
    // });

    // var calendar = new models.Calendar ({
    //     isLocal      : true,
    //     name         : 'XXX Calendario BCN XXX',
    //     description  : '',
    //     years : [
    //     {
    //         year : 2017,
    //         groupDays : [
    //                             {
    //             type    : 'working',
    //             days    : { days  : [  ],
    //                         hours : [ 
    //                                     {   
    //                                         initialHour : '0800',
    //                                         endHour     : '1230'
    //                                     },
    //                                     { 
    //                                         initialHour : '0230',
    //                                         endHour     : '1800'
    //                                     }
    //                                 ]                                            
    //                       }
    //                 },
    //                 {
    //                             type    : 'holidays',
    //                             days    : { days  : [  ],
    //                                       }
    //                 },
    //                                                     {
    //                             type    : 'intensive',
    //                             days    : { days  : [ ],
    //                                         hours : [ 
    //                                                     {   
    //                                                         initialHour : '0800',
    //                                                         endHour     : '1730'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'friday',
    //                             days    : { days  : [ ],
    //                                         hours : [ 
    //                                                     {
    //                                                         initialHour : '0830',
    //                                                         endHour     : '1130'
    //                                                     },
    //                                                     {
    //                                                         initialHour : '1400',
    //                                                         endHour     : '1830'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'special',
    //                             days    : { days  : [ ],
    //                                         hours : [ 
    //                                                     {
    //                                                         initialHour : '0700',
    //                                                         endHour     : '1445'
    //                                                     }
    //                                                 ]                                            
    //                                       }
    //                                 },
    //                                 {
    //                             type    : 'non_working',
    //                             days    : { days  : [ ],
    //                                       }
    //                                 }
    //         ] // groupDays
    //     }
    //     ], // years
    //     enabled       : true
    // });
    // calendar.save();
    // res.send('GET /mongo here');

    // mongoose     = require( 'mongoose' );
    // ObjectId     = require( 'mongoose' ).Types.ObjectId;
    // models.Calendar.findOne( { _id: new ObjectId( '58e3a7feca9d9b15f037fae6' ) }, function(err,calendar){
    //     res.end();
    // });

//     mongoose     = require( 'mongoose' );
//     ObjectId     = require( 'mongoose' ).Types.ObjectId;
//     models.Calendar.findOne( { _id: new ObjectId( '58e3a7feca9d9b15f037fae6' ) }, function( err, doc ) {
//         doc.years.forEach( function( year ) {
//             if( year.year == 2017 ) {
//                 year.groupDays.forEach( function( element ) {
//                     if ( element.type == 'holidays' ) {
//                         element.days.days.push( new Date( '01/01/2017' ) );
//                         element.days.days.push( new Date( '01/06/2017' ) );
//                         element.days.days.push( new Date( '04/03/2017' ) );
//                         element.days.days.push( new Date( '04/06/2017' ) );
//                         element.days.days.push( new Date( '05/01/2017' ) );
//                         element.days.days.push( new Date( '06/01/2017' ) );
//                         element.days.days.push( new Date( '06/24/2017' ) );
//                         element.days.days.push( new Date( '08/25/2017' ) );
//                         element.days.days.push( new Date( '08/26/2017' ) );
//                         element.days.days.push( new Date( '08/27/2017' ) );
//                         element.days.days.push( new Date( '08/28/2017' ) );
//                         element.days.days.push( new Date( '09/25/2017' ) );
//                         element.days.days.push( new Date( '11/01/2017' ) );
//                         element.days.days.push( new Date( '11/02/2017' ) );
//                         element.days.days.push( new Date( '12/09/2017' ) );
//                         element.days.days.push( new Date( '12/25/2017' ) );
//                     }
//                     if ( element.type == 'special' ) {
//                         element.days.days.push( new Date( '01/05/2017' ) );
//                         element.days.days.push( new Date( '04/02/2017' ) );
//                         element.days.days.push( new Date( '05/31/2017' ) );
//                         element.days.days.push( new Date( '06/23/2017' ) );
//                         element.days.days.push( new Date( '08/24/2017' ) );
//                         element.days.days.push( new Date( '09/24/2017' ) );
//                         element.days.days.push( new Date( '12/08/2017' ) );
//                         element.days.days.push( new Date( '12/24/2017' ) );
//                     }
//                     if ( element.type == 'friday' ) {
//                         element.days.days.push( new Date( '01/13/2017' ) );
//                         element.days.days.push( new Date( '01/20/2017' ) );
//                         element.days.days.push( new Date( '01/27/2017' ) );
//                         element.days.days.push( new Date( '02/03/2017' ) );
//                         element.days.days.push( new Date( '02/10/2017' ) );
//                         element.days.days.push( new Date( '02/17/2017' ) );
//                         element.days.days.push( new Date( '02/24/2017' ) );

//                         element.days.days.push( new Date( '03/03/2017' ) );
//                         element.days.days.push( new Date( '03/10/2017' ) );
//                         element.days.days.push( new Date( '03/17/2017' ) );
//                         element.days.days.push( new Date( '03/24/2017' ) );
//                         element.days.days.push( new Date( '03/31/2017' ) );

//                         element.days.days.push( new Date( '04/07/2017' ) );
//                         element.days.days.push( new Date( '04/14/2017' ) );
//                         element.days.days.push( new Date( '04/21/2017' ) );
//                         element.days.days.push( new Date( '04/28/2017' ) );

//                         element.days.days.push( new Date( '05/05/2017' ) );
//                         element.days.days.push( new Date( '05/12/2017' ) );
//                         element.days.days.push( new Date( '05/19/2017' ) );
//                         element.days.days.push( new Date( '05/26/2017' ) );

//                         element.days.days.push( new Date( '06/02/2017' ) );
//                         element.days.days.push( new Date( '06/09/2017' ) );
//                         element.days.days.push( new Date( '06/16/2017' ) );
//                         element.days.days.push( new Date( '06/23/2017' ) );
//                         element.days.days.push( new Date( '06/30/2017' ) );

//                         element.days.days.push( new Date( '07/07/2017' ) );
//                         element.days.days.push( new Date( '07/14/2017' ) );
//                         element.days.days.push( new Date( '07/21/2017' ) );
//                         element.days.days.push( new Date( '07/28/2017' ) );

//                         element.days.days.push( new Date( '08/04/2017' ) );
//                         element.days.days.push( new Date( '08/11/2017' ) );
//                         element.days.days.push( new Date( '08/18/2017' ) );
//                         element.days.days.push( new Date( '08/25/2017' ) );

//                         element.days.days.push( new Date( '09/01/2017' ) );
//                         element.days.days.push( new Date( '09/08/2017' ) );
//                         element.days.days.push( new Date( '09/15/2017' ) );
//                         element.days.days.push( new Date( '09/22/2017' ) );
//                         element.days.days.push( new Date( '09/29/2017' ) );

//                         element.days.days.push( new Date( '10/06/2017' ) );
//                         element.days.days.push( new Date( '10/13/2017' ) );
//                         element.days.days.push( new Date( '10/20/2017' ) );
//                         element.days.days.push( new Date( '10/27/2017' ) );

//                         element.days.days.push( new Date( '11/03/2017' ) );
//                         element.days.days.push( new Date( '11/10/2017' ) );
//                         element.days.days.push( new Date( '11/17/2017' ) );
//                         element.days.days.push( new Date( '11/24/2017' ) );

//                         element.days.days.push( new Date( '12/01/2017' ) );
//                         element.days.days.push( new Date( '12/08/2017' ) );
//                         element.days.days.push( new Date( '12/15/2017' ) );
//                         element.days.days.push( new Date( '12/22/2017' ) );
//                         element.days.days.push( new Date( '12/29/2017' ) );
//                     }
//                     if ( element.type == 'intensive' ) {
//                         element.days.days.push( new Date( '08/01/2017' ) );
//                         element.days.days.push( new Date( '08/02/2017' ) );
//                         element.days.days.push( new Date( '08/03/2017' ) );
//                         element.days.days.push( new Date( '08/07/2017' ) );
//                         element.days.days.push( new Date( '08/08/2017' ) );
//                         element.days.days.push( new Date( '08/09/2017' ) );
//                         element.days.days.push( new Date( '08/10/2017' ) );
//                         element.days.days.push( new Date( '08/14/2017' ) );
//                         element.days.days.push( new Date( '08/15/2017' ) );
//                         element.days.days.push( new Date( '08/16/2017' ) );
//                         element.days.days.push( new Date( '08/17/2017' ) );
//                         element.days.days.push( new Date( '08/21/2017' ) );
//                         element.days.days.push( new Date( '08/22/2017' ) );
//                         element.days.days.push( new Date( '08/23/2017' ) );
//                         element.days.days.push( new Date( '08/29/2017' ) );
//                         element.days.days.push( new Date( '08/30/2017' ) );
//                         element.days.days.push( new Date( '08/31/2017' ) );
//                     }

//                     if ( element.type == 'working' ) {
//                         element.days.days.push( new Date( '01/02/2017' ) );
//                         element.days.days.push( new Date( '01/03/2017' ) );
//                         element.days.days.push( new Date( '01/04/2017' ) );
//                         element.days.days.push( new Date( '01/09/2017' ) );
//                         element.days.days.push( new Date( '01/10/2017' ) );
//                         element.days.days.push( new Date( '01/11/2017' ) );
//                         element.days.days.push( new Date( '01/12/2017' ) );
//                         element.days.days.push( new Date( '01/16/2017' ) );
//                         element.days.days.push( new Date( '01/17/2017' ) );
//                         element.days.days.push( new Date( '01/18/2017' ) );
//                         element.days.days.push( new Date( '01/19/2017' ) );
//                         element.days.days.push( new Date( '01/23/2017' ) );
//                         element.days.days.push( new Date( '01/24/2017' ) );
//                         element.days.days.push( new Date( '01/25/2017' ) );
//                         element.days.days.push( new Date( '01/26/2017' ) );
//                         element.days.days.push( new Date( '01/30/2017' ) );
//                         element.days.days.push( new Date( '01/31/2017' ) );

//                         element.days.days.push( new Date( '02/01/2017' ) );
//                         element.days.days.push( new Date( '02/02/2017' ) );
//                         element.days.days.push( new Date( '02/06/2017' ) );
//                         element.days.days.push( new Date( '02/07/2017' ) );
//                         element.days.days.push( new Date( '02/08/2017' ) );
//                         element.days.days.push( new Date( '02/09/2017' ) );
//                         element.days.days.push( new Date( '02/13/2017' ) );
//                         element.days.days.push( new Date( '02/14/2017' ) );
//                         element.days.days.push( new Date( '02/15/2017' ) );
//                         element.days.days.push( new Date( '02/16/2017' ) );
//                         element.days.days.push( new Date( '02/20/2017' ) );
//                         element.days.days.push( new Date( '02/21/2017' ) );
//                         element.days.days.push( new Date( '02/22/2017' ) );
//                         element.days.days.push( new Date( '02/23/2017' ) );
//                         element.days.days.push( new Date( '02/27/2017' ) );
//                         element.days.days.push( new Date( '02/28/2017' ) );

//                         element.days.days.push( new Date( '03/01/2017' ) );
//                         element.days.days.push( new Date( '03/02/2017' ) );
//                         element.days.days.push( new Date( '03/06/2017' ) );
//                         element.days.days.push( new Date( '03/07/2017' ) );
//                         element.days.days.push( new Date( '03/08/2017' ) );
//                         element.days.days.push( new Date( '03/09/2017' ) );
//                         element.days.days.push( new Date( '03/13/2017' ) );
//                         element.days.days.push( new Date( '03/14/2017' ) );
//                         element.days.days.push( new Date( '03/15/2017' ) );
//                         element.days.days.push( new Date( '03/16/2017' ) );
//                         element.days.days.push( new Date( '03/20/2017' ) );
//                         element.days.days.push( new Date( '03/21/2017' ) );
//                         element.days.days.push( new Date( '03/22/2017' ) );
//                         element.days.days.push( new Date( '03/23/2017' ) );
//                         element.days.days.push( new Date( '03/27/2017' ) );
//                         element.days.days.push( new Date( '03/28/2017' ) );
//                         element.days.days.push( new Date( '03/29/2017' ) );
//                         element.days.days.push( new Date( '03/30/2017' ) );

//                         element.days.days.push( new Date( '04/04/2017' ) );
//                         element.days.days.push( new Date( '04/05/2017' ) );
//                         element.days.days.push( new Date( '04/10/2017' ) );
//                         element.days.days.push( new Date( '04/11/2017' ) );
//                         element.days.days.push( new Date( '04/12/2017' ) );
//                         element.days.days.push( new Date( '04/13/2017' ) );
//                         element.days.days.push( new Date( '04/17/2017' ) );
//                         element.days.days.push( new Date( '04/18/2017' ) );
//                         element.days.days.push( new Date( '04/19/2017' ) );
//                         element.days.days.push( new Date( '04/20/2017' ) );
//                         element.days.days.push( new Date( '04/24/2017' ) );
//                         element.days.days.push( new Date( '04/25/2017' ) );
//                         element.days.days.push( new Date( '04/26/2017' ) );
//                         element.days.days.push( new Date( '04/27/2017' ) );

//                         element.days.days.push( new Date( '05/02/2017' ) );
//                         element.days.days.push( new Date( '05/03/2017' ) );
//                         element.days.days.push( new Date( '05/04/2017' ) );
//                         element.days.days.push( new Date( '05/08/2017' ) );
//                         element.days.days.push( new Date( '05/09/2017' ) );
//                         element.days.days.push( new Date( '05/10/2017' ) );
//                         element.days.days.push( new Date( '05/11/2017' ) );
//                         element.days.days.push( new Date( '05/15/2017' ) );
//                         element.days.days.push( new Date( '05/16/2017' ) );
//                         element.days.days.push( new Date( '05/17/2017' ) );
//                         element.days.days.push( new Date( '05/18/2017' ) );
//                         element.days.days.push( new Date( '05/22/2017' ) );
//                         element.days.days.push( new Date( '05/23/2017' ) );
//                         element.days.days.push( new Date( '05/24/2017' ) );
//                         element.days.days.push( new Date( '05/25/2017' ) );
//                         element.days.days.push( new Date( '05/29/2017' ) );
//                         element.days.days.push( new Date( '05/30/2017' ) );

//                         element.days.days.push( new Date( '06/05/2017' ) );
//                         element.days.days.push( new Date( '06/06/2017' ) );
//                         element.days.days.push( new Date( '06/07/2017' ) );
//                         element.days.days.push( new Date( '06/08/2017' ) );
//                         element.days.days.push( new Date( '06/12/2017' ) );
//                         element.days.days.push( new Date( '06/13/2017' ) );
//                         element.days.days.push( new Date( '06/14/2017' ) );
//                         element.days.days.push( new Date( '06/15/2017' ) );
//                         element.days.days.push( new Date( '06/19/2017' ) );
//                         element.days.days.push( new Date( '06/20/2017' ) );
//                         element.days.days.push( new Date( '06/21/2017' ) );
//                         element.days.days.push( new Date( '06/22/2017' ) );
//                         element.days.days.push( new Date( '06/26/2017' ) );
//                         element.days.days.push( new Date( '06/27/2017' ) );
//                         element.days.days.push( new Date( '06/28/2017' ) );
//                         element.days.days.push( new Date( '06/29/2017' ) );

//                         element.days.days.push( new Date( '07/03/2017' ) );
//                         element.days.days.push( new Date( '07/04/2017' ) );
//                         element.days.days.push( new Date( '07/05/2017' ) );
//                         element.days.days.push( new Date( '07/06/2017' ) );
//                         element.days.days.push( new Date( '07/10/2017' ) );
//                         element.days.days.push( new Date( '07/11/2017' ) );
//                         element.days.days.push( new Date( '07/12/2017' ) );
//                         element.days.days.push( new Date( '07/13/2017' ) );
//                         element.days.days.push( new Date( '07/17/2017' ) );
//                         element.days.days.push( new Date( '07/18/2017' ) );
//                         element.days.days.push( new Date( '07/19/2017' ) );
//                         element.days.days.push( new Date( '07/20/2017' ) );
//                         element.days.days.push( new Date( '07/24/2017' ) );
//                         element.days.days.push( new Date( '07/25/2017' ) );
//                         element.days.days.push( new Date( '07/26/2017' ) );
//                         element.days.days.push( new Date( '07/27/2017' ) );
//                         element.days.days.push( new Date( '07/31/2017' ) );

//                         element.days.days.push( new Date( '09/04/2017' ) );
//                         element.days.days.push( new Date( '09/05/2017' ) );
//                         element.days.days.push( new Date( '09/06/2017' ) );
//                         element.days.days.push( new Date( '09/07/2017' ) );
//                         element.days.days.push( new Date( '09/11/2017' ) );
//                         element.days.days.push( new Date( '09/12/2017' ) );
//                         element.days.days.push( new Date( '09/13/2017' ) );
//                         element.days.days.push( new Date( '09/14/2017' ) );
//                         element.days.days.push( new Date( '09/18/2017' ) );
//                         element.days.days.push( new Date( '09/19/2017' ) );
//                         element.days.days.push( new Date( '09/20/2017' ) );
//                         element.days.days.push( new Date( '09/21/2017' ) );
//                         element.days.days.push( new Date( '09/26/2017' ) );
//                         element.days.days.push( new Date( '09/27/2017' ) );
//                         element.days.days.push( new Date( '09/28/2017' ) );

//                         element.days.days.push( new Date( '10/02/2017' ) );
//                         element.days.days.push( new Date( '10/03/2017' ) );
//                         element.days.days.push( new Date( '10/04/2017' ) );
//                         element.days.days.push( new Date( '10/05/2017' ) );
//                         element.days.days.push( new Date( '10/09/2017' ) );
//                         element.days.days.push( new Date( '10/10/2017' ) );
//                         element.days.days.push( new Date( '10/11/2017' ) );
//                         element.days.days.push( new Date( '10/12/2017' ) );
//                         element.days.days.push( new Date( '10/16/2017' ) );
//                         element.days.days.push( new Date( '10/17/2017' ) );
//                         element.days.days.push( new Date( '10/18/2017' ) );
//                         element.days.days.push( new Date( '10/19/2017' ) );
//                         element.days.days.push( new Date( '10/23/2017' ) );
//                         element.days.days.push( new Date( '10/24/2017' ) );
//                         element.days.days.push( new Date( '10/25/2017' ) );
//                         element.days.days.push( new Date( '10/26/2017' ) );
//                         element.days.days.push( new Date( '10/30/2017' ) );
//                         element.days.days.push( new Date( '10/31/2017' ) );

//                         element.days.days.push( new Date( '11/06/2017' ) );
//                         element.days.days.push( new Date( '11/07/2017' ) );
//                         element.days.days.push( new Date( '11/08/2017' ) );
//                         element.days.days.push( new Date( '11/09/2017' ) );
//                         element.days.days.push( new Date( '11/13/2017' ) );
//                         element.days.days.push( new Date( '11/14/2017' ) );
//                         element.days.days.push( new Date( '11/15/2017' ) );
//                         element.days.days.push( new Date( '11/16/2017' ) );
//                         element.days.days.push( new Date( '11/20/2017' ) );
//                         element.days.days.push( new Date( '11/21/2017' ) );
//                         element.days.days.push( new Date( '11/22/2017' ) );
//                         element.days.days.push( new Date( '11/23/2017' ) );
//                         element.days.days.push( new Date( '11/27/2017' ) );
//                         element.days.days.push( new Date( '11/28/2017' ) );
//                         element.days.days.push( new Date( '11/29/2017' ) );
//                         element.days.days.push( new Date( '11/30/2017' ) );

//                         element.days.days.push( new Date( '12/04/2017' ) );
//                         element.days.days.push( new Date( '12/05/2017' ) );
//                         element.days.days.push( new Date( '12/06/2017' ) );
//                         element.days.days.push( new Date( '12/07/2017' ) );
//                         element.days.days.push( new Date( '12/11/2017' ) );
//                         element.days.days.push( new Date( '12/12/2017' ) );
//                         element.days.days.push( new Date( '12/13/2017' ) );
//                         element.days.days.push( new Date( '12/14/2017' ) );
//                         element.days.days.push( new Date( '12/18/2017' ) );
//                         element.days.days.push( new Date( '12/19/2017' ) );
//                         element.days.days.push( new Date( '12/20/2017' ) );
//                         element.days.days.push( new Date( '12/21/2017' ) );
//                         element.days.days.push( new Date( '12/26/2017' ) );
//                         element.days.days.push( new Date( '12/27/2017' ) );
//                         element.days.days.push( new Date( '12/28/2017' ) );
//                     }

//                     if ( element.type == 'non_working' ) {
//                         element.days.days.push( new Date( '01/07/2017' ) );
//                         element.days.days.push( new Date( '01/08/2017' ) );
//                         element.days.days.push( new Date( '01/14/2017' ) );
//                         element.days.days.push( new Date( '01/15/2017' ) );
//                         element.days.days.push( new Date( '01/21/2017' ) );
//                         element.days.days.push( new Date( '01/22/2017' ) );
//                         element.days.days.push( new Date( '01/28/2017' ) );
//                         element.days.days.push( new Date( '01/29/2017' ) );

//                         element.days.days.push( new Date( '02/04/2017' ) );
//                         element.days.days.push( new Date( '02/05/2017' ) );
//                         element.days.days.push( new Date( '02/11/2017' ) );
//                         element.days.days.push( new Date( '02/12/2017' ) );
//                         element.days.days.push( new Date( '02/18/2017' ) );
//                         element.days.days.push( new Date( '02/19/2017' ) );
//                         element.days.days.push( new Date( '02/25/2017' ) );
//                         element.days.days.push( new Date( '02/26/2017' ) );

//                         element.days.days.push( new Date( '03/04/2017' ) );
//                         element.days.days.push( new Date( '03/05/2017' ) );
//                         element.days.days.push( new Date( '03/11/2017' ) );
//                         element.days.days.push( new Date( '03/12/2017' ) );
//                         element.days.days.push( new Date( '03/18/2017' ) );
//                         element.days.days.push( new Date( '03/19/2017' ) );
//                         element.days.days.push( new Date( '03/25/2017' ) );
//                         element.days.days.push( new Date( '03/26/2017' ) );

//                         element.days.days.push( new Date( '04/01/2017' ) );
//                         element.days.days.push( new Date( '04/08/2017' ) );
//                         element.days.days.push( new Date( '04/09/2017' ) );
//                         element.days.days.push( new Date( '04/15/2017' ) );
//                         element.days.days.push( new Date( '04/16/2017' ) );
//                         element.days.days.push( new Date( '04/22/2017' ) );
//                         element.days.days.push( new Date( '04/23/2017' ) );
//                         element.days.days.push( new Date( '04/29/2017' ) );
//                         element.days.days.push( new Date( '04/30/2017' ) );

//                         element.days.days.push( new Date( '05/06/2017' ) );
//                         element.days.days.push( new Date( '05/07/2017' ) );
//                         element.days.days.push( new Date( '05/13/2017' ) );
//                         element.days.days.push( new Date( '05/14/2017' ) );
//                         element.days.days.push( new Date( '05/20/2017' ) );
//                         element.days.days.push( new Date( '05/21/2017' ) );
//                         element.days.days.push( new Date( '05/27/2017' ) );
//                         element.days.days.push( new Date( '05/28/2017' ) );

//                         element.days.days.push( new Date( '06/03/2017' ) );
//                         element.days.days.push( new Date( '06/04/2017' ) );
//                         element.days.days.push( new Date( '06/10/2017' ) );
//                         element.days.days.push( new Date( '06/11/2017' ) );
//                         element.days.days.push( new Date( '06/17/2017' ) );
//                         element.days.days.push( new Date( '06/18/2017' ) );
//                         element.days.days.push( new Date( '06/25/2017' ) );

//                         element.days.days.push( new Date( '07/01/2017' ) );
//                         element.days.days.push( new Date( '07/02/2017' ) );
//                         element.days.days.push( new Date( '07/08/2017' ) );
//                         element.days.days.push( new Date( '07/09/2017' ) );
//                         element.days.days.push( new Date( '07/15/2017' ) );
//                         element.days.days.push( new Date( '07/16/2017' ) );
//                         element.days.days.push( new Date( '07/22/2017' ) );
//                         element.days.days.push( new Date( '07/23/2017' ) );
//                         element.days.days.push( new Date( '07/29/2017' ) );
//                         element.days.days.push( new Date( '07/30/2017' ) );

//                         element.days.days.push( new Date( '08/05/2017' ) );
//                         element.days.days.push( new Date( '08/06/2017' ) );
//                         element.days.days.push( new Date( '08/12/2017' ) );
//                         element.days.days.push( new Date( '08/13/2017' ) );
//                         element.days.days.push( new Date( '08/19/2017' ) );
//                         element.days.days.push( new Date( '08/20/2017' ) );

//                         element.days.days.push( new Date( '09/02/2017' ) );
//                         element.days.days.push( new Date( '09/03/2017' ) );
//                         element.days.days.push( new Date( '09/09/2017' ) );
//                         element.days.days.push( new Date( '09/10/2017' ) );
//                         element.days.days.push( new Date( '09/16/2017' ) );
//                         element.days.days.push( new Date( '09/17/2017' ) );
//                         element.days.days.push( new Date( '09/23/2017' ) );
//                         element.days.days.push( new Date( '09/30/2017' ) );

//                         element.days.days.push( new Date( '10/01/2017' ) );
//                         element.days.days.push( new Date( '10/07/2017' ) );
//                         element.days.days.push( new Date( '10/08/2017' ) );
//                         element.days.days.push( new Date( '10/14/2017' ) );
//                         element.days.days.push( new Date( '10/15/2017' ) );
//                         element.days.days.push( new Date( '10/21/2017' ) );
//                         element.days.days.push( new Date( '10/22/2017' ) );
//                         element.days.days.push( new Date( '10/28/2017' ) );
//                         element.days.days.push( new Date( '10/29/2017' ) );

//                         element.days.days.push( new Date( '11/04/2017' ) );
//                         element.days.days.push( new Date( '11/05/2017' ) );
//                         element.days.days.push( new Date( '11/11/2017' ) );
//                         element.days.days.push( new Date( '11/12/2017' ) );
//                         element.days.days.push( new Date( '11/18/2017' ) );
//                         element.days.days.push( new Date( '11/19/2017' ) );
//                         element.days.days.push( new Date( '11/25/2017' ) );
//                         element.days.days.push( new Date( '11/26/2017' ) );

//                         element.days.days.push( new Date( '12/02/2017' ) );
//                         element.days.days.push( new Date( '12/03/2017' ) );
//                         element.days.days.push( new Date( '12/10/2017' ) );
//                         element.days.days.push( new Date( '12/16/2017' ) );
//                         element.days.days.push( new Date( '12/17/2017' ) );
//                         element.days.days.push( new Date( '12/23/2017' ) );
//                         element.days.days.push( new Date( '12/30/2017' ) );
//                         element.days.days.push( new Date( '12/31/2017' ) );
//                     }
//                 });
//             } // year 2017
//         }); // doc.years.forEach
//         doc.save();
//         // res.send( doc.groupDays );
//     });

// ************************************************** **************************************************
});


// ******************************************* ACCESS COLLECTION THROUGHT mongoose.connection OBJECT *****************************
    // var connection = mongoose.connection;
    // connection.db.collection("projects", function(err, collection){
    //         collection.find({}).toArray(function(err, data){
    //             console.log(data); // it will print your collection data
    //         })
    // });
// *************************************************************** ***************************************************************


module.exports = router;


// **************************************** RANDOM FUNCTION TO FILL USER CANDIDATEID ********************************************
    // models.User.find( {}, function( err, users ) {
    //     if( users ) {
    //         users.forEach( function( user ) {
    //             var code = generateRandomEmployeeCode();
    //             user.candidatoId = code;
    //             user.save();
    //         });
    //     }
    // });
    // function generateRandomEmployeeCode() {
    //     var charLength = 8,
    //     charSet        = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ',
    //     charRetVal     = '';
    //     for ( var i = 0, n = charSet.length; i < charLength; ++i ) {
    //         charRetVal += charSet.charAt( Math.floor( Math.random() * n ) );
    //     };
    //     return charRetVal;
    // };
// ******************************************************************************************************************************
