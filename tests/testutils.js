const assert = require('assert')
const util = require('../util.js')
const log = require('../logger.js')

const csvtext = '"geo","id001","id002"\n'+
                    '"name","AK","AL"\n'+
                    '"pop","100","1000"\n'+
                    '"pop!!15-20","20","200",\n'+
                    '"pop!!15-20!!divorced","3.5","45.8"\n';
const csvArray = util.csvArray(csvtext);

try {
// Creating array from CSV
    assert(csvArray.length == 5, `Csv not parsed to correct length Expected 5 was ${csvArray.length}.`)
    log('csvArray is correct length','green');
    assert(csvArray[3].length == 3, `\nCsvArray not generated with  correct number of cols. Expected 3 at index 3, got ${csvArray[3].length}\n`)
    log('csvArray has correct cols','green');
    assert.deepStrictEqual(csvArray, 
        [
          [ '"geo"', '"id001"', '"id002"' ],
          [ '"name"', '"AK"', '"AL"' ],
          [ '"pop"', '"100"', '"1000"' ],
          [ '"pop!!15-20"', '"20"', '"200"' ],
          [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
        ], 
        "Array not configured as expected");
    log('csvArray is as expected','green');
// Removing columns from array
    let colchop1 = util.chopColumn(csvArray, 0);
    assert.deepStrictEqual(colchop1,[
        [ '"id001"', '"id002"' ],
        [ '"AK"', '"AL"' ],
        [ '"100"', '"1000"' ],
        [ '"20"', '"200"' ],
        [ '"3.5"', '"45.8"' ]
      ],"Expected first column to be chopped");
    log("chopping first column is as expected",'green')
    let colchopArr = util.chopColumn(csvArray, [0,2]);
    assert.deepStrictEqual(colchopArr,[
        [  '"id001"' ],
        [  '"AK"' ],
        [  '"100"' ],
        [  '"20"' ],
        [  '"3.5"']
      ],'Expected first and third column to be chopped');
    log('chopping multiple columns by array as expected','green');
    let colchopReg = util.chopColumn(csvArray, /001/);
    assert.deepStrictEqual(colchopReg,
        [
          [ '"geo"', '"id002"' ],
          [ '"name"', '"AL"' ],
          [ '"pop"', '"1000"' ],
          [ '"pop!!15-20"', '"200"' ],
          [ '"pop!!15-20!!divorced"', '"45.8"' ]
        ], 'Expected second column to be chopped by Regex /001/g');
    log('chopping column by regex as expected','green');
    let colchopAll = util.chopColumn(csvArray,/A/,-1);
    assert.deepStrictEqual(colchopAll,[
        [ '"geo"' ],
        [ '"name"' ],
        [ '"pop"' ],
        [ '"pop!!15-20"' ],
        [ '"pop!!15-20!!divorced"' ]
      ],'Expected 2nd and 3rd column to be chopped by Regex /A/g when searching all array');
    log('chopping columns based on full-array regex search as expected','green');
// Removing rows from array
    let chop1 = util.chop(csvArray,0);
    assert.deepStrictEqual(chop1, [
        [ '"name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000"' ],
        [ '"pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
      ], "Array not configured as expected - should have removed top row.");
    log('chopping top row is as expected','green');
    let chopArr = util.chop(csvArray,[0,3]);
    assert.deepStrictEqual(chopArr,[
        [ '"name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
      ], 
        "Array not configured as expected - should have removed first and third row.");
    log('chopping array of rows is as expected','green');
    let chopReg1 = util.chop(csvArray, /pop/);
    assert.deepStrictEqual(chopReg1,
        [ [ '"geo"', '"id001"', '"id002"' ], [ '"name"', '"AK"', '"AL"' ] ], 
        "Array not configured as expected after regex chop- should remove 2,3,4");
    log('chopping regular expression of rows is as expected','green');
    let chopAll = util.chop(csvArray, /1/, -1);
    assert.deepStrictEqual(chopAll, 
        [ [ '"name"', '"AK"', '"AL"' ] ], 
        "After chopping /1/ at -1, should remove all but 1 rows");
    log('chopping regular expression of rows with full search is as expected','green');

// Clearing quotes from array
    let clearQuotes = util.clear(csvArray);
    assert.deepStrictEqual(clearQuotes, [
        [ 'geo', 'id001', 'id002' ],
        [ 'name', 'AK', 'AL' ],
        [ 'pop', '100', '1000' ],
        [ 'pop!!15-20', '20', '200' ],
        [ 'pop!!15-20!!divorced', '3.5', '45.8' ]
    ],"Quotes were not cleared as expected.")
    log('clearing quotes with default vals is as expected','green');
    let clearQuotesFirst = util.clear(csvArray, '"', 0);
    assert.deepStrictEqual(clearQuotesFirst, 
        [
          [ 'geo', 'id001', 'id002' ],
          [ '"name"', '"AK"', '"AL"' ],
          [ '"pop"', '"100"', '"1000"' ],
          [ '"pop!!15-20"', '"20"', '"200"' ],
          [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
        ],"Quotes were not cleared from first row as expected.")
    log('clearing quotes from first row only is as expected','green');
    let clearRegex = util.clear(csvArray, /!!/g);
    assert.deepStrictEqual(clearRegex, [
        [ '"geo"', '"id001"', '"id002"' ],
        [ '"name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000"' ],
        [ '"pop15-20"', '"20"', '"200"' ],
        [ '"pop15-20divorced"', '"3.5"', '"45.8"' ]
      ],"Regex /!!/g was not cleared as expected.")
    let clearName = util.clear(csvArray, "name");
    assert.deepStrictEqual(clearName, 
        [
          [ '"geo"', '"id001"', '"id002"' ],
          [ '""', '"AK"', '"AL"' ],
          [ '"pop"', '"100"', '"1000"' ],
          [ '"pop!!15-20"', '"20"', '"200"' ],
          [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
        ],"Clearing 'name' string was not cleared as expected.")
    log('clearing a string as a regex is as expected','green');
    let clearFirstRow = util.clear(csvArray, '"', 0);
    assert.deepStrictEqual(clearFirstRow, [
        [ 'geo', 'id001', 'id002' ],
        [ '"name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000"' ],
        [ '"pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
      ],"Clearing first row was not as expected.")
    log('clearing first row was as expected', 'green');
    let clearFirstCol = util.clear(csvArray, '"', -1, 0)
    assert.deepStrictEqual(clearFirstCol, [
        [ 'geo', '"id001"', '"id002"' ],
        [ 'name', '"AK"', '"AL"' ],
        [ 'pop', '"100"', '"1000"' ],
        [ 'pop!!15-20', '"20"', '"200"' ],
        [ 'pop!!15-20!!divorced', '"3.5"', '"45.8"' ]
      ],"Clearing first col was not as expected.")
    log('clearing first col was as expected', 'green');
    let clearOneCel = util.clear(csvArray, '"', 1,1);
    assert.deepStrictEqual(clearOneCel, [
        [ '"geo"', '"id001"', '"id002"' ],
        [ '"name"', 'AK', '"AL"' ],
        [ '"pop"', '"100"', '"1000"' ],
        [ '"pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
      ],"Clearing one cell was not as expected.")
    log("Clearing one cell was as expected","green");
    let clearStringAndReg = util.clear(csvArray, ['"',/A/g]);
    assert.deepStrictEqual(clearStringAndReg, [
        [ 'geo', 'id001', 'id002' ],
        [ 'name', 'K', 'L' ],
        [ 'pop', '100', '1000' ],
        [ 'pop!!15-20', '20', '200' ],
        [ 'pop!!15-20!!divorced', '3.5', '45.8' ]     
    ],"Clearing mutliple inputs was not as expected")
    log("Clearing mutliple inputs was expected","green");
// Splitting elements in an array into arrays
    let splitDefault = util.toArray(csvArray);
    assert.deepStrictEqual(splitDefault, [
        [ [ '"geo"' ], '"id001"', '"id002"' ],
        [ [ '"name"' ], '"AK"', '"AL"' ],
        [ [ '"pop"' ], '"100"', '"1000"' ],
        [ [ '"pop', '15-20"' ], '"20"', '"200"' ],
        [ [ '"pop', '15-20', 'divorced"' ], '"3.5"', '"45.8"' ]
      ],"Expected all of first column to be split arrays")
    log("Splitting the first column into arrays was as expected","green")
    let multipleSplit = util.toArray(csvArray, ['-',/\./g ], -1, -1);
    assert.deepStrictEqual(multipleSplit, [
        [ [ '"geo"' ], [ '"id001"' ], [ '"id002"' ] ],
        [ [ '"name"' ], [ '"AK"' ], [ '"AL"' ] ],
        [ [ '"pop"' ], [ '"100"' ], [ '"1000"' ] ],
        [ [ '"pop!!15', '20"' ], [ '"20"' ], [ '"200"' ] ],
        [ [ '"pop!!15', '20!!divorced"' ], [ '"3', '5"' ], [ '"45', '8"' ] ]
      ],"Expected all values to be split on '.'(literal) and '-'");
    log('splitting on multiple expressions worked as expected','green')
    let split3rdColOnZerosAndPeriods = util.toArray(csvArray, ['0',/\./], -1,2);
    assert.deepStrictEqual(split3rdColOnZerosAndPeriods, [
        [ '"geo"', '"id001"', [ '"id', '', '2"' ] ],
        [ '"name"', '"AK"', [ '"AL"' ] ],
        [ '"pop"', '"100"', [ '"1', '', '', '"' ] ],
        [ '"pop!!15-20"', '"20"', [ '"2', '', '"' ] ],
        [ '"pop!!15-20!!divorced"', '"3.5"', [ '"45', '8"' ] ]
      ],"Expected 3rd col to be split on zeros and periods");
    log('splitting 3rd col on zeros and periods worked as expected','green')

// Chaining properties into objects
    const propChain = ["depth1","depth2","depth3"];
    let propTestSingle = util.chainSingle('key', "value", {});
    assert.deepStrictEqual(propTestSingle,{ key: 'value' },'Chaining string didnt next as expected.');
    log('Chaining string nested as expected.','green');
    let propTestChain = util.chainSingle(propChain, "val", {});
    assert.deepStrictEqual(propTestChain, { depth1: { depth2: { depth3: 'val' } } },"Expected 3 nested properties")
    log("Chaining an array to a single object worked as expected","green");
    const propsArray = [
        ["prop1","subprop1"],
        ["prop1","subprop2"],
        ["prop2","subprop2","subprop3"]
    ];
    const valsArray = ["val1","val2","val3"];
    let propArrTestChain = util.chainMultiple(propsArray, valsArray);
    assert.deepStrictEqual(propArrTestChain, { 
        prop1: 
            { subprop1: 'val1',
              subprop2:  'val2'
            },
        prop2:
            { subprop2: {
                subprop3:"val3"
            }}
    },"Expected object with 2 nested property chains")
    log("Chaining multiple props and vals to a single object worked as expected","green");
    const propsArr2 = [
        ["State"],
        ["Total","Population 15 years and over"],
        ["Total","Population 15 years and over","Males 15 years and older"],
    ];
    const valsArr2 = ["WI","15,000","5,000"];
    let propsTest2 = util.chainMultiple(propsArr2,valsArr2,{},true);
    assert.deepStrictEqual(propsTest2, {
        State: "WI",
        Total: {
            "Population 15 years and over": {
                "Population 15 years and over": "15,000",
                "Males 15 years and older": "5,000"
            }
        }
    })
    log('Chaining with identically named properties, one with a val, one with a nest, worked as expected','true');

//rotations - get column, rotate array
    const rotArr = [
        [1,2,3],
        [3,4,5]
    ]
    let testgetcol = util.getColumn(rotArr,1);
    assert.deepStrictEqual(testgetcol, [2,4], "Expected to get column index 1 as array");
    log('Getting a column from a 2D array worked as expected','green');
    let testtranspose = util.transpose(rotArr);
    assert.deepStrictEqual(testtranspose, [[1,3],[2,4],[3,5]], "Expected transpose to yield 3 rows of 2 columns each");
    log('Transposing array worked as expected','green');
//numerify
    let numArr = util.numerify(clearQuotes);
    assert.deepStrictEqual(numArr,[
        [ 'geo', 'id001', 'id002' ],
        [ 'name', 'AK', 'AL' ],
        [ 'pop', 100, 1000 ],
        [ 'pop!!15-20', 20, 200 ],
        [ 'pop!!15-20!!divorced', 3.5, 45.8 ]
      ],"Numerifying array did not work as expected");
    log('Numerifying array worked as expected','green')



} catch(ex) {
    log(`AssertionError, ${ex.operator}: ${ex.message}`,'red');
    log('actual:','red');
    log(ex.actual);
    log('expected:','blue')
    log(ex.expected);
}