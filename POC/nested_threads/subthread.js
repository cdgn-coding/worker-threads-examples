const { isMainThread, parentPort, workerData } = require('worker_threads');

console.log('This is subthread.js');