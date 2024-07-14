const { workerData } = require('worker_threads');

const { port } = workerData;

for (let i = 0; i < 5; i++) {
  // Simulate some heavy work that takes 1.5 seconds
  const now = Date.now();
  while (Date.now() - now < 1500) {}

  // Produce data to be consumed by consumer worker
  port.postMessage({
    type: 'data',
    data: i.toString(),
  });
}

// Send end message to the given port
port.postMessage({
  type: 'end',
});
