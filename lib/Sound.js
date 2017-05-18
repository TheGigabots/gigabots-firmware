const exec = require('child_process').exec;

const EnvUtil = require('./EnvUtil');


//TODO probably add env specific impls in future.
class Sound {
    constructor() {

    }

    speak(text, speed = 175, pitch = 50, formant = 0) {

        let cmd = `/usr/bin/espeak -v en-us+f${formant} -s ${speed} -p ${pitch} --stdout  "${text}" | /usr/bin/aplay -q`


        //Local testing
        if (!EnvUtil.isEv3Env()) {
            cmd = `say "${text}"`;
        }

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }

    rawSpeak(text, espeakOpts = '-a 200 -s 130') {
        const cmd = `/usr/bin/espeak --stdout ${espeakOpts} "${text}" | /usr/bin/aplay -q --device dmix`
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }

    beep(freq = 1000, length = 100) {
        let cmd = `/usr/bin/beep -f ${freq} -l ${length}`

        //Local testing
        if (!EnvUtil.isEv3Env()) {
            cmd = `say "beep"`;
        }

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }
}

module.exports = new Sound();
