/**
 * @namespace util
 */
/**
 * Parses csv into a 2-dimensional array. By default, also trims rows and columns left by trailing delimiters.
 * @param {string} csvtext - A csv string
 * @param {string} [delim='","'] - The value delimiter
 * @param {string} [row_delim='\n'] - The row delimiter
 * @param {boolean} [trim=true] - Trims empty trailing rows and empty trailing elements in rows
 * @returns {Array} - A 2-dimensional array, with each sub-array representing rows.
 * @memberof util
 */
function csvArray(csvtext, delim=',',rowdelim='\n',trim=true) {
    let arr = csvtext.split(rowdelim);  // split on newline or other row delimiter
    arr = arr.map( (row) => { 
        let r = row.split(delim); // split each row into columns
        return r;
    });
    if(trim == true) {
        if(csvtext[csvtext.length-1]==rowdelim) {
            arr = arr.slice(0,arr.length-1); // trim off bottom row if csv ends in a row delimiter
        }
        let sum = 1;
        arr.forEach( (row)=> sum+= row.length);
        let avg = sum/arr.length-1;
        arr = arr.map( (row) => row.filter( (el,ind)=> ind<avg )) //trim cols past avg max index
    }
    return arr;
}
/**
 * Chops a row from an array. 
 * @param {Array[]} arr - the 2-dimensional array to operate on
 * @param {(number | number[] | RegExp) } find The row index to remove, an array of row indexes to remove, or a regular expression. If a regular expression is passed, all rows that match the regex will be removed. Numbers may be negative to operate from the end.
 * @param {number} [regindex=0] The **column** index to search when using regular expressions. Defaults to the first column, index 0, as the typical use case would be to remove rows corresponding to unwanted data categories. If set to -1, chop will search the entire array for the regex, and whenever it finds a match, it will delete the entire row on which it was found.
 * @param {boolean} [keepFirst=false] If set to true, Chop will ignore the first row of the .csv, which is often the header row when doing RegEx based searches.
 * @returns {Array} - A 2-dimensional array, possibly with some rows removed.
 * @memberof util
 */
function chop(arr, find, regIndex = 0, keepFirst=false) {
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
        if(keepFirst) {
            let header = deepCopySimple(arr[0]);
        }
        find = find.filter( (el)=> typeof el == 'number').sort( (a,b)=> b-a); //remove numbers, sort DESC
        find.forEach( (n) => { arr = chop(arr, n)}) //recursion!
        if(keepFirst) {
            arr.unshift(header);
        }
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
        return chop(arr, matchrows, regIndex, keepFirst)
    }
    return arr; //if wrong find type was passed, just give back the array
}
/**
 * Chops a column from an array
 * @param {*} arr A 2 dimensional array to operate on. Rows should be **equal length**
 * @param {(number | number[] | RegExp)} find The column index to remove, an array of column indexes to remove, or a regular expression. If a regular expression is passed _all_ columns that match on the RegIndex row will be removed. Negative numbers will operate from the last column backwards. 
 * @param {number} [regIndex=0] The **row** index to search when using regular expressions as the find parameter. Defaults to first row, index 0, as the typical use case would be to remove columns representing unwanted data, and column headers are usually located at row 0. If set to -1, chopColumn will search the entire array for a regex, and whenever it finds a match, it will delete the entire column on which it was found.
 * @memberof util
 */
function chopColumn(arr, find, regIndex = 0) {
    let height = arr.length;
    let width = arr[0].length;
    let newArr = [];
    if(typeof find == 'number') { //remove 1 column
        if(find < 0) { //align index
            find = arr[0].length + find-1;
        }
        if(find < 0 || find>= arr[0].length) {
            return arr; //index out of bounds
        }
        for(let i = 0; i<height; i++) {
            let newrow = [];
            for(let j = 0; j<width; j++) {
                if(j != find) {
                    newrow.push(arr[i][j]);
                }
            }
            newArr.push(newrow);
        }
    }
    else if(find instanceof Array) { //remove all columns in find array
        newArr = arr;
        find = find.filter( (el)=> typeof el == 'number').sort( (a,b)=> b-a); //remove numbers, sort DESC
        find.forEach( (n) => {newArr = chopColumn(newArr,n,regIndex)})
    }
    else if(find instanceof RegExp) { //remove all columns that match regex
        let matchcols = [];
        if(regIndex < 0) {
            arr.forEach( (row) => {
                row.forEach( (el, index)=> {
                    if(find.test(el)) {
                        matchcols.push(index);
                    }
                })
            })
        }
        else {
            arr[regIndex].forEach( (el,index) => {
                if(find.test(el)) {
                    matchcols.push(index);
                }
            })
        }
        newArr = arr;
        newArr = chopColumn(newArr,matchcols,regIndex);
    }
    return newArr;
}
/**
 * Clears quotations or another character from elements in a 2D array or portion of that array.
 * @param {Array[]} arr - The 2-dimensional array to operate on.
 * @param {(string | string[] | RegExp | RegExp[])} [find='"'] - The string, array of strings, or regular expression to remove.
 * @param {number} [rowInd=-1] - The row to operate on. If -1 (default), it will operate on the entire 2D array.
 * @param {number} [colInd=-1] - The column to operate on. If -1 (default), it will operate on the entire 2D array.
 * @memberof util
 */
