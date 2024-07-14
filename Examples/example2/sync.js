const { timeOfExecution } = require("./timeOfExecution");

for (let i = 0; i < 5; i++) {
  // Simulate some heavy work that takes 1.5 seconds
  const now = Date.now();
  while (Date.now() - now < 1500) {}

  console.log(timeOfExecution(), "Processed:", i);
}

console.log(timeOfExecution(), "Main process exited");