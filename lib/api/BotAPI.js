const ev3dev = require('ev3dev-lang');

/**
 * This is the gigabot api for javascript
 */
class BotAPI {
    constructor(brain) {
        this.brain = brain;
    }

    get sensors() {
        throw new Error("Implement Me")
    }

    log(text) {
        throw new Error("Implement Me")
    }

    beep(freq, length) {
        throw new Error("Implement Me")
    }

    touchSensor() {
        throw new Error("Implement Me")
    }

    async wait(duration) {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, duration)
        })
    }

    //TODO support multiple sensors of same type
    irSensor() {
        throw new Error("Implement Me")
    }

    //TODO support multiple sensors of same type
    ultrasonicSensor() {
        throw new Error("Implement Me")
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
        throw new Error("Implement Me")
    }
}

module.exports = BotAPI;
