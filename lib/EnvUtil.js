
class EnvUtil {
    getBotEnv() {
        return process.env['BOT_ENV']
    }

    isEv3Env() {
        return this.getBotEnv() === 'ev3';
    }
}

module.exports= new EnvUtil();