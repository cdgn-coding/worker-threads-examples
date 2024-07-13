const { Worker } = require('node:worker_threads');
const { performance } = require('perf_hooks');

const producer = new Worker('./producer.js');

class WorkerPool {
  constructor(workerFile, poolSize) {
    this.pool = Array.from({ length: poolSize }, () => new Worker(workerFile));
  }

  postMessage(message) {
    const worker = this.pool.pop();
    worker.postMessage(message);
    this.pool.unshift(worker);
  }

  broadcast(message) {
    for (const worker of this.pool) {
      worker.postMessage(message);
    }
  }

  on(event, listener) {
    for (const worker of this.pool) {
      worker.on(event, listener);
    }
  }
}

const pool = new WorkerPool('./consumer.js', 2);

producer.on('message', (message) => {
  if (message.type === 'data') {
    console.log('Produced:', message.data);
    pool.postMessage(message);
  }

  if (message.type === 'end') {
    pool.broadcast({
      type: 'end',
    })
  }
})

pool.on('message', (message) => {
  console.log('Consumed:', message.data);
});

process.on('exit', () => {
  const timeElapsed = performance.now();
  const seconds = timeElapsed / 1000;
  console.log(`Execution time: ${seconds} seconds`);
});
