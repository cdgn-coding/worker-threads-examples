const { Worker, MessageChannel } = require('node:worker_threads');

class Pool {
  constructor(workerPath, size, port) {
    this.workerPath = workerPath;
    this.size = size;
    this.workers = [];
    this.port = port;

    // Create workers
    for (let i = 0; i < size; i++) {
      const {
        port1: poolChannel,
        port2: jobChannel
      } = new MessageChannel();

      // Create shared buffer for worker
      const sharedBuffer = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));

      // Initialize atomic counter
      sharedBuffer[0] = 0;

      // Create worker
      const worker = new Worker(workerPath);

      // Store worker, shared buffer and channel
      this.workers.push({
        worker,
        sharedBuffer,
        poolChannel,
        jobChannel,
      });

      // Send startup message to worker
      worker.postMessage({
        type: 'startup',
        payload: {
          sharedBuffer,
          jobChannel,
        }
      }, [jobChannel]);
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

    // Post message to worker
    worker.poolChannel.postMessage(message);

    // Increment atomic counter and notify worker
    Atomics.add(worker.sharedBuffer, 0, 1)
    Atomics.notify(worker.sharedBuffer, 0);

    // Add worker back to pool
    this.workers.push(worker);
  }

  on(event, callback) {
    // Register callback for all workers
    this.workers.forEach(worker => {
      worker.poolChannel.on(event, callback)
    });
  }

  broadcast(message) {
    // Broadcast message to all workers
    this.workers.forEach(worker => worker.poolChannel.postMessage(message));
  }

  terminate() {
    // Terminate all workers
    this.workers.forEach(worker => worker.worker.terminate());
  }
}

module.exports = { Pool }