const { parentPort, receiveMessageOnPort } = require("worker_threads");

function expensiveComputation(n) {
  // Simulate some heavy work that takes 1 second
  const now = Date.now();
  while (Date.now() - now < 1000) {}
  return n;
}

parentPort.on("message", (message) => {
  if (message.type !== "startup") {
    return;
  }

  // First message received is the buffer
  const { jobChannel, sharedBuffer } = message.payload;

  // Start the consumer
  // When the consumer is done, exit the process
  main(sharedBuffer, jobChannel).then(() => {
    process.exit();
  });
});

async function main(sharedBuffer, jobChannel) {
  let finished = false;

  // While loop to consume data
  while (!finished || Atomics.wait(sharedBuffer, 0, 0) === "ok") {
    // Wait for the producer to produce data

    // Consume data
    let entry;
    while ((entry = receiveMessageOnPort(jobChannel)) !== undefined) {
      // Consume data, one at a time
      processMessage(entry.message);

      // Notify the producer that the data has been consumed
      Atomics.sub(sharedBuffer, 0, 1);
    }
  }


  function processMessage(message) {
    if (message.type === "data") {
      // Do the heavy computation and send the result back
      const result = expensiveComputation(message.data);
      jobChannel.postMessage({ type: "data", data: result });
    }

    if (message.type === "end") {
      // End of data reached
      finished = true;
    }
  }
}
