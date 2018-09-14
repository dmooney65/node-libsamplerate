# node-libsamplerate
Native implementation of libsamplerate as a Transform stream. Built from the latest [libsamplerate](https://github.com/erikd/libsamplerate) code. Uses [N-API](https://nodejs.org/api/n-api.html), [node-addon-api](https://www.npmjs.com/package/node-addon-api) and [cmake-js](https://www.npmjs.com/package/cmake-js).

## Introduction
Allows the upsampling/downsampling and/or upconverting/downconverting to/from arbitrary sample rates to/from 16 or 32 bits per sample. Tested on Linux (x64 and arm), Windows and MacOS.


## Install
```
npm install node-libsamplerate --save
```
Requires `cmake` and a valid toolchain to build. Installation of `libsamplerate` is not required.

For Windows, install the Visual C++ build tools and download cmake from [cmake.org](https://cmake.org/download/).

To build locally a recursive clone is required:

```
git clone https://github.com/dmooney65/node-libsamplerate.git --recursive
cd node-libsamplerate
npm install
```

## Usage
Include module;
`const SampleRate = require('node-libsamplerate');`

Instantiate:
`const resample = new SampleRate(options);`
where options is an object of the form:
```
let options = {
    // Value can be from 0 to 4 or using enum. 0 is the best quality and the slowest.
    type: SampleRate.SRC_SINC_MEDIUM_QALITY,
    // Stereo
    channels: 2,
    // Sample rate of source
    fromRate: 48000,
    // bit depth of source. Valid values: 16 or 32
    fromDepth: 16,
    // Desired sample rate
    toRate: 44100,
    // Desired bit depth. Valid values: 16 or 32
    toDepth: 16
}
```
Input should be from a readable stream, output should be to a writeable stream: e.g.

```
const fs = require('fs');
let rs = fs.createReadStream('input.pcm');
let ws = fs.createWriteStream('output.pcm');

rs.pipe(resample).pipe(ws);
```
NOTE: if reading from a WAV file, start the read at 44 bytes to avoid the wav header (`{start:44}` for `fs.createReadStream`).
If recording from `arecord`, `sox` or similar, use format `raw`.

