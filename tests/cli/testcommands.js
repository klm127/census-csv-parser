const assert = require('assert')
const commands = require('../../cli/commands.js')
const log = require('../../logger.js')

//test command parsing
assert(commands["help"].test("HeLP") == true, "Command didn't return true for basic regex test.")
log('Basic regex test in command works','green')
let testcb = function() { return 5};
commands["help"].onAction(testcb);
assert(commands["help"].test("help") == 5, "Command didn't call back the function.")
log('Basic callback test in command works','green')