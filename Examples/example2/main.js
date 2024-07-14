const { Worker } = require('node:worker_threads');
const { timeOfExecution } = require("./timeOfExecution");

// Launch producer and consumer workers
const producer = new Worker('./producer.js');
const consumer = new Worker('./consumer.js');

// Producer sends data to consumer
producer.on('message', (message) => {
  if (message.type === 'data') {
    console.log(timeOfExecution(), "Produced:", message.data);

    consumer.postMessage({
      type: 'data',
      data: message.data,
    });
  }

  if (message.type === 'end') {
    consumer.postMessage({
      type: 'end',
    });
  }
})

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