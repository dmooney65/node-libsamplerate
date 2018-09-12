
const SampleRate = require('./index.js');
const fs = require('fs');
const header = require('./waveheader.js');


let options = {
    type: SampleRate.SRC_LINEAR,
    channels: 2, fromRate: 96000, fromDepth: 24,
    toRate: 96000, toDepth: 24
}

const trans = new SampleRate(options);
var rs = fs.createReadStream('24_96.raw');//, {start: 44});//, {highWaterMark: 1024});
var ws = fs.createWriteStream('out.wav');
/*ws.write(header(0, {
    bitDepth: options.toDepth,
    sampleRate: options.toRate,
    channels: options.channels
}));*/

/*trans.on('start', () => {
    console.log('### START ...')
})

trans.on('data', (data) => {
    ws.write(data);
})*/
/**
             * Event emitter
             * The defined events on documents including:
             * 1. close
             * 2. drain
             * 3. error
             * 4. finish
             * 5. pipe
             * 6. unpipe
             */

trans.on('pipe', () => {
    console.log('PIPE Event')
})
trans.on('unpipe', () => {
    console.log('UNPIPE Event')
})
trans.on('finish', () => {
    console.log('FINISH Event ')
})
/*trans.on('drain', () => {
    console.log('trans drain ')
})*/

trans.on('error', () => {
    console.log('ERROR Event ')
})
trans.on('end', () => {
    console.log('END Event')
    ws.end();
})


/*ws.on('close', () => {
    console.log('ws close');
    //trans.reset();
})

ws.on('open', () => {
    console.log('ws open');
    //trans.reset();
})
ws.on('pipe', () => {
    console.log('ws pipe');
    //trans.reset();
})*/
/*trans.on('data', (data) => {
    ws.write(data);
})

rs.on('data', (data) => {
    trans.write(data);
});
rs.on('end', () => {
    console.log('rs end');
    trans.end();
});*/

rs.pipe(trans).pipe(ws);
//rs.pipe(trans).pipe(ws);

/*setTimeout(() => {
    //trans.setRatio(0.5);
}, 2000)

setInterval(() => {
    trans.reset();
}, 500)*/
