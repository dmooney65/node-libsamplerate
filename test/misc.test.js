const SampleRate = require('../index.js');
const helper = require('./testHelpers');
const assert = require('assert');
const sinon = require('sinon');



describe('SampleRate misc tests', function () {

    var resample;
    var gen;
    var nullStream;

    afterEach(function () {

    });

    it('should apply new ratio', function (done) {
        this.timeout(10000);
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        var genTotal = 0;
        var resampleTotal = 0;
        var ratio = 0.5;

        var doAssert = () => {
            var testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            resample.destroy();
            gen.destroy();
            nullStream.destroy();
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

        resample.on('pipe', (data) => {
            resample.setRatio(0.5);
        })

        resample.on('data', (data) => {
            resampleTotal += data.length;
        })

        nullStream.on('end', doAssert);

        resample.on('end', () => {
            eventSpy();
        });

        gen.pipe(resample).pipe(nullStream);
    });

    it('should throw error with invalid fromDepth', function (done) {
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.fromDepth = 20;
        assert.throws(() => { helper.getResampler(opts) }, Error);
        done();
    });

    it('should throw error with invalid toDepth', function (done) {
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.toDepth = 20;
        assert.throws(() => { helper.getResampler(opts) }, Error);
        done();
    });
});