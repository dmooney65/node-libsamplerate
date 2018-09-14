
const SampleRate = require('./index.js');
const fs = require('fs');
const header = require('./waveheader.js');


let options = {
    type: SampleRate.SRC_SINC_BEST_QUALITY,
    channels: 2, 
    fromRate: 44100, 
    fromDepth: 24,
    toRate: 44100, 
    toDepth: 24
}

const resample = new SampleRate(options);
// Start read at byte 44 to avoid WAV header data
var rs = fs.createReadStream('rec.wav', {start: 44});
var ws = fs.createWriteStream('out.wav');

ws.write(header(0, {
    bitDepth: options.toDepth,
    sampleRate: options.toRate,
    channels: options.channels
}));


resample.on('pipe', () => {
    console.log('PIPE Event')
})
resample.on('unpipe', () => {
    console.log('UNPIPE Event')
})
resample.on('finish', () => {
    console.log('FINISH Event ')
})

resample.on('error', () => {
    console.log('ERROR Event ')
})
resample.on('end', () => {
    console.log('END Event')
    ws.end();
})

rs.pipe(resample).pipe(ws);
