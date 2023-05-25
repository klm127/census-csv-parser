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
 * */
export class Parser {

    /** The underlying array data from the parser. */
    get data() : any[][]
    /**
     * Constructs a new parser. 
     * @param {Array[] | string} [data=Array[]] The data to give to the parser. For convenience, a csv string may be passed which will be parsed into an Array using the common delimiters '\n' and ','. The arrays should be of equal length.
     * @returns A new Parser object
     */
    constructor(data: any[][]);
    /**
     * Chops a row from the data array in parser. Also removes those indices from the RowHeaders.
     * @param {(number | number[] | RegExp) } find The row index to remove, an array of row indexes to remove, or a regular expression. If a regular expression is passed, all rows that match the regex will be removed. Numbers may be negative to operate from the end.
     * @param {number | string} [regindex=0] The **column** index to search when using regular expressions. Defaults to the first column, index 0. If a string, such as "HEADER" is passed, the row header array will be searched instead.
     * @memberof Parser
     */
    chop(find:number|number[]|RegExp, regindex:number|string): void;
    
    /**
     * Chops a column from an array
     * @param {(number | number[] | RegExp)} find The column index to remove, an array of column indexes to remove, or a regular expression. If a regular expression is passed _all_ columns that match on the RegIndex row will be removed. Negative numbers will operate from the last column backwards. 
     * @param {number | string} [regIndex=0] The **row** index to search when using regular expressions as the find parameter. Defaults to first row, index 0. Can also pass in the string "HEADER" to search the header row.
     * @memberof Parser
     */
    chopColumn(find:number|number[]|RegExp, regIndex:number|"HEADER"): void;
    /**
    * Clears unwanted characters from data array or a portion of that array
    * @param {(string | string[] | RegExp )} [find='"'] - The string, array of strings, or regular expression to remove.
    * @param {boolean} [numerify=true] Calls this.numerify() to also convert any strings that look like numbers into numbers. Default: true
    * @param {number} [rowind=-1] - The row to operate on. If -1 (default), it will operate on the entire 2D array.
    * @param {number} [colind=-1] - The column to operate on. If -1 (default), it will operate on the entire 2D array.
    */
    clear(find:string|string[]|RegExp, numerify?:boolean, rowind?:number, colind?:number): void;
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
     */
    mapProps(): void;

    /**
     * Merges another row or column into the header column so that header column becomes an array, which causes the higher indexed elements of the array to nest inside the lower indexed elements of the array in the final output json object.
     * 
     * @param {number} index The index to merge to the header(not counting the header itself in the index). If headers set to row, merges that index row. If set to col, merges that column
     */
    mergeToHeader(index:number): void;

    /**
     * Goes through array and all sub-arrays and converts strings into numbers where it is possible to do so.
     */
    numerify(): void;

    /**
     * Splits the header column selected by setProps() to an array for mapping to the other column.
     * @param {RegExp} [regex=!!] The regex to split the rows on
     */
    propsToArray(regex: RegExp): void;

    /**
     * Sets the internal header arrays and removes those rows and columns from the data. The intersecting element will be removed.
     * @param {integer} [rowIndex=0] The row index of the column headers. Negative will operate from end. Default 0.
     * @param {integer} [columnIndex=0] The column index of the row headers. Negative will operate from end. Default 0.
     * @todo implement error string property to log errors in index sizes
     */
    setHeaders(rowIndex?:number, columnIndex?:number): void;

    /**
     * Sets either the row headers or the column headers as the one to be mapped - the other column will be the parent object name.
     * @param {string} str A string of either 'ROW' or 'COL' - Parser initializes with this set to ROW. A string other than these will do nothing.
     */
    setProps(str: "ROW" | "COL"): void;

}

export namespace util {
    /**
     * Creates nested properties in an object based on an array and assigns a value to the last property in the chain.
     * @param {Array[]} arr2d - A 2 dimensional array aligned with the vals array. The nested arrays contain strings representing properties to chain.
     * @param {Array} vals - A 1 dimensional array aliged with arr1d where vals[x] is the value to be chained with arr1d[x]
     * @param {Object} [parentobj={}] - the parent object to mutate. Default {}
     * @param {boolean} [mutate=true] - controls whether a semi-deep copy of parentobj is made before chaining. Default true
     * @returns {Object}- the parent object with the new properties chain, or a semi-deep clone of the parent object with the new properties chain if mutate is set to true.
     * @memberof util
     */
    function chainMultiple<T, O extends {}>(arr2d: Array<T|T[]>[], vals: T[], parentobj?: O, mutate?: boolean): any;
    /**
     * Chains an array into nested object/properties and sets the final property to the value given.
     * @param {(string[]|string)} arr1d - an array of strings to be chained into properties
     * @param {*} val - the value to set the final object
     * @param {obj} [obj={}] - the parent object on which to perform the chaining. Defaults to new {}
     * @param {boolean} [mutate=true] - controls whether a semi-deep copy of the object is made before chaining. Defaults to true.
     * @returns - the object with the new properties chain.
     * @memberof util
     */
    function chainSingle<T extends {}>(arr1d: string[]|string, val: any, obj?: T, mutate?: boolean): any;
    /**
    * Chops a row from an array, non mutating. 
    * @param {Array[]} arr - the 2-dimensional array to operate on
    * @param {(number | number[] | RegExp) } find The row index to remove, an array of row indexes to remove, or a regular expression. If a regular expression is passed, all rows that match the regex will be removed. Numbers may be negative to operate from the end.
    * @param {number} [regindex=0] The **column** index to search when using regular expressions. Defaults to the first column, index 0, as the typical use case would be to remove rows corresponding to unwanted data categories. If set to -1, chop will search the entire array for the regex, and whenever it finds a match, it will delete the entire row on which it was found. Default 0.
    * @param {boolean} [keepFirst=false] If set to true, Chop will ignore the first row of the .csv, which is often the header row when doing RegEx based searches. Default false.
    * @returns {Array} - A 2-dimensional array, possibly with some rows removed.
    * @memberof util
    */
    function chop<T>(arr: Array<T>[], find: number | number[] | RegExp, regIndex?: number, keepFirst?: boolean): Array<T>[];

