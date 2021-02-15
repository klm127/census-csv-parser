const log = require('../logger.js')
const util = require('../util.js')
const parser = require('../parser.js')
const fs = require('fs').promises;

class csvCli {

    /**
     * @namespace
     * Creates a command line interface for executing cli commands
     */
    constructor() {
        this.state = this.initialState;
        this.loadPath = null;
        this.savePath = null;
        this.dataArray = null;
        this.parser = null;
        while( this.state != null ) {
            this.state = this.state();
        }
        log('thank you for using census csv parser','blue')
    }

    initialState() {
        log(' census-csv-parser command line interface initialized.','cyan')
        this.logStatus();
        log(' Type help to see commands. ', 'cyan')
        return null;
    }
    logStatus() {
        let logString = "";
    }

    //get help

    //save config

    //load config

    //states - column set, row set, parser ready


}

module.exports = csvCli;
