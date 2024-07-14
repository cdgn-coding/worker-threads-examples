const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');
const { performance } = require('perf_hooks');

class MaxMin extends Transform {
  constructor(options) {
    super(options);
    this.max = new Map();
    this.min = new Map();
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
  
    for (const line of lines) {
      const [city, tempStr] = line.split(';');
      const temp = parseFloat(tempStr);
      const currentMax = this.max.get(city) || -Infinity;
      const currentMin = this.min.get(city) || Infinity;
  
      if (temp > currentMax) {
        this.max.set(city, temp);
      }
  
      if (temp < currentMin) {
        this.min.set(city, temp);
      }
    
    }
    callback();
  }

  _flush(callback) {
    for (const [city, temp] of this.max) {
      this.push(`${city}: max ${temp}\n`);
    }
    for (const [city, temp] of this.min) {
      this.push(`${city}: min ${temp}\n`);
    }
    callback();
  }
}

console.log(performance.now().toFixed(2), 'Stream processing started');

const data = createReadStream('./weather_stations.csv');
const output = createWriteStream('./output_stream_only.txt');
data.pipe(new MaxMin()).pipe(output);

console.log(performance.now().toFixed(2), 'Stream processing finished');