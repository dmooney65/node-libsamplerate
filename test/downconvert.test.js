const SampleRate = require('../index.js');
const helper = require('./testHelpers.js');
const assert = require('assert');
const sinon = require('sinon');

describe('SampleRate downconvert tests', function () {

    var resample;
    var gen;
    var nullStream

    afterEach(function () {
        resample.destroy();
        gen.destroy();
        nullStream.destroy();
    });

    it('should downconvert and downsample', function (done) {
        this.timeout(10000);
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_SINC_MEDIUM_QUALITY;
        opts.fromDepth = 32;
        var genTotal = 0;
        var resampleTotal = 0;
        var ratio = opts.toRate / opts.fromRate;

        var doAssert = () => {
            // Total samples post resample will be half the size
            resampleTotal = resampleTotal * 2;
            
            var testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
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

    it('should downconvert and upsample', function (done) {
        this.timeout(10000);
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));
        opts.type = SampleRate.SRC_SINC_MEDIUM_QUALITY;
        opts.fromDepth = 32;
        opts.toRate = 88200;
        var genTotal = 0;
        var resampleTotal = 0;
        var ratio = opts.toRate / opts.fromRate;

        var doAssert = () => {
            // Total samples post resample will be half the size
            resampleTotal = resampleTotal * 2;
            
            var testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
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