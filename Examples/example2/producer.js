const { parentPort } = require('worker_threads');

for (let i = 0; i < 5; i++) {
  // Simulate some heavy work that takes 1.5 seconds
  const now = Date.now();
  while (Date.now() - now < 500) {}

  // Produce data to be consumed by consumer worker
  parentPort.postMessage({
    type: 'data',
    data: i.toString(),
  });
}

// Send end message to main thread
parentPort.postMessage({
  type: 'end',
});
