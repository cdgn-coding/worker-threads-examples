const { timeOfExecution } = require("./timeOfExecution");

for (let i = 0; i < 5; i++) {
  // Simulate some heavy work that takes 2.5 seconds (1 + 1.5)
  const now = Date.now();
  while (Date.now() - now < 2500) {}

  console.log(timeOfExecution(), "Processed:", i);
}

console.log(timeOfExecution(), "Main process exited");