/**
 * Parses csv into a 2-dimensional array. By default, also trims rows and columns left by trailing delimiters.
 * @param {string} csvtext - A csv string
 * @param {string} [delim=','] - The value delimiter
 * @param {string} [row_delim='\n'] - The row delimiter
 * @param {boolean} [trim=true] - Trims empty trailing rows and empty trailing elements in rows
 * @returns {Array} - A 2-dimensional array, with each sub-array representing rows.
 */
exports.csvArray = function csvArray(csvtext, delim=',',rowdelim='\n',trim=true) {
    let arr = csvtext.split(rowdelim);
    let sum = 1;
    arr = arr.map( (row) => { 
        let r = row.split(delim); 
        sum+= r.length;
        return r;
    });
    if(trim == true) {
        if(csvtext[csvtext.length-1]==rowdelim) {
            arr = arr.slice(0,arr.length-1); // trim bottom row if csv ends in a row delimiter
        }
        let sum = 0;
        arr.forEach( (row)=> sum+= row.length);
        let avg = sum/arr.length-1;
        arr = arr.map( (row) => row.filter( (el,ind)=> ind<avg )) //trim cols past avg max index
    }
    return arr;
}
/**
 * Chops a row from an array. 
 * @param {Array[]} arr - the 2-dimensional array to operate on
 * @param {(number | number[] | RegExp) } find - the row index to remove, an array of row indexes to remove, or a regular expression. If a regular expression is passed, all rows that match the regex will be removed. Numbers may be negative to operate from the ned.
 * @param {number} [regindex=0] - the column index to search when using regular expressions. Defaults to the first column, index 0, as the typical use case would be to remove rows corresponding to unwanted data categories. If set to -1, chop will search the entire array for the regex, and whenever it finds a match, it will delete the entire row on which it was found.
 * @returns {Array} - A 2-dimensional array, possibly with some rows removed.
 */
exports.chop = function(arr, find, regIndex = 0) {
    if(typeof find == 'number') { //remove 1 row
        //remove a single row
        if(find < 0) {
            find = arr.length + find-1;
        }
        if(find < 0 || find >= arr.length) {
            return arr; //index out of bounds
        }
        let arrFront = arr.slice(0,find);
        let arrBack = arr.slice(find+1, arr.length);
        return [...arrFront,...arrBack];
    }
    else if(Array.isArray(find)) { //remove all rows in array
        find = find.filter( (el)=> typeof el == 'number').sort( (a,b)=> b-a); //remove numbers, sort DESC
        find.forEach( (n) => { arr = exports.chop(arr, n)}) //recursion!
        return arr;
    }
    else if(find instanceof RegExp) { //remove all rows that match regex
        let matchrows = [];
        if(regIndex < 0) { // match all elements based on regex
            arr.forEach( (row,rowind) => {
                for(let i = 0; i < row.length; i++) {
                    if(find.test(row[i])) {
                        matchrows.push(rowind);
                        break;
                    }
                }
            })
        }
        else {
            arr.forEach( (row, ind) => {
                if(find.test(row[regIndex])) { //match only regindex col based on regex
                    matchrows.push(ind);
                }
            });
        }        
        return exports.chop(arr, matchrows, regIndex)
    }
    return arr; //if wrong find type was passed, just give back the array
}
/**
 * Clears quotations or another character from elements in a 2D array or portion of that array.
 * @param {Array[]} arr - The 2-dimensional array to operate on.
 * @param {(string | string[] | RegExp | RegExp[])} [find='"'] - The string, array of strings, or regular expression to remove.
 * @param {number} [rowInd=-1] - The row to operate on. If -1 (default), it will operate on the entire 2D array.
 * @param {number} [colInd=-1] - The column to operate on. If -1 (default), it will operate on the entire 2D array.
 */
