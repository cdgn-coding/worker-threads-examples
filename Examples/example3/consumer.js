const { parentPort, workerData } = require("worker_threads");
const { port } = workerData;

function expensiveComputation(n) {
  // Simulate some heavy work that takes 1 second
  const now = Date.now();
  while (Date.now() - now < 1000) {}
  return n;
}

async function main() {
  // Queue to store data
  let queue = [];
  let finished = false;

  // Consumer receives data from producer
  port.on("message", (message) => {
    if (message.type === "data") {
      queue.push(message);
    }

    if (message.type === "end") {
      finished = true;
    }
  });

  // While loop to consume data
  while (true) {
    // If finished and queue is empty, break the loop
    if (finished && queue.length === 0) {
      break;
    }

    // If queue is empty, wait for 1 second before checking again
    if (queue.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    // Consume data, one at a time
    const message = queue.shift();
    const result = expensiveComputation(message.data);
    parentPort.postMessage({ type: "data", data: result });
  }
}

// Start the consumer
// When the consumer is done, exit the process
main().then(() => {
  process.exit();
});