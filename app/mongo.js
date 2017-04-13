var express   = require( 'express' ),
    router    = express.Router(),
    mongoose  = require( 'mongoose' ),
    ObjectId  = require( 'mongoose' ).Types.ObjectId;
// var newId = ObjectId();

router.get( '/fill', function ( req, res ) {
console.log('\033c');    

    // models.Timesheet.findOne( { _id: new ObjectId( '58e7630deacc350744f34e6a' ) }, function( err, doc ) {
    //         var date = new Date ( doc.date );
    //         console.log( date.getDate());
    //         console.log( date.getMonth());
    //         models.Timesheet.findOne( { date: date, userId: '58a446acdb8d2617dc208d8a' }, function( err, doc ) {
    //             res.send( doc );   
    //         });
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
    //     projectId: '58e760a5ccac571698ef1895',
    //     userId: '58a446acdb8d2617dc208d8a',
    //     maxHours: '7'
    // });
    // pru.save( function(err,data) {
    //     if ( err ) console.log( err );
    //     console.log('saved!');
    //     res.send(data);
    // });
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
});

module.exports = router;




// ******************************************* ACCESS COLLECTION THROUGHT mongoose.connection OBJECT *****************************
    // var connection = mongoose.connection;
    // connection.db.collection("projects", function(err, collection){
    //         collection.find({}).toArray(function(err, data){
    //             console.log(data); // it will print your collection data
    //         })
    // });
// *************************************************************** ***************************************************************


