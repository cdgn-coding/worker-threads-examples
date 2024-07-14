function timeOfExecution() {
  const ms = performance.now().toFixed(2);
  return `${ms}ms`;
}

module.exports = { timeOfExecution }