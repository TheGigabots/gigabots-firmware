const BotAPI = require('./BotAPI');
const Sound = require('./../Sound');
const Leds = require('./../Leds');
const Devices = require('./../Devices')
const ev3dev = require('ev3dev-lang');

class LocalBotAPI extends BotAPI {
    constructor(brain) {
        super(brain);
        this.speech = new Speech();
        this.drive = new Drive(this);
        this.leds = new Leds();
        this.battery = new Battery;
        this.motors = new Motors(this);
        this._sensors = new Sensors(this);
        this.brain = brain;
    }

    get sensors() {
        return this._sensors;
    }

    log(text) {
        this.brain.log(`[bot] ${text}`);
    }

    beep(freq, length) {
        Sound.beep(freq, length);
    }
}
class Drive {

    constructor(api) {
        this.api = api;
        this.leftDrive = Devices.A;
        this.leftReverse = false;
        this.rightDrive = Devices.B;
        this.rightReverse = true;
    }

    toPolarity(reverse) {
        return reverse == true ? 'inversed' : 'normal';
    }

    forward(speed) {
        this.leftDrive.polarity = this.toPolarity(this.leftReverse);
        this.rightDrive.polarity = this.toPolarity(this.rightReverse);

        this.leftDrive.start(speed);
        this.rightDrive.start(speed);
    }

    backward(speed) {
        this.leftDrive.polarity = this.toPolarity(!this.leftReverse);
        this.rightDrive.polarity = this.toPolarity(!this.rightReverse);

        this.leftDrive.start(speed);
        this.rightDrive.start(speed);
    }


    left(speed) {
        this.leftDrive.polarity = this.toPolarity(!this.leftReverse);
        this.rightDrive.polarity = this.toPolarity(this.rightReverse);

        this.leftDrive.start(speed);
        this.rightDrive.start(speed);
    }

    right(speed) {
        this.leftDrive.polarity = this.toPolarity(this.leftReverse);
        this.rightDrive.polarity = this.toPolarity(!this.rightReverse);

        this.leftDrive.start(speed);
        this.rightDrive.start(speed);
    }


    leftOutput(drive, reverse) {
        this.leftDrive = Devices[drive];
        this.leftReverse = reverse;
    }

    rightOutput(drive, reverse) {
        this.rightDrive = Devices[drive];
        this.rightReverse = reverse;
    }

    stop(speed) {
        this.leftDrive.stop();
        this.rightDrive.stop();
    }
}


class Motors {
    constructor(api) {
        this.api = api;
    }

    allStop() {
    }

    get a() {
        return Devices.A;
    }

    get A() {
        return Devices.A;
    }

    get b() {
        return Devices.B;
    }

    get c() {
        return Devices.C;
    }

    get d() {
        return Devices.D;
    }
}

class Sensors {
    constructor(api) {
        this.api = api;
    }

    get in1() {
        return Devices.IN1;
    }

    get IN1() {
        return Devices.IN1;
    }

    get in2() {
        return Devices.IN2;
    }

    get in3() {
        return Devices.IN3;
    }

    get in4() {
        return Devices.IN4;
    }

    //TODO support multiple sensors of same type
    touchSensor() {
        let sensor = Devices.getSensorByDriver('lego-ev3-touch');
        return sensor.isPressed;
    }

    //TODO support multiple sensors of same type
    irSensor() {
        let sensor = Devices.getSensorByDriver('lego-ev3-ir');
        return sensor.proximity;
    }

    //TODO support multiple sensors of same type
    ultrasonicSensor() {
        let sensor = Devices.getSensorByDriver('lego-ev3-us');
        return sensor.distanceCentimeters;
    }

    /**
     * Color detected by the sensor, categorized by overall value.
     *   - 0: No color
     *   - 1: Black
     *   - 2: Blue
     *   - 3: Green
     *   - 4: Yellow
     *   - 5: Red
     *   - 6: White
     *   - 7: Brown
     */
    colorSensor() {
        let sensor = Devices.getSensorByDriver('lego-ev3-color');
        return sensor.color;
    }
}


class Speech {
    say(text, speed, pitch, formant) {
        Sound.speak(text, speed, pitch, formant);
    }
}


class Battery {
    constructor() {
        this.defaultBattery = new ev3dev.PowerSupply();
    }

    get voltage() {
        return this.defaultBattery.voltageVolts;
    }
}


module.exports = LocalBotAPI;
