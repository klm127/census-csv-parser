
let util = require('./util.js')

class Parser {
    /**
     * @namespace
     * @example <caption>Usage</caption>
     * parser = require('./parser.js')
     * util = require('./util.js')
     * ...
     * let myParser = new parser.Parser(myCsvString);
     * myParser.setMeta({"title":"myData","author":"me"}); //optional
     * myParser.setHeaders(0,0); //set the header rows and columns - required
     * myParser.clear(/"/g)  //clear quotes from data array - optional. Be careful clearing before setting headers, some header values may not may properly to objects if not in string format, such as "15-10"
     * myParser.setProps("row"); //set row headers to be the property map source - required
     * myParser.propsToArray(/!!/); //splits header values of the selected prop header to arrays for mapping to properties: POPULATION!!15 AND OVER in header becomes [POPULATION, 15 AND OVER] which will become columnheader.POPULATION["15 AND OVER"] = intersecting_value
     * let json = myParser.mapProps();  
     * @param {Array[] | string} [data=Array[]] The data to give to the parser. For convenience, a csv string may be passed which will be parsed into an Array using the common delimiters '\n' and ','. The arrays should be of equal length.
     * @returns A new Parser object
     * @todo 1. implement error string property
     * @todo 2. wrap all util functions in parser
     */
    constructor(data=[[]]) {
        /** The data array operated on by this Parser. May be referenced for cleaning. 
         * @public 
         * @type {Array[]} 
         * @see util
         */
        this.data = [];
        if(data instanceof Array) {
            this.data = data;
        }
        else if(typeof data == "string"){
            this.data = util.csvArray(data);
        }
        /**@private */
        this.columnHeaders = [];
        /**@private */
        this.rowHeaders = [];
        /**@private */
        this.propArr = 'ROW';
        /**
         * Contains metadata of properties that will be added to the top level JSON object.
         */
        this.metadata = {};
    }
    /**
     * Clears unwanted characters from data array or a portion of that array
     * @param {(string | string[] | RegExp )} [find='"'] - The string, array of strings, or regular expression to remove.
     * @param {boolean} [numerify=true] Calls this.numerify() to also convert any strings that look like numbers into numbers.
     * @param {number} [rowind=-1] - The row to operate on. If -1 (default), it will operate on the entire 2D array.
     * @param {number} [colind=-1] - The column to operate on. If -1 (default), it will operate on the entire 2D array.
     */
    clear(find='"',numerify=true,rowind,colind) {
        this.data = util.clear(this.data,find,rowind,colind);
        if(numerify) {
            this.numerify();
        }
    }
    /**
     * Goes through array and all sub-arrays and converts strings into numbers where it is possible to do so.
     */
    numerify() {
        this.data = util.numerify(this.data);
    }
    /**
     * Sets the internal header arrays and removes those rows and columns from the data. The intersecting element will be removed.
     * @param {integer} [rowIndex=0] The row index of the column headers. Negative will operate from end.
     * @param {integer} [columnIndex=0] The column index of the row headers. Negative will operate from end.
     * @todo implement error string property to log errors in index sizes
     */
    setHeaders(rowIndex=0, columnIndex=0) {
        if(rowIndex < 0) {
            rowIndex = this.data.length + rowIndex;
        }
        if(rowIndex < 0 || rowIndex > this.data.length-1) {
            return;
        }
        this.columnHeaders = this.data[rowIndex].slice(1);
        this.data = util.chop(this.data,rowIndex);
        if(columnIndex < 0) {
            columnIndex = this.data.length + columnIndex;
        }
        if(columnIndex < 0) {
            columnIndex = this.data[0].length + columnIndex;
        }
        if(columnIndex < 0 || columnIndex > this.data.length-1) {
            return;
        }
        this.rowHeaders = util.getColumn(this.data,columnIndex);
        this.data = util.chopColumn(this.data, columnIndex);
    }
    /**
     * Sets either the row headers or the column headers as the one to be mapped - the other column will be the parent object name.
     * @param {string} str A string of either 'ROW' or 'COL' - Parser initializes with this set to ROW. A string other than these will do nothing.
     */
    setProps(str) {
        if(str.toUpperCase == "ROW") {
            this.propArr = str.toUpperCase;
        }
        else if(str.toUpperCase == "COL") {
            this.propArr = str.toUpperCase;
        }
    }
    /**
     * Splits the header column selected by setProps() to an array for mapping to the other column.
     * @param {RegExp} [regex=!!] The regex to split the rows on
     */
    propsToArray(regex = '!!') {
        if(typeof regex == "string") {
            regex = new RegExp(regex,'g');
        }
        let propArr = [];
        if(this.propArr == 'ROW') {
            propArr = this.rowHeaders;
        }
        else {
            propArr = this.columnHeaders;
        }
        propArr = propArr.map( (e) => {
            return e.split(regex);
        });
        if(this.propArr == 'ROW') {
            this.rowHeaders = propArr;
        }
        else {
            this.columnHeaders = propArr;
        }
    }
    /**
     * Maps data to an object. The object will contain a property for each value not in the selected props array. For each array in the selected props array, a chain of sub-properties will be created. Metadata, if extant, will be added as properties to the mother object.
     * So if you have this data:
     * <table>
     * <tr><th>"headers"</th><th>"head1"</th><th>"head2"</th></tr>
     * <tr><th>"prop1::prop2"</th><td>35</td><td>"val2"</td>
     * <tr><th>"prop1::anotherprop"</th><td>"val3"</td><td>5</td></tr>
     * </table>
     * After setting the props array to "Row" and processing to an array, i.e. <br /><code>[ ["prop1","prop2"], ["prop1","anotherprop"] ]</code><br /> using <code>setProps</code> and <code>propsToArray</code>
     * You will have a JSON like the example below.
     * @example <caption>Output JSON</caption>
     * {
     *  "head1": {
     *          "prop1": {
     *                 "prop2":35,
     *                 "anotherprop":"val3"     
     *                   }
     *          },
     *  "head2": {
     *          "prop1": {
     *                 "prop2":"val2",
     *                 "anotherprop":5     
     *                 }
     *          }
     * }
     * @todo implement functionality for setting column headers as the props column
     */
    mapProps() {
        let propsArr = [];
        let objsArr = [];
        if(this.propArr == "ROW") {
            propsArr = this.rowHeaders;
            objsArr = this.columnHeaders;
        }
        else {
            propsArr = this.columnHeaders;
            objsArr = this.rowHeaders;
        }
        let parentObj = JSON.parse(JSON.stringify(this.metadata)); //simple deep copy;
        objsArr = JSON.parse(JSON.stringify(objsArr));
        objsArr.forEach((el,i)=> {
            let data = util.getColumn(this.data,i);
            let o = {};
            o = util.chainMultiple(propsArr,data,o,true);
            parentObj[el] = o;
        });
        return parentObj;
    }
}

module.exports = Parser;
exports.util = util;