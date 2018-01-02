/**
 * This is for testing out sensor activity quickly.
 * Need to come up with a good way to switch between
 * this and the main script using npm cmd.  Right now
 * you have to change the webpack.config.js
 */
"use strict";
require("babel-polyfill"); //Dont comment out or delete!
const Devices = require('./Devices');
//const ev3dev = require('ev3dev-lang');
require('source-map-support').install();

/*&
Devices.on('infraredSensorChange', (port, value) => {
    let sensor = Devices.IN2;

    console.log(`RAW: ${sensor.rawProximity} AVG: ${sensor.proximity}`)
    //console.log(`IR Sensor ${port}  value ${value}`);
});
*/








