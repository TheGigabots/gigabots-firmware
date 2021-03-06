"use strict";
const ev3dev = require('ev3dev-lang');
const Motor = ev3dev.Motor;
const TouchSensor = ev3dev.TouchSensor;
const InfraredSensor = ev3dev.InfraredSensor;
const ColorSensor = ev3dev.ColorSensor;
const UltrasonicSensor = ev3dev.UltrasonicSensor;
const fs = require('fs');
const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;
const GigabotIRSensor = require('./input/GigabotIRSensor');

/***
 * @emits motorChange
 * @emits touchSensorChange ( input, value )
 */
class Devices {
    constructor() {
        this.eventEmitter = new EventEmitter();

        this._motorPorts = [];
        this._sensorPorts = [];
        this._sensors = [];

        this.irSensor = null;
        this.touchSensorProxy = null;
        this.colorSensorProxy = null;
        this.ulrasonicSensorProxy = null;


        this.initMotors();
        this.setupUpdate();

        setInterval(() => {
            this.setupUpdate();
        }, 10000)


        setInterval(() => {
            this.update();
        }, 100)
    }


    initMotors() {
        this._a = new ProxyMotor(new Motor(ev3dev.OUTPUT_A));
        this._b = new ProxyMotor(new Motor(ev3dev.OUTPUT_B));
        this._c = new ProxyMotor(new Motor(ev3dev.OUTPUT_C));
        this._d = new ProxyMotor(new Motor(ev3dev.OUTPUT_D));
    }


    setupUpdate() {

        const motorDir = '/sys/class/tacho-motor';

        fs.readdir(motorDir, (err, d) => {

            if (!_.isEqual(d, this._motorPorts)) {
                this._motorPorts = d;
                this.initMotors();
                this.eventEmitter.emit('motorChange');
            }
        })

        fs.readdir('/sys/class/lego-sensor', (err, d) => {
            if (!_.isEqual(d, this._sensorPorts)) {
                this._sensorPorts = d;
                this.mapSensors();

            }
        })
    }

    /**
     * This is a polling loop for the sensors.
     */
    update() {

        if (this.irSensor) {
            this.irSensor.update();
            const prev = Math.round(this.irSensor.previousValue);
            const curr = Math.round(this.irSensor.proximity);
            if (prev !== curr) {
                this.eventEmitter.emit('infraredSensorChange', this.irSensor.ev3devSensor.address, curr);
            }
        }

        if (this.touchSensorProxy && this.touchSensorProxy.sensor.connected) {
            let currentValue = this.touchSensorProxy.sensor.isPressed;
            if (currentValue != this.touchSensorProxy.previousValue) {
                this.touchSensorProxy.previousValue = currentValue;
                this.eventEmitter.emit('touchSensorChange', this.touchSensorProxy.sensor.address, currentValue);
            }
        }

        if (this.colorSensorProxy && this.colorSensorProxy.sensor.connected) {
            let currentValue = this.colorSensorProxy.sensor.color;

            if (currentValue != this.colorSensorProxy.previousValue) {
                this.colorSensorProxy.previousValue = currentValue;
                this.eventEmitter.emit('colorSensorChange', this.colorSensorProxy.sensor.address, currentValue);
            }
        }


        if (this.ulrasonicSensorProxy && this.ulrasonicSensorProxy.sensor.connected) {
            let currentValue = this.ulrasonicSensorProxy.sensor.distanceCentimeters;

            if (currentValue != this.ulrasonicSensorProxy.previousValue) {
                this.ulrasonicSensorProxy.previousValue = currentValue;
                this.eventEmitter.emit('ultrasonicSensorChange', this.ulrasonicSensorProxy.sensor.address, currentValue);
            }
        }

    }

    get touchSensorValue() {
        if (this.touchSensorProxy && this.touchSensorProxy.sensor.connected) {
            return this.touchSensorProxy.sensor.isPressed;
        }
        else {
            return false;
        }
    }

