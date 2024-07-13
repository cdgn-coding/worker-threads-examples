const cp = require('node:child_process');
const n = cp.fork(`${__dirname}/child.js`);

n.on('message', (m) => {
  console.log('PARENT got message:', m);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
n.send({ hello: 'world' });

// should exit in order to end main process
// setTimeout(() => {
//   n.kill();
// }, 5000);