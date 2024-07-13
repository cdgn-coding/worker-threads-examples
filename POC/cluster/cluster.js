const cluster = require('node:cluster');
const http = require('node:http');
const process = require('node:process');
const numCPUs = require('node:os').availableParallelism();

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', function(data) {
      console.log('Message from worker:', data.message);
    });
  }

} else {
  console.log('Worker started with PID:', process.pid);
  process.send({ message: 'Hello from worker ' + process.pid });
  process.on('message', function(data) {
    console.log('Message from master:', data.message);
  });
}