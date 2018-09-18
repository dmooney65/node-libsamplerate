const SampleRate = require('../index.js');
const helper = require('./testHelpers');
const assert = require('assert');
const sinon = require('sinon');

describe('SampleRate event tests', function () {

    var resample;
    var gen;
    var nullStream

    afterEach(function () {
        resample.destroy();
        gen.destroy();
        nullStream.destroy();
    });

    it('should resample witn SRC_SINC_BEST_QUALITY', function (done) {
        this.timeout(10000);
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_SINC_BEST_QUALITY;
        var genTotal = 0;
        var resampleTotal = 0;
        var ratio = opts.toRate / opts.fromRate;

        var doAssert = () => {
            if (opts.fromDepth == 16 && opts.toDepth != 16) {
                resampleTotal = resampleTotal / 2;
            }
            if (opts.fromDepth != 16 && opts.toDepth == 16) {
                resampleTotal = resampleTotal * 2;
            }
            var testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        
        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();
        
        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });
});