class Command {

    /**
     * Callback should take the type regex results
     * @param {*} regex 
     * @param {*} callback 
     */
    constructor(regex, callback) {
        this.regex = regex;
        this.cb = callback
    }
    test(str) {        
        if(this.regex.test(str)) {
            let results = str.match(this.regex);
            this.cb(results);
            return true;
        }
        else {
            return false;
        }
    }

}

module.exports = Command;