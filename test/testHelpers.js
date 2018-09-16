const SampleRate = require('../index.js');
const Generator = require('audio-generator/stream');
const { Writable } = require('stream');

var defaultOpts = {
    duration: 5,
    type: 4,
    channels: 2,
    fromRate: 48000,
    fromDepth: 16,
    toRate: 44100,
    toDepth: 16
}

var genFunc = (time) => {
    return [
        Math.sin(Math.PI * 2 * time * 439), //channel 1
        Math.sin(Math.PI * 2 * time * 441), //channel 2
    ]
}

var getResampler = (opts) => {
    return new SampleRate(opts);
}

var getGenerator = (opts) => {
    var generatorOpts = {
        duration: opts.duration,
        bitDepth: opts.fromDepth,
        sampleRate: opts.fromRate,
    }
    return new Generator(genFunc, generatorOpts);
}

var getNullstream = () => {
    return new Writable({
        write(chunk, encoding, cb) {
            cb();
        },
        final() {
            process.nextTick(() => {
                this.emit('end');
            });
        }
    });
}

module.exports = {
    defaultOpts: defaultOpts,
    getResampler: getResampler,
    getGenerator: getGenerator,
    getNullstream: getNullstream
}