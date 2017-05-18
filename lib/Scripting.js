"use strict";
const fs = require('fs');
const _eval = require('eval');
const SCRIPTFILE = './script/default.js';
const EXPORTSFILE = './script/exports.js';
const SCRIPTNAME = 'botscript.js';


class Scripting {
    constructor() {
        this.script = null;
        this.__global = {
            timeouts: new Set(),
            intervals: new Set()
        };
    }

    load(bot, friends) {
        return new Promise((resolve, reject) => {

            var __global = this.__global;

            let globals = {
                setTimeout: function (fn, delay) {
                    __global.timeouts.add(setTimeout(fn, delay));
                },
                setInterval: function (fn, delay) {
                    __global.intervals.add(setInterval(fn, delay));
                },
                __global: this.__global,
                bot: bot
            };

            friends.forEach((api) => {
                globals[api.shortCode] = api;
            })

            fs.readFile(EXPORTSFILE, (err, exports) => {
                if (err) {
                    reject(err);
                    return;
                }

                fs.readFile(SCRIPTFILE, (err, file) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let src = file.toString();
                    src += exports.toString();

                    try {
                        this.script = _eval(src, SCRIPTNAME, globals);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    resolve();
                })
            })
        })
    }

    execute() {
        this.stop();

        if (this.script) {
            if (this.script.onStart != null) {
                try {
                    this.script.onStart(() => {
                        if (this.script.onRun) {
                            try {
                                this.script.onRun();
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            else if (this.script.onRun) {
                this.script.onRun();
            }
        }

    }

    stop() {
        this.__global.intervals.forEach((i) => clearInterval(i));
        this.__global.timeouts.forEach((t) => clearTimeout(t));
        this.__global.timeouts.clear();
        this.__global.intervals.clear();
    }

    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }

    write(src) {
        return new Promise((resolve, reject) => {
            fs.writeFile(SCRIPTFILE, src, (err) => {
                if (err) {
                    reject();
                }
                else {
                    resolve();
                }
            })
        })
    }
}

module.exports = Scripting;