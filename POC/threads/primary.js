const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (!isMainThread) {
  throw new Error('This script should be run as a primary process.');
}

const worker = new Worker('./thread.js', {
  workerData: 'Hello, world!',
});

worker.on('message', message => {
  console.log('Received:', message);
});

worker.on('error', (err) => {
  console.error(err);
});

worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(new Error(`Worker stopped with exit code ${code}`));
  }
});