const GigabotSensor = require('./GigabotSensor');
const InputSmoothing = require('./InputSmoothing');

class GigabotIRSensor extends GigabotSensor {
    constructor(ev3devSensor) {
        super(ev3devSensor);
        this.previousValue = 0;
        this.inputSmoothing = new InputSmoothing(5);
    }

    update() {
        if (this.connected) {
            this.previousValue = this.inputSmoothing.rawAverage;
            let currentValue = this.ev3devSensor.proximity;
            this.inputSmoothing.add(currentValue);
           // console.log(`raw: ${currentValue} avg: ${this.inputSmoothing.rawAverage} ema: ${this.inputSmoothing.ema}`);
        }
    }

    get rawProximity() {
        if (this.connected) {
            return this.ev3devSensor.proximity;
        }
        else {
            return -1;
        }
    }

    get proximity() {
        return this.inputSmoothing.rawAverage;
    }

}

module.exports = GigabotIRSensor;