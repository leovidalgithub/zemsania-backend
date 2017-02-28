var express         = require("express"),
    app             = express(),
    methodOverride  = require("method-override");

var schedule = require('node-schedule');
var environment = process.env.NODE_ENV || 'dev';
var cronServices = require('./services/cronServices'); 


console.log("init cron services....");
//schedule.scheduleJob('10 * * * * *', function(){
schedule.scheduleJob('0 0 * * * *', function(){

        //It should be called every hour
        console.log("Cron call at " + new Date() );
        cronServices.testCron();
});

app.get('/', function(req, res){
  res.status(200).jsonp({cron_status:'ok'});
});


// Start server
app.listen(5000, function() {
  console.log("Cron server run in http://localhost:5000");
});
