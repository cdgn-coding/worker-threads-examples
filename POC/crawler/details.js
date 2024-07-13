const { Transform } = require('node:stream');
const { parentPort, workerData = {} } = require('node:worker_threads');

async function main() {
  const {
    ticker = 1000,
  } = workerData;

  let queue = [];
  let finished = false;

  parentPort.on('message', (message) => {
    if (message.type === 'link') {
      queue.push(message.payload);
    }

    if (message.type === 'finish') {
      console.log('Finishing worker...');
      finished = true;
    }
  });

  while (true) {
    if (finished && queue.length == 0) {
      break;
    }

    if (queue.length == 0) {
      await new Promise((resolve) => setTimeout(resolve, ticker));
      continue;
    }

    const link = queue.shift();
    // some processing
    // await new Promise((resolve) => setTimeout(resolve, ticker));

    parentPort.postMessage({
      type: 'detail',
      payload: {
        link,
        processedAt: Date.now(),
      }
    });
  }
}

main()