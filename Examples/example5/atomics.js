// Create a SharedArrayBuffer with a size in bytes
const sharedBuffer = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
sharedBuffer[0] = 0;

// Prints 0
console.log(Atomics.load(sharedBuffer, 0));

// Add 1 to the shared buffer
Atomics.add(sharedBuffer, 0, 1)

// Prints 1
console.log(Atomics.load(sharedBuffer, 0));

// Subtract 1 from the shared buffer
Atomics.sub(sharedBuffer, 0, 1)

// Prints 0
console.log(Atomics.load(sharedBuffer, 0));
