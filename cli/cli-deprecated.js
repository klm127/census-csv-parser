const log = require('../logger.js')
const util = require('../util.js')
const parser = require('../parser.js')
const fs = require('fs').promises;
const commands = require('./command.js')

const input = process.stdin;
input.setEncoding('utf-8');

class csvCli {

    /**
     * @namespace
     * Creates a command line interface for executing cli commands
     */
    constructor() {
        log(' census-csv-parser command line initialized ','cyan');
        commands['exit'].onAction( () => process.exit());
        this.initialState();
    }
    initialState() {
        log(' type help for options ', 'cyan')
        let cb = this.cbFactory([commands["help"]], [this.printHelp])
        console.log(cb);
        this.getInput(cb);
    }
    cbFactory(commandsArr, callbacksArr) {
        commandsArr.forEach( (command, i) => {
            command.onAction(callbacksArr[i]);
        });
        commandsArr.push(commands['exit']);
        console.log('commandsarr', commandsArr)
        function cb(inp) {
            commandsArr.forEach( (command) => {
                if(command.test(inp) != false) {
                    return;
                }
                else {
                    log('invalid command','red')
                }
            })
        }
        return cb;
    }
    printHelp() {
        console.log('you can do stuff');
    }
    loadedState() {
        console.log('loaded state reached');
    }
    getInput(cb) {
        input.on( 'data', (inp) => {
            cb(inp);
        });
    }

    //get help

    //save config

    //load config

    //states - column set, row set, parser ready


}

module.exports = csvCli;
