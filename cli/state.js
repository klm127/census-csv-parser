let Command = require('./command.js')

class State {
    /**
     * 
     * @param {csvCli} cli - a command line interface
     */
    constructor(cli) {
        this.cli = cli;
        this.commands = [];
        const exit = new Command(/(exit|quit|q|)/i, cli.exit)
        this.commands.push(exit);
    }
    async run() {
    }
    execute(data) {
        this.testCommands(data);
    }
    testCommands(str) {
        for(let com of this.commands) {
            if(com instanceof Command) {
                if(com.test(str) == true) {
                    break;
                }
            }
        }
    }
}

class InitialState extends State{
    constructor(cli) {
        super(cli);
        cli.log(': csv-census-parser CLI initialized :','cyan')
    }
    async run() {
        this.cli.log('initial state entered','green')
        await this.cli.getInput();
    }
}

module.exports = {
    "State": State,
    "InitialState": InitialState
}