    tryMapSensor(input) {
        let sensor = null;

        sensor = new InfraredSensor(input);

        if (sensor.connected) {
            this.irSensor = new GigabotIRSensor(sensor);
            return sensor;
        }

        sensor = new TouchSensor(input);

        if (sensor.connected) {
            this.touchSensorProxy = new TouchSensorProxy(sensor);
            return sensor;
        }


        sensor = new ColorSensor(input);

        if (sensor.connected) {
            this.colorSensorProxy = new ColorSensorProxy(sensor);
            return sensor;
        }


        sensor = new UltrasonicSensor(input);

        if (sensor.connected) {
            this.ulrasonicSensorProxy = new UltrasonicSensorProxy(sensor);
            return sensor;
        }


        //Bail
        return new ProxySensor(input);
    }

    mapSensors() {
        this.touchSensorProxy = null;
        this.irSensor = null;
        this._sensors.push(this.tryMapSensor(ev3dev.INPUT_1));
        this._sensors.push(this.tryMapSensor(ev3dev.INPUT_2));
        this._sensors.push(this.tryMapSensor(ev3dev.INPUT_3));
        this._sensors.push(this.tryMapSensor(ev3dev.INPUT_4));
        this.eventEmitter.emit('sensorChange');
    }

    printSensor(s) {
        if (s.connected) {
            console.log("Sensor() ")
            console.log(`\t ${s.driverName}`);
            console.log(`\t ${s.address}`);

            if (s.driverName == 'lego-ev3-color') {
                this.printColorSensor(s);
            }

        }
    }

    printColorSensor(s) {
        console.log(`\t color: ${s.color}`)
        console.log(`\t `)
    }


    printSensors() {
        this._sensors.map((s) => {
            this.printSensor(s);
        })
    }

    //Call stop on all motors.
    allStop() {
        this.A.stop();
        this.B.stop();
        this.C.stop();
        this.D.stop();
    }


    get A() {
        return this._a;
    }

    get B() {
        return this._b;
    }

    get C() {
        return this._c;
    }

    get D() {
        return this._d;
    }

    getSensorByInput(input) {
        let sensor = _.find(this._sensors, (s) => {
            if (s.connected && s.address === input) {
                return s;
            }
        })

        if (sensor == null) {
            return new ProxySensor();
        }
        else {
            return sensor;
        }
    }

    getSensorByDriver(driverName) {
        let sensor = _.find(this._sensors, (s) => {
            if (s.connected && s.driverName === driverName) {
                return s;
            }
        })

        if (sensor == null) {
            return new ProxySensor();
        }
        else {
            return sensor;
        }
    }


    get IN1() {
        return this.getSensorByInput(ev3dev.INPUT_1);
    }

    get IN2() {
        return this.getSensorByInput(ev3dev.INPUT_2);
    }

    get IN3() {
        return this.getSensorByInput(ev3dev.INPUT_3);
    }

    get IN4() {
        return this.getSensorByInput(ev3dev.INPUT_4);
    }


    get motorPorts() {
        return this._motorPorts;
    }

    get sensors() {
        return this._sensors;
    }


    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
}


class ProxyMotor {

    constructor(motor) {
        this.motor = motor;
    }

    async runForTime(timeMs, speed) {
        if (this.motor.connected) {
            this.motor.start(speed);
            await this.wait(timeMs);
            this.motor.stop();
            return;
        }
        else {
            return;
        }
    }

    get connected() {
        return this.motor.connected;
    }

    get polarity() {
        return this.motor.polarity;
    }

    set polarity(p) {
        this.motor.polarity = p;
    }

    start(speed) {
        if (this.motor.connected) {
            this.motor.start(speed);
        }
    }

    stop() {
        if (this.motor.connected) {
            this.motor.stop()
        }
    }

    async wait(duration) {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, duration)
        })
    }
}

class ProxySensor {

    get driverName() {
        return "proxy-driver"
    }

    get address() {
        return "none"
    }

    get connected() {
        return false;
    }
}

class TouchSensorProxy {
    constructor(sensor) {
        this.sensor = sensor;
        this.previousValue = this.sensor.isPressed;
    }
}

class ColorSensorProxy {
    constructor(sensor) {
        this.sensor = sensor;
        this.previousValue = sensor.color;
    }
}

class UltrasonicSensorProxy {
    constructor(sensor) {
        this.sensor = sensor;
        this.previousValue = sensor.distanceCentimeters;
    }
}

module.exports = new Devices();
