const SampleRate = require('../index.js');
const Generator = require('audio-generator/stream');
const BlackHoleStream = require("black-hole-stream");
const assert = require('assert');
const sinon = require('sinon');

let nullStream = new BlackHoleStream();

var options = {
    type: 2,
    channels: 2,
    fromRate: 44100,
    fromDepth: 16,
    toRate: 96000,
    toDepth: 32
}


var generatorOpts = {
    duration: 5,
    bitDepth: options.fromDepth,
    sampleRate: options.fromRate
}


var genFunc = (time) => {
    return [
        Math.sin(Math.PI * 2 * time * 439), //channel 1
        Math.sin(Math.PI * 2 * time * 441), //channel 2
    ]
}


describe('SampleRate()', function () {


    it('should resample correctly', function (done) {
        this.timeout(10000);
        var eventSpy = sinon.spy();

        /*setTimeout(function () {
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }, 6000);*/

        var gen = new Generator(
            genFunc,
            generatorOpts
        );

        var genTotal = 0;
        var resampleTotal = 0;
        var ratio = options.toRate / options.fromRate;

        gen.on('error', (err) => {
            throw err;
        });

        gen.on('end', () => {
            resample.end();
        });

        gen.on('data', (data) => {
            genTotal += data.length;
        });

        var resample = new SampleRate(options);

        resample.on('data', (data) => {
            //console.log(data.length);
            resampleTotal += data.length;
        })

        resample.on('error', (err) => {
            throw err;
        })

        var doAssert = () => {
            console.log('END Event');
            if (options.fromDepth == 16 && options.toDepth != 16) {
                resampleTotal = resampleTotal / 2;
            }
            if (options.fromDepth != 16 && options.toDepth == 16) {
                resampleTotal = resampleTotal * 2;
            }
            var testRatio = resampleTotal / genTotal;
            assert.deepEqual(Number.parseFloat(ratio).toFixed(2), Number.parseFloat(testRatio).toFixed(2));
            eventSpy();
            assert(eventSpy.called, 'Event did not fire in 6000ms.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            done();
        }
        resample.on('end', doAssert);

        gen.pipe(resample).pipe(nullStream);
    });


});