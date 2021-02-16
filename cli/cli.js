const logger = require('../logger.js')
const state = require('./state.js')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

class csvCli {

    /**
     * @namespace
     * Creates a command line interface for executing cli commands
     */
    constructor() {
        this.state = new state.InitialState(this);
    }
    async run() {
        await this.state.run();
    }
    async getInput() {
        await rl.question('> ', (data) => {
            this.state.execute(data);
            rl.close();
        })
    }
    log(text,color) {
        logger(text,color);
    }
    exit() {
        process.exit();
    }
}

module.exports = csvCli;