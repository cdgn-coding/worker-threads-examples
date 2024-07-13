const {
  Worker
} = require('node:worker_threads');

const worker = new Worker('./thread.js');

worker.on('error', (err) => {
  console.error(err);
});

worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(new Error(`Worker stopped with exit code ${code}`));
  }
});