const { Pool } = require('./pool');
const { Worker, MessageChannel } = require('node:worker_threads');
const { timeOfExecution } = require("./timeOfExecution");

const channel = new MessageChannel();

// Launch producer and consumer workers
const producer = new Worker('./producer.js', {
  workerData: { port: channel.port1 },
  transferList: [channel.port1]
});

const consumerPool = new Pool('./consumer.js', 5, channel.port2);

// Consumer receives data from producer
consumerPool.on('message', (message) => {
  console.log(timeOfExecution(), "Consumed:", message.data);
});
