const { Duplex } = require('node:stream');
module.exports = class DataStream extends Duplex {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, callback) {
    this.emit('data', chunk);
    callback();
  }

  _read(size) {}

  end() {
    this.emit('end');
  }
}