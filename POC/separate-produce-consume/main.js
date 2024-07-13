const { Worker } = require('node:worker_threads');
const DataStream = require('./DataStream');

const data = new DataStream()
const producer = new Worker('./producer.js');

producer.on('message', (message) => {
  if (message.type === 'data') {
    console.log('Produced:', message.data);
    data.write(message.data);
  }

  if (message.type === 'end') {
    data.end();
  }
})

const consumer = new Worker('./consumer.js');

data.on('data', (chunk) => {
  consumer.postMessage({
    type: 'data',
    data: chunk.toString(),
  });
});


consumer.on('message', (message) => {
  console.log('Consumed:', message.data);
});

data.on('end', () => {
  console.log('Data stream ended');
  consumer.postMessage({
    type: 'end',
  });
});