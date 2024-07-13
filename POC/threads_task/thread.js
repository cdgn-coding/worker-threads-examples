const { isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  throw new Error('This script should be run as a worker thread.');
}

parentPort.on('message', (...args) => {
  console.log('Received:', args);
});