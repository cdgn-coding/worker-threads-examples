const { Worker } = require('node:worker_threads');

module.exports = class Pool {
  constructor(workerPath, size) {
    this.workerPath = workerPath;
    this.size = size;
    this.workers = [];
    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(workerPath));
    }
  }

  postMessage(message) {
    const worker = this.workers.shift();
    worker.postMessage(message);
    this.workers.push(worker);
  }

  on(event, callback) {
    this.workers.forEach(worker => worker.on(event, callback));
  }

  broadcast(message) {
    this.workers.forEach(worker => worker.postMessage(message));
  }

  terminate() {
    this.workers.forEach(worker => worker.terminate());
  }
}