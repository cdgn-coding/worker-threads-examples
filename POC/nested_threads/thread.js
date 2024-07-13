const {
  Worker
} = require('node:worker_threads');

console.log('This is thread.js');

const worker = new Worker('./subthread.js');

worker.on('error', (err) => {
  console.error(err);
});

worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(new Error(`Worker stopped with exit code ${code}`));
  }
});