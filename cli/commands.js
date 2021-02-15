class Command {

    constructor(regex) {
        this.regex = regex;
    }
    onAction(callback) {
        this.cb = callback;
    }
    test(str) {
        if(this.regex.test(str)) {
            if(!(this.cb)) {
                return true;
            }
            else {
                return this.cb();
            }
        }
        else {
            return false;
        }
    }

}

const commands = {
    "help": new Command(/(help|h)/i),
    "exit": new Command(/(exit|quit)/i)
}

module.exports = commands;