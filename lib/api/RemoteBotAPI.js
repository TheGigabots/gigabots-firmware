const BotAPI = require('./BotAPI');
const _ = require('lodash');


class RemoteBotAPI extends BotAPI {
    constructor(brain, shortCode, channel) {
        super(brain);
        this.shortCode = shortCode;
        this._sensors = new RemoteSensors(this, channel);
        this.channel = channel;
    }

    get sensors() {
        return this._sensors;
    }

    log(text) {
        this.brain.log(`[${this.shortCode}] ${text}`);
    }
}

class RemoteSensors {
    constructor(api, channel) {
        this.api = api;
        this.channel = channel;
    }

    getSensorByDriver(driver) {

        let ev3 = this.channel.getChannelData('gigabot').get('ev3');


        if (ev3 && ev3.sensors) {
            return _.find(_.values(ev3.sensors), (s) => {
                return s.driverName === driver;
            })
        }
        else {
            return null;
        }
    }

    touchSensor() {
        let s = this.getSensorByDriver('lego-ev3-touch')

        //woo!
        if (s) {
            const port = s.port;
            let v = this.channel.getChannelData('gigabot').get(port);
            return v == 1 ? true : false;
        }
        else {
            return false;
        }
    }

    irSensor() {

        let s = this.getSensorByDriver('lego-ev3-ir')

        if (s) {
            const port = s.port;
            let v = this.channel.getChannelData('gigabot').get(port);
            return v;
        }
        else {
            return 0;
        }

    }

    ultrasonicSensor() {

        let s = this.getSensorByDriver('lego-ev3-us')

        if (s) {
            const port = s.port;
            let v = this.channel.getChannelData('gigabot').get(port);
            return v;
        }
        else {
            return 0;
        }

    }

    colorSensor() {
        let s = this.getSensorByDriver('lego-ev3-color')

        if (s) {
            const port = s.port;
            let v = this.channel.getChannelData('gigabot').get(port);
            return v;
        }
        else {
            return 0;
        }
    }


}

module.exports = RemoteBotAPI;
