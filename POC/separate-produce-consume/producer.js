const { parentPort } = require('worker_threads');

for (let i = 0; i < 10; i++) {
  parentPort.postMessage({
    type: 'data',
    data: i.toString(),
  });
}

parentPort.postMessage({
  type: 'end',
});