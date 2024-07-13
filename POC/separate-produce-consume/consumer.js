const { parentPort } = require("worker_threads");

function expensiveComputation(arg) {
  const atStart = Date.now();
  while (Date.now() - atStart < 100) {}
  return arg;
}

async function processData(arg) {
  parentPort.postMessage({
    type: "data",
    data: expensiveComputation(arg),
  });
}

parentPort.on("message", (message) => {
  if (message.type === "data") {
    processData(message.data);
  }

  if (message.type === "end") {
    process.exit();
  }
});