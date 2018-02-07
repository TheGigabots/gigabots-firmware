const Devices = require('./Devices');
const BigBang = require('bigbang.io');
const Sound = require('./Sound');
const async = require('async');

class Network {

    constructor(brain, client) {
        this.brain = brain;
        this.client = client;
        this.channel = null;
        this.subQueue = async.queue(this.processSubscribe.bind(this), 1);
    }

    init(done) {
        this.client.getDeviceChannel((channel) => {
            this.channel = channel;

            channel.on('join', (join) => {
                this.maybeRegister(join);
            });

            channel.on('leave', (leave) => {

            });

            channel.on('addNamespace', (channelData) => {
                const ns = channelData.keySpace;

                if (ns === 'friends') {
                    channel.getChannelData(ns).on('add', (k, v) => {
                        this.subscribeFriend(v.id, v.shortCode);
                    })

                    channel.getChannelData(ns).on('update', (k, v) => {

                    })

                    channel.getChannelData(ns).on('remove', (k) => {
                        this.brain.log('Remove friend.')
                    })
                }
            })

            Devices.on('touchSensorChange', (input, value) => {
                let key = input.toString().toUpperCase();
                //this.brain.log(`Touch ${key} -> ${value}`);
                let val = value == true ? 1 : 0;
                this.channel.getChannelData('gigabot').put(key, val);
            })

            Devices.on('infraredSensorChange', (input, value) => {
                let key = input.toString().toUpperCase();
                this.channel.getChannelData('gigabot').put(key, value);
            })

            Devices.on('colorSensorChange', (input, value) => {
                let key = input.toString().toUpperCase();
                this.channel.getChannelData('gigabot').put(key, value);
            })

            Devices.on('ultrasonicSensorChange', (input, value) => {
                let key = input.toString().toUpperCase();
                this.channel.getChannelData('gigabot').put(key, value);
            })


            this.allStats();

            this.interval = setInterval(() => {
                this.allStats();
            }, 30000)

            channel.on('message', (m) => {
                let msg = m.payload.getBytesAsJSON();

                const targetBotId = msg.botId;

                //Ignore messages not for me
                if (this.brain.config.id !== targetBotId) {
                    return;
                }

                const type = msg.type;

                if (type == 'motorStart') {
                    let speed = parseInt(msg.speed);
                    let port = msg.port;
                    let dir = msg.dir;

                    let polarity = 'normal'

                    if (dir == 'r') {
                        polarity = 'inversed'
                    }

                    let motor = Devices[port.toUpperCase()];

                    if (motor.connected) {
                        motor.polarity = polarity;
                        motor.start(speed);
                    }
                }
                else if (type == 'motorStop') {
                    let port = msg.port;
                    let motor = Devices[port.toUpperCase()];

                    if (motor.connected) {
                        motor.stop();
                    }
                }
                else if (type === 'addFriend') {
                    this.addFriend(msg);
                }
                else if (type === 'removeFriend') {
                    this.removeFriend(msg);
                }
                else if (type === 'drive') {
                    this.brain.botApi.drive.raw(msg.left, msg.right)
                }
                else if (type == 'script') {

                    const brain = this.brain;

                    this.brain.log("Loading script");
                    brain.botApi.beep(130, 100);

                    brain.scripting.write(new Buffer(msg.src, 'base64').toString()).then(() => {
                        brain.scripting.load(brain.botApi, brain.friends).then(() => {
                            brain.botApi.beep(261, 300);
                        })
                    })
                }
                else if (type === 'startScript') {
                    this.brain.botApi.beep(4186, 100);
                    this.brain.scripting.execute();
                }
                else if (type === 'stopScript') {
                    this.brain.scripting.stop();
                    Devices.allStop();
                }
                else {
                    this.brain.log("UNKNOWN TYPE " + type);
                }
            })

            done();
        })
    }


    loadScript() {
        const brain = this.brain;

        this.brain.log("Loading script");
        brain.botApi.beep(100, 100);


        brain.scripting.load(brain.botApi, brain.friends).then(() => {
            brain.botApi.beep(5000, 100);
            brain.scripting.execute();
        })
    }


    addFriend(msg) {
        this.getBotByShortCode(msg.friendShortCode).then((devices) => {

            if (devices.devices.length == 1) {
                const device = devices.devices[0];

                if (this.channel) {

                    let friendId = device.id;
                    let data = {id: friendId, shortCode: msg.friendShortCode};
                    this.brain.log(`Adding friend -> ${msg.friendShortCode}`);
                    this.channel.getChannelData("friends").put(data.shortCode, data);
                }
                else {
                    console.warn("Not subscribed to a channel");
                }

                this.subscribeFriend(device.id, msg.friendShortCode);
            }
            else {
                Sound.beep();
            }

        })
    }

    subscribeFriend(deviceId, shortCode) {
        this.subQueue.push({deviceId: deviceId, shortCode: shortCode}, (err) => {
            let channel = this.client.getChannel(deviceId);
            this.brain.addFriend(shortCode, channel);
        })
    }

    processSubscribe(task, done) {
        const deviceId = task.deviceId;
        const shortCode = task.shortCode;

        //Dont double up on subscription activities.
        if (this.client.getChannel(deviceId) != null) {
            done();
            return;
        }

        this.client.subscribe(deviceId, (err, channel) => {
            channel.on('message', (m) => {
                let msg = m.payload.getBytesAsJSON();
                //this.brain.log(`Friend message => ${JSON.stringify(msg)}`);
            })
            done();
        })
    }

    removeFriend(msg) {

        this.getBotByShortCode(msg.friendShortCode).then((devices) => {

            if (devices.devices.length == 1) {
                const device = devices.devices[0];

                if (this.channel) {
                    this.brain.log(`Removing friend -> ${msg.friendShortCode}`);
                    this.channel.getChannelData("friends").remove(msg.friendShortCode);
                }
                else {
                    console.warn("Not subscribed to a channel");
                }

                this.subscribeFriend(device.id, msg.friendShortCode);
            }
            else {
                Sound.beep();
            }
        })
    }

    getBotByShortCode(code) {
        return new Promise((resolve, reject) => {
            const c = new BigBang.Client(this.brain.botHost);
            c.queryDevices([code], (err, response) => {

                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            })
        });
    }

    writeEV3() {

        let stats = {
            id: this.brain.config.id,
            name: this.brain.config.name,
            version: this.brain.version,
            sensors: {
                IN1: {driverName: Devices.IN1.driverName, port: 'IN1'},
                IN2: {driverName: Devices.IN2.driverName, port: 'IN2'},
                IN3: {driverName: Devices.IN3.driverName, port: 'IN3'},
                IN4: {driverName: Devices.IN4.driverName, port: 'IN4'}
            }
        }

        if (this.channel) {
            this.channel.getChannelData('gigabot').put('ev3', stats);
        }
    }

    writePower() {
        let current = 0;
        let voltage = 0;

        if (this.brain.battery.connected) {
            current = this.brain.battery.currentAmps;
            voltage = this.brain.battery.voltageVolts;
        }

        const power = {
            batteryCurrent: current,
            motorCurrent: 0,
            voltage: voltage,
            voltageMillivolt: 0
        }

        if (this.channel) {
            this.channel.getChannelData('gigabot').put('power', power);
        }
    }


    allStats() {
        this.writeEV3();
        this.writePower();
    }

    maybeRegister(clientId) {
        this.channel.getChannelData('gigabot').on('robot', (data, op) => {
            //this.brain.log(data + "" + op);
        })
    }
}

module.exports = Network;
