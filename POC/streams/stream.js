const { Worker, isMainThread, parentPort } = require('node:worker_threads');
const { Duplex, Transform } = require('node:stream');

class Data extends Duplex {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, callback) {
    this.emit('data', chunk);
    console.log(`Emmited: ${chunk.toString()}`);
    callback();
  }

  _read(size) {}
}

class ExpensiveComputation extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const data = chunk.toString();
    const atStart = Date.now();
    while (Date.now() - atStart < 1000) {}
    this.push(`Expensive computation result for ${data}\n`);
    callback();
  }
}

if (isMainThread) {
  const producer = new Worker(__filename);
  const data = new Data();

  producer.on('message', (message) => {
    if (message.type === 'data') {
      data.write(message.data);
    }

    if (message.type === 'end') {
      data.end();
    }
  })

  data.pipe(new ExpensiveComputation()).pipe(process.stdout);
} else {
  for (let i = 0; i < 10; i++) {
    parentPort.postMessage({
      type: 'data',
      data: i.toString(),
    });
  }

  parentPort.postMessage({
    type: 'end',
  });
}