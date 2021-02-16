const assert = require('assert')
const state = require('../../cli/state.js')
const log = require('../../logger.js')
const Cli = require('../../cli/cli.js')

const cli = new Cli();

cli.run().then( ()=>
    { }
).catch( (e) => console.log("error in test") );