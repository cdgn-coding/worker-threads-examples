const { Worker, MessageChannel } = require('node:worker_threads');

class Pool {
  constructor(workerPath, size, port) {
    this.workerPath = workerPath;
    this.size = size;
    this.workers = [];
    this.port = port;

    // Create workers
    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(workerPath));
    }

    // Listen for messages in the port
    // and distribute them to workers
    this.port.on('message', message => {
      if (message.type === 'data') {
        this.postMessage(message);
      }
      
      if (message.type === 'end') {
        this.broadcast(message);
      }
    });
  }

  postMessage(message) {
    // Round-robin distribution
    const worker = this.workers.shift();
    worker.postMessage(message);
    this.workers.push(worker);
  }

  on(event, callback) {
    // Register callback for all workers
    this.workers.forEach(worker => worker.on(event, callback));
  }

  broadcast(message) {
    // Broadcast message to all workers
    this.workers.forEach(worker => worker.postMessage(message));
  }

  terminate() {
    // Terminate all workers
    this.workers.forEach(worker => worker.terminate());
  }
}

module.exports = { Pool }