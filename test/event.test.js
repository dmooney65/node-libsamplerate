const helper = require('./testHelpers');
const assert = require('assert');
const sinon = require('sinon');

describe('SampleRate events', function () {

    var resample;
    var gen;
    var nullStream

    afterEach(function () {
        resample.on('close', () => {
            //console.log('close');
        });
        resample.destroy();
        gen.destroy();
        nullStream.destroy();
    });

    it('should fire pipe event', function (done) {
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));

        var doAssert = () => {
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }

        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();

        gen.on('end', doAssert);

        resample.on('pipe', () => {
            eventSpy();
        })

        gen.pipe(resample).pipe(nullStream);
    });

    it('should fire unpipe event', function (done) {
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));

        var doAssert = () => {
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }

        resample = helper.getResampler(opts);
        gen = helper.getGenerator(opts);
        nullStream = helper.getNullstream();

        gen.on('end', doAssert);

        resample.on('unpipe', () => {
            eventSpy();
        })

        gen.pipe(resample).pipe(nullStream);
    });

    it('should fire finish event', function (done) {
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));

        var doAssert = () => {
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

        resample.on('end', doAssert);

        resample.on('finish', () => {
            eventSpy();
        })

        gen.pipe(resample).pipe(nullStream);
    });

    it('should fire end event', function (done) {
        var eventSpy = sinon.spy();
        var opts = JSON.parse(JSON.stringify(helper.defaultOpts));

        var doAssert = () => {
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

        resample.on('end', () => {
            eventSpy();
            nullStream.end();
        });

        nullStream.on('end', doAssert);

        gen.pipe(resample).pipe(nullStream);
    });

});