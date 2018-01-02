const _ = require("lodash");


class InputSmoothing {
    constructor(smoothingArraySize) {
        this.values = [];
        this.smoothingArraySize = smoothingArraySize;
        this.previousEMA = 0;
    }

    add(value) {
        this.values.push(value);
        while (this.values.length > this.smoothingArraySize) {
            this.values.shift();
        }
    }

    get rawAverage() {

        if (this.values.length === 0) {
            return 0;
        }

        let sum = _.reduce(this.values, (sum, n) => {
            return sum + n;
        })

        return sum / this.values.length;
    }

    get ema() {
        let ema = this.calcEma(this.values, 4);
        return ema[ema.length-1];
    }

    calcEma(mArray, mRange) {
        var k = 2 / (mRange + 1);
        // first item is just the same as the first item in the input
        let emaArray = [mArray[0]];
        // for the rest of the items, they are computed with the previous one
        for (var i = 1; i < mArray.length; i++) {
            emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
        }
        return emaArray;
    }

}

module.exports = InputSmoothing

