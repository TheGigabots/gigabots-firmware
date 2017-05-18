/*

 The MIT License (MIT)

 Copyright (c) 2015 donwojtallo

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 https://github.com/donwojtallo/ev3dev-snake-js/blob/master/classes/buttons.js

 */

"use strict";
var fs = require("fs");

var keysEventsFile = '/dev/input/by-path/platform-gpio-keys.0-event';

exports.UP = 103;
exports.DOWN = 108;
exports.LEFT = 105;
exports.RIGHT = 106;
exports.ENTER = 28;
exports.ESCAPE = 14;

var lastKey = false;
var exitButton,
    exitCallback;
var privateCallback;
var enabled = false;


exports.exitButton = function(button, callback) {
    exitButton = button;
    exitCallback = callback;
}

exports.getLastKey = function(stopReading) {
    if (typeof stopReading != 'undefined' && stopReading == true) {
        enabled = false;
    }
    return lastKey;
}

exports.enable = function() {
    enabled = true;
    read();
}

var read = function() {
    fs.open(keysEventsFile, "r", function(error, fd) {
        if (error) {
            console.log(error);
        }
        var buffer = new Buffer(16);

        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
            var code = buffer.readUInt16LE(10);
            var value = buffer.readUInt32LE(12);
            lastKey = code;
            //console.log('code: ' + code + '; value: ' + value);

            fs.close(fd);

            if (lastKey == exitButton) {	// escape terminates buttons thread
                exitCallback();
            } else {
                read();
            }
        });
    });
}