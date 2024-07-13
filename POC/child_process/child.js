process.on('message', (m) => {
  console.log('CHILD got message:', m);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });

process.on('exit', () => {
  console.log('CHILD exited');
});

setImmediate(() => {
  process.exit();
});