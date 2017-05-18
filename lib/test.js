/**
 * This is for testing out sensor activity quickly.
 * Need to come up with a good way to switch between
 * this and the main script using npm cmd.  Right now
 * you have to change the webpack.config.js
 */
"use strict";
require("babel-polyfill"); //Dont comment out or delete!
const Devices = require('./Devices');
const ev3dev = require('ev3dev-lang');
require('source-map-support').install();


Devices.on('sensorChange', () => {
    console.log("SENSORTS CHANGED!")
})


Devices.on('touchSensorChange', (port, pressed) => {
    console.log(`Touch sensor ${port}  value ${pressed}`)
})


Devices.on('infraredSensorChange', (port, value) => {
    console.log(`IR Sensor ${port}  value ${value}`);
});

Devices.on('colorSensorChange', (port, value) => {
    console.log(`Color Sensor ${port} color ${value}`);
})

Devices.on('ultrasonicSensorChange', (port, value) => {
    console.log(`Ultrasonic Sensor ${port} value ${value}`);
})


setInterval(() => {
    console.log("Printing sensors");
    Devices.printSensors();
}, 5000)






