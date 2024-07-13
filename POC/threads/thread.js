const { isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  throw new Error('This script should be run as a worker thread.');
}

console.log(workerData, 'Starting data intensive operation...')

const atStart = Date.now();
while (Date.now() - atStart < 5000) {}

console.log('Data intensive operation completed.');

parentPort.postMessage('Done');