function clear(arr, find='"', rowInd=-1, colInd=-1) {
    arr = deepCopySimple(arr);
    if(typeof find == "string") {
        find = new RegExp(find, 'g'); //when passed a string, all instances of that string will be replaced, so global flag is set.
    }
    else if(find instanceof Array) {
        find.forEach( (el) => {
            arr = clear(arr, el, rowInd, colInd);
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
 * @memberof util
 */
function toArray(arr2d, find='!!', rowInd=-1, colInd=0) {
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
 * @memberof util
 */
function chainSingle(arr1d, val, obj={}, mutate=true) {
    if(!mutate) {obj=deepCopySimple(obj);} //copy the object if we aren't supposed to mutate
    let prop = (arr1d instanceof Array) ? arr1d[0] : arr1d;
    let hasAlreadyProp = obj.hasOwnProperty(prop);
    let hasAlreadyFinalProp = hasAlreadyProp && !(obj[prop] instanceof Object);
    let haveMorePropsToAssign = arr1d.length > 1 && typeof arr1d != "string";
    if(hasAlreadyProp) {
        if(hasAlreadyFinalProp) {
            if(haveMorePropsToAssign) { //duplicate and move old prop down - it must be a total type prop
                let oldval = obj[prop];
                obj[prop] = {};
                obj[prop][prop] = oldval;
                arr1d = arr1d.slice(1);
                obj[prop] = chainSingle(arr1d,val,obj[prop],mutate)

            }
            else { //reassign if duplicate mapping
                obj[prop] = val;
            }
        }
        else{ //move into without re-assigning if we have more to go down
            arr1d = arr1d.slice(1);
            obj[prop] = chainSingle(arr1d,val,obj[prop],mutate);
        }
    }
    else {
        if(haveMorePropsToAssign) { //create new sub-obj if it doesnt exist and we have more to assign, and recurse
            arr1d = arr1d.slice(1);
            obj[prop] = {};
            obj[prop] = chainSingle(arr1d,val,obj[prop],mutate)
        }
        else { //if we have no more props to assign, assign here
            obj[prop] = val;
        }
    }
    return obj;
}
/**
 * Creates nested properties in an object based on an array and assigns a value to the last property in the chain.
 * @param {Array[]} arr2d - A 2 dimensional array aligned with the vals array. The nested arrays contain strings representing properties to chain.
 * @param {Array} vals - A 1 dimensional array aliged with arr1d where vals[x] is the value to be chained with arr1d[x]
 * @param {Object} [parentobj={}] - the parent object to mutate
 * @param {boolean} [mutate=true] - controls whether a semi-deep copy of parentobj is made before chaining.
 * @returns {Object}- the parent object with the new properties chain, or a semi-deep clone of the parent object with the new properties chain if mutate is set to true.
 * @memberof util
 */
function chainMultiple(arr2d, vals, parentobj={}, mutate=true) {
    if(!mutate) {
        parentobj = deepCopySimple(parentobj);
    }
    arr2d.forEach( (subArray, iteration) => {
        parentobj = chainSingle(subArray, vals[iteration], parentobj, mutate)
    })
    return parentobj;
}
/**
 * Gets a column from a 2D array as an array.
 * @param {*} arr2d The array to operate on
 * @param {*} colIndex The index of the column to get
 * @returns {Array[]} An array of the values in the column.
 * @memberof util
 */
function getColumn(arr2d, colIndex) {
    let arr = [];
    arr2d.forEach( (row) => {
        arr.push(row[colIndex]);
    })
    return arr;
}
/**
 * Transposes an array so columns become rows
 * @param {Array[]} arr2d A 2D array to transpose. Rows should be equal length.
 * @returns {Array[]} A transposed array
 * @memberof util
 */
function transpose(arr2d) {
    let newArr = [];
    let startingWidth = arr2d[0].length;
    let startingHeight = arr2d.length;
    for(let i = 0; i < startingWidth; i++) {
        let newrow = [];
        for(let j = 0; j < startingHeight; j++) {
            newrow.push(arr2d[j][i]);
        }
        newArr.push(newrow);
    }
    return newArr;
}
/**
 * Goes through arrays and sub-arrays and converts any numeric strings to numbers that it finds
 * @param {Array} arr An array of any dimension; numerify will recursively move through sub arrays.
 * @returns {Array} An array with numeric strings converted to numbers.
 * @memberof util
 */
function numerify(arr) {
    return arr.map( (el) => {
        if(el instanceof Array) {
            return numerify(el);
        }
        else if(+el){
            return +el;
        }
        else {
            return el;
        }
    })
}
/**
 * Uses JSON.parse/stringify to deep-copy an array.
 * @private
 * @param {(object | array)} obj - The object or array to copy. Should not have nested complex types.
 * @returns A clone of the object array 
 * @memberof util
 */
function deepCopySimple(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * Converts array to a CSV style string
 * @param {Array[]} arr the array to convert to a string
 * @param {string} [colDelim=','] the string to delimit columns
 * @param {string} [rowDelim='\n'] the string to delimit rows
 * @todo write unit tests?
 * @returns {string} a csv-style string
 * @memberof util
 */
function convertArrToCSV(arr,colDelim=',',rowDelim='\n') {
    let newstring = '';
    arr.forEach( (row,iteration) => {
        let partialstring = row.join(colDelim);
        newstring += partialstring;
        newstring += (iteration <= arr.length-1) ? rowDelim : ''
    })
    return newstring;
}

exports.convertArrToCSV = convertArrToCSV;
exports.chainMultiple = chainMultiple;
exports.csvArray = csvArray;
exports.chop = chop;
exports.chopColumn = chopColumn;
exports.clear = clear;
exports.toArray = toArray;
exports.chainSingle = chainSingle;
exports.getColumn = getColumn;
exports.transpose = transpose;
exports.numerify = numerify;