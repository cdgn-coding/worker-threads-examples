const { Worker } = require('node:worker_threads');
const Pool = require('./pool.js');

async function main() {
  const listingWorker = new Worker('./listings.js');

  const detailWorkers = new Pool('./details.js', 4);

  const linksToProcess = new Set()
  const proccessedLinks = new Set()
  const ticker = 1000;
  let generatingLinks = true;

  listingWorker.on('message', (message) => {
    if (message.type === 'links') {
      console.log('Received links:', message.payload.length, 'passing to worker pool');
      message.payload.forEach((link) => {
        detailWorkers.postMessage({ type: 'link', payload: link });
        linksToProcess.add(link);
      });
    }

    if (message.type === 'finish') {
      generatingLinks = false;
    }
  });

  detailWorkers.on('message', (message) => {
    if (message.type === 'detail') {
      console.log('Processed link:', message.payload.link);
      proccessedLinks.add(message.payload.link);
    }
  });

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, ticker));
    if (!generatingLinks && linksToProcess.size === proccessedLinks.size) {
      console.log('All links processed');
      detailWorkers.broadcast({ type: 'finish' });
      break;
    }

    if (!generatingLinks) {
      console.log('Still processing pending links:', linksToProcess.size - proccessedLinks.size);
    }
  }

  detailWorkers.terminate();
  listingWorker.terminate();
}

main()