exports.clear = function(arr, find='"', rowInd=-1, colInd=-1) {
    arr = [...arr]; //prevent mutation with duplication
    if(typeof find == "string") {
        find = new RegExp(find, 'g'); //when passed a string, all instances of that string will be replaced, so global flag is set.
    }
    else if(find instanceof Array) {
        find.forEach( (el) => {
            arr = exports.clear(arr, el, rowInd, colInd);
        })
        return arr;
    }
    if(rowInd < 0) {
        arr = arr.map( (row) => mapRow(row, find, colInd) );
    }
    else if(rowInd < arr.length) {
        arr[rowInd] = mapRow(arr[rowInd], find, colInd)
    }
    return arr;
    function mapRow(row, find, colInd) {
        if(colInd < 0) {
            return row.map( (el) => {
                if(typeof el == "string") {
                    return el.replace(find,'');
                }
                else{
                    return el;
                }
            });
        }
        else if(colInd < row.length) { //replace only at set column
            row[colInd] = row[colInd].replace(find,'');
            return row;
        }
        else {
            return row;
        }
    }
}
/**
 * Coverts an element or series of elements in a 2D array to an array by splitting it on a regular expression. Useful for pre-processing before calling chain, which will map an array to nested object properties.
 * @param {Array[]} arr - The 2-dimensional array to operate on. 
 * @param {(string | string[] | RegExp | RegExp[])} [find='!!'] - The string, array of strings, or regular expression to split values on. Defaults to !!, which is used by census data, such as POPULATION!!15 AND OLDER!!, which will becomes [POPULATION,15 AND OLDER]. Note: If passing multiple regexes, all flags will be ignored and they will be set to global. If matching for certain specific characters, like '.', a regex must be used.
 * @param {number} [rowInd=-1] -  The row index to operate on, default -1, which operates on all.
 * @param {number} [colInd=0] - The column index to operate on, default 0. -1 operates on all.
 * @todo implement 1 el array options
 */
exports.toArray = function(arr2d, find='!!', rowInd=-1, colInd=0) {
    let arr = deepCopySimple(arr2d); //don't mutate original array.
    if(typeof find == "string") {
        find = new RegExp(find,"g");
    }
    else if(find instanceof Array) { //join as regex
        let finds = []
        find.forEach( (el) => {
            if(el instanceof RegExp) {
                finds.push(el.source);
            }
            else if(typeof el == "string") {
                finds.push(el);
            }
        })
        find = new RegExp( finds.join('|'),'g');
    }
    if(rowInd < 0) {
        arr = arr.map( (row) => {
            return splitRow(row, find, colInd)
        }); //do for all rows
    }
    else if(rowInd < arr.length) {
        arr[rowInd] = splitRow(arr[rowInd], find, colInd);
    }
    return arr;
    function splitRow(row, find, colInd) {
        if(colInd < 0) {
            return row.map( (el) => {
                return el.split(find)
            });
        }
        else if(colInd < row.length) {
            row[colInd] = row[colInd].split(find);
            return row;
        }
        return row;
    }
}
/**
 * Chains an array into nested object/properties and sets the final property to the value given.
 * @param {(string[]|string)} arr1d - an array of strings to be chained into properties
 * @param {*} val - the value to set the final object
 * @param {obj} [obj={}] - the parent object on which to perform the chaining
 * @param {boolean} [mutate=true] - controls whether a semi-deep copy of the object is made before chaining
 * @returns - the object with the new properties chain.
 */
exports.chainSingle = function(arr1d, val, obj={}, mutate=true) {
    if(!mutate) {
        obj = deepCopySimple(obj);
    }
    if(typeof arr1d == "string") {
        obj[arr1d] = val;
    }
    else if(arr1d.length == 1) {
        obj[arr1d[0]] = val;
    }
    else {
        obj[arr1d[0]] = exports.chainSingle(arr1d.slice(1), val, obj[arr1d[0]]); //recursion for nested
    }
    return obj;
}
/**
 * Uses JSON.parse/stringify to deep-copy an array.
 * @private
 * @param {Array[]} arr - The array to copy. Should not have nested complex types.
 * @returns A clone of the array 
 */
function deepCopySimple(arr) {
    return JSON.parse(JSON.stringify(arr));
}