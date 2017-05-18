"use strict";

const ev3dev = require('ev3dev-lang');

class Leds {
    constructor() {
        this.left = new LED('left');
        this.right = new LED('right');
    }
}

class LED {

    constructor(name) {
        this.name = name;
    }

    setColor(color) {

        let c = [0, 0];

        switch (color) {
            case 'red':
                c = [1, 0];
                break;
            case 'green':
                c = [0, 1];
                break;
            case 'off':
                c = [0, 0];
                break;
            default:
                c = [0, 0];
                break;
        }

        ev3dev.Ev3Leds[this.name].setColor(c);
    }
}

module.exports = Leds;