    /**
    * Chops a column from an array, non mutating.
    * @param {*} arr A 2 dimensional array to operate on. Rows should be **equal length**
    * @param {(number | number[] | RegExp)} find The column index to remove, an array of column indexes to remove, or a regular expression. If a regular expression is passed _all_ columns that match on the RegIndex row will be removed. Negative numbers will operate from the last column backwards. 
    * @param {number} [regIndex=0] The **row** index to search when using regular expressions as the find parameter. Defaults to first row, index 0, as the typical use case would be to remove columns representing unwanted data, and column headers are usually located at row 0. If set to -1, chopColumn will search the entire array for a regex, and whenever it finds a match, it will delete the entire column on which it was found. Default 0.
    * @param {boolean} [keepFirst=false] If set to true, chopColumn will ignore the first column of the .csv, which is often the header row when doing RegEx based searches. Default false.
    * @returns {Array} - A 2-dimensional array with the indicated columns removed
    * @memberof util
    */
    function chopColumn<T>(arr: Array<T>[], find: number | number[] | RegExp, regIndex?: number, keepFirst?: boolean): Array<T>[];

    /**
    * Clears quotations or another character from elements in a 2D array or portion of that array.
    * @param {Array[]} arr - The 2-dimensional array to operate on.
    * @param {(string | string[] | RegExp | RegExp[])} [find='"'] - The string, array of strings, or regular expression to remove. Defaults to '"' (will remove the quote character)
    * @param {number} [rowInd=-1] - The row to operate on. If -1 (default), it will operate on the entire 2D array. Default -1.
    * @param {number} [colInd=-1] - The column to operate on. If -1 (default), it will operate on the entire 2D array. Default -1.
    * @memberof util
    */
    function clear<T>(arr: Array<T>[], find?: string | string[] | RegExp | RegExp[], rowInd?: number, colInd?: number): any;

    /**
     * Converts array to a CSV style string
     * @param {Array[]} arr the array to convert to a string
     * @param {string} [colDelim=','] the string to delimit columns. Default ','
     * @param {string} [rowDelim='\n'] the string to delimit rows. Default '\n'
     * @todo write unit tests?
     * @returns {string} a csv-style string
     * @memberof util
     */
    function convertArrToCSV<T>(arr: T[][], colDelim?: string, rowDelim?: string): string;
    /**
    * Parses csv into a 2-dimensional array. By default, also trims rows and columns left by trailing delimiters.
    * @param {string} csvtext - A csv string
    * @param {string} [delim='","'] - The value delimiter, default ','
    * @param {string} [row_delim='\n'] - The row delimiter, default \n
    * @param {boolean} [trim=true] - Trims empty trailing rows and empty trailing elements in rows, default true
    * @returns {Array} - A 2-dimensional array, with each sub-array representing rows.
    * @memberof util
    */
    function csvArray(csvtext: string, delim?: string, rowdelim?: string, trim?: boolean): Array<string>[];
    /**
     * Gets a column from a 2D array as an array.
     * @param {*} arr2d The array to operate on
     * @param {*} colIndex The index of the column to get
     * @returns {Array[]} An array of the values in the column.
     * @memberof util
     */
    function getColumn<T>(arr2d: T[][], colIndex: number): T[];

    /**
     * Goes through arrays and sub-arrays and converts any numeric strings to numbers that it finds
     * @param {Array} arr An array of any dimension; numerify will recursively move through sub arrays.
     * @returns {Array} An array with numeric strings converted to numbers.
     * @memberof util
     */
    function numerify<T>(arr: T[][]): T[][];

    /**
    * Coverts an element or series of elements in a 2D array to an array by splitting it on a regular expression. Useful for pre-processing before calling chain, which will map an array to nested object properties.
    * @param {Array[]} arr - The 2-dimensional array to operate on. 
    * @param {(string | string[] | RegExp | RegExp[])} [find='!!'] - The string, array of strings, or regular expression to split values on. Defaults to !!, which is used by census data, such as POPULATION!!15 AND OLDER!!, which will becomes [POPULATION,15 AND OLDER]. Note: If passing multiple regexes, all flags will be ignored and they will be set to global. If matching for certain specific characters, like '.', a regex must be used. Default '!!'
    * @param {number} [rowInd=-1] -  The row index to operate on, default -1, which operates on all.
    * @param {number} [colInd=0] - The column index to operate on, default 0. -1 operates on all.
    * @todo implement 1 el array options
    * @memberof util
    */
    function toArray<T>(arr2d: T[][], find?: string | string[] | RegExp | RegExp[], rowInd?: number, colInd?: number): Array<T|T[]>[];
    /**
     * Transposes an array so columns become rows
     * @param {Array[]} arr2d A 2D array to transpose. Rows should be equal length.
     * @returns {Array[]} A transposed array
     * @memberof util
     */
    function transpose<T>(arr2d: T[][]): T[][];

}