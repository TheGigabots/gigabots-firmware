"use strict";
const ev3dev = require('ev3dev-lang');
const BigBang = require('bigbang.io');
const Devices = require('./Devices');
const readline = require("readline");
const retry = require('retry');
const fs = require('fs');
const buttons = require('./buttons');
const LocalBotApi = require('./api/LocalBotAPI');
const RemoteBotApi = require('./api/RemoteBotAPI');
const Scripting = require("./Scripting");
const figlet = require('figlet');
const Network = require('./Network');
const ansiEscapes = require('ansi-escapes');
const pjson = require('./../package.json');

const BOT_HOST = 'https://thegigabots.bigbang.io';

const figletOpts = {
    font: 'Standard',
    horizontalLayout: 'fitted',
    verticalLayout: 'default'
}

class Brain {

    constructor() {
        this.logScroll = [];
        this._friends = new Map();
        this.interval = null;
        this.figletText = null;
        this.battery = new ev3dev.PowerSupply();
        this.config = null;
        this.version = pjson.version;

        buttons.exitButton(buttons.ESCAPE, () => {
            this.log("EXITING...")
            process.exit(0);
        });

        if (this.isEv3Env()) {
            buttons.enable();
        }

        this.botApi = new LocalBotApi(this);
        this.scripting = new Scripting();
        this.withShell = false;
    }

    init(withShell) {

        this.withShell = withShell;

        if (withShell) {
            this.shellInit();
        }

        this.readConfig().then(() => {
            this.log(`Brain -> configured as ${this.config.name}`)
            this.client = new BigBang.Client(BOT_HOST)

            this.client.on('disconnected', () => {
                if (this.interval != null) {
                    clearInterval(this.interval);
                    this.interval = null;
                }

                this.log('*** DISCONNECTED ***');
                this.faultTolerantConnect(() => {
                    this.log('*** CONNECTED ***')

                })
            })

            this.faultTolerantConnect(() => {
                this.log('*** CONNECTED ***')
            });
        })

    }

    shellInit() {
        this.rl = readline.createInterface({"input": process.stdin, "output": process.stdout});
        this.rl.prompt();
        this.rl.on('line', (raw) => {
            this.scripting.scriptz(this.botApi, raw)
            this.rl.prompt()
        })

    }

    get botHost() {
        return BOT_HOST;
    }

    get friends() {
        return Array.from(this._friends.values());
    }


    addFriend(shortCode, channel) {
        this._friends.set(shortCode, new RemoteBotApi(this, shortCode, channel));
    }

    removeFriend(shortCode) {
        this.friends.delete(shortCode);
    }

    log(o) {
        if (!this.withShell) {
            this.logScroll.push(o);

            while (this.logScroll.length > 14) {
                this.logScroll.shift();
            }

            if (this.figletText == null) {
                this.figletText = figlet.textSync(this.config.name, figletOpts);
            }

            process.stdout.write(ansiEscapes.clearScreen);
            console.log(this.figletText);
            console.log(`                         v${this.version}`)
            this.logScroll.map((s) => console.log(`[brain] ${s}`));
        }
        else {
            console.log(`[brain] ${o}`)
        }
    }

    createNewBot() {
        return new Promise((resolve, reject) => {
            const rando = this.randomstring(5);
            const c = new BigBang.Client(BOT_HOST);
            c.createDevice(['gigabot', rando], false, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {

                    this.config = {
                        name: rando,
                        id: result.id,
                        secret: result.secret
                    }

                    fs.writeFile('config.json', JSON.stringify(this.config), (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    })
                }
            })
        })
    }

    getBotEnv() {
        return process.env['BOT_ENV']
    }

    isEv3Env() {
        return this.getBotEnv() === 'ev3';
    }

    readConfig() {
        return new Promise((resolve, reject) => {
            fs.exists('config.json', (exists) => {
                if (exists) {
                    fs.readFile('config.json', (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            this.config = JSON.parse(data);
                            resolve();
                        }
                    })
                }
                else {
                    this.createNewBot().then(resolve);
                }
            })
        })
    }


    randomstring(length) {
        const chars = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';

        length = length ? length : 32;

        var string = '';

        for (var i = 0; i < length; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            string += chars.substring(randomNumber, randomNumber + 1);
        }

        return string;
    }


    faultTolerantConnect(done) {
        let operation = retry.operation();
        operation.attempt((currentAttempt) => {
            this.client.connectAsDevice(this.config.id, this.config.secret, (err) => {
                if (operation.retry(err)) {
                    this.log(`'FAILED TO CONNECT -> ${err}`);
                    return;
                }

                new Network(this, this.client).init(() => this.log("Network init()"));
            })
        })
    }


}

module.exports = Brain;