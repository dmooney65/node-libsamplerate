
const { Transform } = require('stream');
const SampleRateStream = require('bindings')('node-libsamplerate').SampleRateStream;
const inherits = require('util').inherits;



let defaultOpts = {
    type: 2,
    channels: 2, fromRate: 48000, fromDepth: 16,
    toRate: 44100, toDepth: 16
}

//inherits(SampleRateStream, Transform)

class SampleRate extends Transform {

    constructor(opts) {
        opts = opts || defaultOpts;
        console.log(opts);
        if (!(opts.fromDepth == 16 || opts.fromDepth == 24 || opts.fromDepth == 32)) throw new Error('Invalid source bit depth');
        if (!(opts.toDepth == 16 || opts.toDepth == 24 || opts.toDepth == 32)) throw new Error('Invalid target bit depth');
        super(opts);
        this._samplerate = new SampleRateStream(opts);
    }

    setRatio(ratio) {
        this._samplerate.setRatio(ratio);
    };

    reset() {
        this._samplerate.reset();
    }
    _final(cb){
        console.log('final called');
        this._samplerate.reset();
        cb()
    }
    _transform(chunk, encoding, cb){
        this.push(this._samplerate.transform(chunk));
        cb();
    }
}

module.exports = SampleRate;


module.exports.SRC_SINC_BEST_QUALITY = 0;
module.exports.SRC_SINC_MEDIUM_QUALITY = 1;
module.exports.SRC_SINC_FASTEST = 2;
module.exports.SRC_ZERO_ORDER_HOLD = 3;
module.exports.SRC_LINEAR = 4;

