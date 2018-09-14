/* dmooney65 - Modified to work with 24bit
 * This file is here purely for testing purposes.
 * /

/*
 * WaveHeader
 *
 * writes a pcm wave header to a buffer + returns it
 *
 * taken form
 * from github.com/tooTallNate/node-wav
 * lib/writer.js
 *
 * the only reason for this module to exist is that i couldn't
 * understand how to use the one above, so I made my own.
 * You propably wanna use that one
 */
module.exports = generateHeader = (length, options) => {
    options = options || {};
    var RIFF = Buffer.from('RIFF');
    var WAVE = Buffer.from('WAVE');
    var fmt = Buffer.from('fmt ');
    var data = Buffer.from('data');

    var MAX_WAV = 4294967295 - 100;
    var endianness = 'LE';
    var format = 1; // raw PCM
    var channels = options.channels || 1;
    var sampleRate = options.sampleRate || 44100;
    var bitDepth = options.bitDepth || 16;

    var headerLength = 44;
    var dataLength = length || MAX_WAV;
    var fileSize = dataLength + headerLength;
    var header = Buffer.alloc(headerLength);
    var offset = 0;

    // write the "RIFF" identifier
    RIFF.copy(header, offset);
    offset += RIFF.length;

    // write the file size minus the identifier and this 32-bit int
    //debug('Writing filesize: %d", fileSize');
    header['writeUInt32' + endianness](fileSize - 8, offset);
    offset += 4;

    // write the "WAVE" identifier
    WAVE.copy(header, offset);
    offset += WAVE.length;

    // write the "fmt " sub-chunk identifier
    fmt.copy(header, offset);
    offset += fmt.length;

    // write the size of the "fmt " chunk
    // XXX: value of 16 is hard-coded for raw PCM format. other formats have
    // different size.
    header['writeUInt32' + endianness](16, offset);
    offset += 4;

    // write the audio format code
    header['writeUInt16' + endianness](format, offset);
    offset += 2;

    // write the number of channels
    header['writeUInt16' + endianness](channels, offset);
    offset += 2;

    // write the sample rate
    header['writeUInt32' + endianness](sampleRate, offset);
    offset += 4;

    // write the byte rate
    var byteRate;// = sampleRate * channels * bitDepth / 8;
    var blockAlign;
    if(bitDepth == 16){
        byteRate = sampleRate * channels * 2;
        blockAlign = channels * 2;
    } else {
        byteRate = sampleRate * channels * 4;
        blockAlign = channels * 4;
    }
    header['writeUInt32' + endianness](byteRate, offset);
    offset += 4;

    // write the block align
    
    header['writeUInt16' + endianness](blockAlign, offset);
    offset += 2;

    // write the bits per sample
    header['writeUInt16' + endianness](bitDepth, offset);
    offset += 2;

    // write the "data" sub-chunk ID
    data.copy(header, offset);
    offset += data.length;

    // write the remaining length of the rest of the data
    header['writeUInt32' + endianness](dataLength, offset);
    offset += 4;

    // flush the header and after that pass-through "dataLength" bytes
    return header;
};