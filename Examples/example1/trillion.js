const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const { performance } = require('perf_hooks');

if (isMainThread) {
  // This is the main thread

  // Use the same file as the worker
  // Pass some data to the worker
  const workerThread = new Worker(__filename, {
    workerData: {
      countTo: 1000000000 
    }
  });

  // Setup event listener to receive messages from the worker
  workerThread.on('message', (message) => {
    console.log(timeOfExecution(), 'Message from worker:', message);
  });

  console.log(timeOfExecution(), 'Main thread can still do other work');
} else {
  // This is the worker thread
  console.log(timeOfExecution(), 'Worker thread is running with', workerData);

  // Get the data passed to the worker
  const { countTo } = workerData;
  console.log(timeOfExecution(), 'Worker thread will count to:', countTo);

  // Do some heavy work
  for (let i = 0; i < countTo; i++) {}

  // Send a message to the main thread
  parentPort.postMessage('done');
}

function timeOfExecution() {
  const ms = performance.now().toFixed(2);
  return `${ms}ms`;
}
