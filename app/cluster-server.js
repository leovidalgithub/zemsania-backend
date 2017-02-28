var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

 cluster.on('exit', function(deadWorker, code, signal) {
    // Restart the worker
    var worker = cluster.fork();

    // Note the process IDs
    var newPID = worker.process.pid;
    var oldPID = deadWorker.process.pid;

    // Log the event
    console.log('worker '+oldPID+' died.');
    console.log('worker '+newPID+' born.');
  });

 

  Object.keys(cluster.workers).forEach(function(id) {
    console.log("Assigned PIDs: " + cluster.workers[id].process.pid);
  });


} else {

   //change this line to Your Node.js app entry point.
    require("./server-app.js");
}