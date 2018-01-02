class GigabotSensor {

    constructor(ev3devSensor) {
        this.ev3devSensor = ev3devSensor;
    }

    get connected() {
        return this.ev3devSensor.connected;
    }

    update() {
        throw new Error("Override me");
    }
}

module.exports = GigabotSensor;