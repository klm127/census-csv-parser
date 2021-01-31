const assert = require('assert')
const util = require('./util.js')
const log = require('./logger.js')

const csvtext = '"geo","id001","id002\n"'+
                    '"name","AK","AL"\n'+
                    '"pop","100","1000\n"'+
                    '"pop!!15-20","20","200",\n'+
                    '"pop!!15-20!!divorced","3.5","45.8"\n';
const csvArray = util.csvArray(csvtext);

// Creating array from CSV
    assert(csvArray.length == 5, `Csv not parsed to correct length Expected 5 was ${csvArray.length}.`)
    log('csvArray is correct length','green');
    assert(csvArray[3].length == 3, `\nCsvArray not generated with  correct number of cols. Expected 3 at index 3, got ${csvArray[3].length}\n`)
    log('csvArray has correct cols','green');
    assert.deepStrictEqual(csvArray, [
        [ '"geo"', '"id001"', '"id002' ],
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]], 
        "Array not configured as expected");
    log('csvArray is as expected','green');
// Removing rows from array
    let chop1 = util.chop(csvArray,0);
    assert.deepStrictEqual(chop1, [
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
      ], "Array not configured as expected - should have removed top row.");
    log('chopping top row is as expected','green');
    let chopArr = util.chop(csvArray,[0,3]);
    assert.deepStrictEqual(chopArr,[
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]], 
        "Array not configured as expected - should have removed first and third row.");
    log('chopping array of rows is as expected','green');
    let chopReg1 = util.chop(csvArray, /pop/);
    assert.deepStrictEqual(chopReg1,[
        [ '"geo"', '"id001"', '"id002' ],
        [ '""name"', '"AK"', '"AL"' ],
        ], 
        "Array not configured as expected after regex chop- should remove 2,3,4");
    log('chopping regular expression of rows is as expected','green');
    let chopAll = util.chop(csvArray, /1/, -1);
    assert.deepStrictEqual(chopAll, [
        [ '""name"', '"AK"', '"AL"' ]], 
        "After chopping /1/ at -1, should remove all but 1 rows");
    log('chopping regular expression of rows with full array search is as expected','green');

// Clearing quotes from array
    let clearQuotes = util.clearQuotes(csvArray);
    assert.deepStrictEqual(clearQuotes, [
        [ 'geo', 'id001', 'id002' ],
        [ 'name', 'AK', 'AL' ],
        [ 'pop', '100', '1000' ],
        [ 'pop!!15-20', '20', '200' ],
        [ 'pop!!15-20!!divorced', '3.5', '45.8' ]
    ],"Quotes were not cleared as expected.")
    log('clearing quotes with default vals is as expected','green');
    let clearQuotesFirst = util.clearQuotes(csvArray, '"', 0);
    assert.deepStrictEqual(clearQuotesFirst, [
        [ 'geo', 'id001', 'id002' ],
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
    ],"Quotes were not cleared from first row as expected.")
    log('clearing quotes from first row only is as expected','green');
    let clearRegex = util.clearQuotes(csvArray, /!!/g);
    assert.deepStrictEqual(clearRegex, [
        [ '"geo"', '"id001"', '"id002' ],
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop15-20"', '"20"', '"200"' ],
        [ '"pop15-20divorced"', '"3.5"', '"45.8"' ]
    ],"Regex /!!/g was not cleared as expected.")
    let clearName = util.clearQuotes(csvArray, "name");
    assert.deepStrictEqual(clearName, [
        [ '"geo"', '"id001"', '"id002' ],
        [ '"""', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
    ],"Clearing 'name' string was not cleared as expected.")
    log('clearing a string as a regex is as expected','green');
    let clearFirstRow = util.clearQuotes(csvArray, '"', 0);
    assert.deepStrictEqual(clearFirstRow, [
        [ 'geo', 'id001', 'id002' ],
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
    ],"Clearing first row was not as expected.")
    log('clearing first row was as expected', 'green');
    let clearFirstCol = util.clearQuotes(csvArray, '"', -1, 0)
    assert.deepStrictEqual(clearFirstCol, [
        [ 'geo', '"id001"', '"id002' ],
        [ 'name', '"AK"', '"AL"' ],
        [ 'pop', '"100"', '"1000' ],
        [ 'pop!!15-20', '"20"', '"200"' ],
        [ 'pop!!15-20!!divorced', '"3.5"', '"45.8"' ]
    ],"Clearing first col was not as expected.")
    log('clearing first col was as expected', 'green');
    let clearOneCel = util.clearQuotes(csvArray, '"', 1,1);
    assert.deepStrictEqual(clearOneCel, [
        [ 'geo', '"id001"', '"id002' ],
        [ 'name', 'AK', '"AL"' ],
        [ 'pop', '"100"', '"1000' ],
        [ 'pop!!15-20', '"20"', '"200"' ],
        [ 'pop!!15-20!!divorced', '"3.5"', '"45.8"' ]
    ],"Clearing one cell was not as expected.")
    log("Clearing one cell was as expected","green");
