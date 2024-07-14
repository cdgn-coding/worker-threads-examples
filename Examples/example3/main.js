const { Worker, MessageChannel } = require('node:worker_threads');
const { timeOfExecution } = require("./timeOfExecution");

const channel = new MessageChannel();

// Launch producer and consumer workers
const producer = new Worker('./producer.js', {
  workerData: { port: channel.port1 },
  transferList: [channel.port1]
});

const consumer = new Worker('./consumer.js', {
  workerData: { port: channel.port2 },
  transferList: [channel.port2]
});

// Consumer receives data from producer
consumer.on('message', (message) => {
  console.log(timeOfExecution(), "Consumed:", message.data);
});

// Show time of exit of each worker
producer.on('exit', () => {
  console.log(timeOfExecution(), "Producer exited");
});

consumer.on('exit', () => {
  console.log(timeOfExecution(), "Consumer exited");
});

// Show time of exit of main process
process.on('exit', () => {
  console.log(timeOfExecution(), "Main process exited");
});