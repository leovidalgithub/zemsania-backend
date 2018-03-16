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

// ************************************************** **************************************************
// ***GENERATE RANDOM DAYS (HOLIDAYS, WORKING, ETC.) FOR A YEAR AND PUSH INTO DB************************
// ************************************************** **************************************************
    const currentYear = 2020;
    let day = 1;
    let myTimeStamp = new Date(currentYear,0,day).getTime();
    let output = {};
    let dayTypesArray = ['holidays', 'special', 'friday', 'intensive', 'working', 'non_working'];

    while (new Date(myTimeStamp).getFullYear() == currentYear) {
        let myType = Math.floor(Math.random() * (6 - 0));
        myType = dayTypesArray[myType];
        if (!output[myType]) output [myType] = [];
        output[myType].push(myTimeStamp);
        myTimeStamp = new Date(currentYear,0,++day,0,0,0).getTime();
    };

    mongoose = require( 'mongoose' );
    ObjectId = require( 'mongoose' ).Types.ObjectId;
    models.Calendar.findOne({ _id: new ObjectId( '58e3a7feca9d9b15f037fae6' ) }, function( err, doc ) {
        doc.years.forEach( function( year ) {
            if (year.year == currentYear ) {
                year.groupDays.forEach( function( element ) {
                    element.days.days = output[element.type];
                    // if ( element.type == 'special' ) {}
                });
            } // year 2018
        }); // doc.years.forEach
        // doc.save();
        // res.send(doc);
    });
// ************************************************** **************************************************
// ************************************************** **************************************************
// ************************************************** **************************************************
}); // router.get( '/fill', () =>...

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
