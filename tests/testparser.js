const assert = require('assert')
const P = require('../parser.js')
const Parser = P.Parser
const log = require('../logger.js');
const { AssertionError } = require('assert');


try {
    const csvtext = '"geo","id001","id002\n"'+
                    '"name","AK","AL"\n'+
                    '"pop","100","1000\n"'+
                    '"pop!!15-20","20","200",\n'+
                    '"pop!!15-20!!divorced","3.5","45.8"\n';
    let parser = new Parser(csvtext);
    assert.deepStrictEqual(parser.data,[
        [ '"geo"', '"id001"', '"id002' ],
        [ '""name"', '"AK"', '"AL"' ],
        [ '"pop"', '"100"', '"1000' ],
        [ '""pop!!15-20"', '"20"', '"200"' ],
        [ '"pop!!15-20!!divorced"', '"3.5"', '"45.8"' ]
      ],"parser didn't turn csv data to array")
    log('parser turned csv into array','green')
    parser.clear(/"/g);
    assert.deepStrictEqual(parser.data,[
        [ 'geo', 'id001', 'id002' ],
        [ 'name', 'AK', 'AL' ],
        [ 'pop', 100, 1000 ],
        [ 'pop!!15-20', 20, 200 ],
        [ 'pop!!15-20!!divorced', 3.5, 45.8 ]
      ],"parser didn't clear array properly");
    log('parser cleared array of unwanted chars and converted nums','green');
    parser.setHeaders(0,0);
  // data correct after setting headers?
    assert.deepStrictEqual(parser.data,[ [ 'AK', 'AL' ], [ 100, 1000 ], [ 20, 200 ], [ 3.5, 45.8 ] ], "parser.data incorrect after set headers");
    log('parser data as expected after setting headers','green')
  // column headers correct?
    assert.deepStrictEqual(parser.columnHeaders,[ 'id001', 'id002' ],'after setting headers, column headers incorrect');
    log('column headers as expected','green')
  // row headers correct?
    assert.deepStrictEqual(parser.rowHeaders,
      [ 'name', 'pop', 'pop!!15-20', 'pop!!15-20!!divorced' ]
      ,'after setting headers, row headers incorrect');
    log('parser cut out headers correctly','green');

    parser.setProps('ROW');
    parser.propsToArray('!!');
  // row headers correct?
    assert.deepStrictEqual(parser.rowHeaders,[
      [ 'name' ],
      [ 'pop' ],
      [ 'pop', '15-20' ],
      [ 'pop', '15-20', 'divorced' ]
    ],'row headers were not parsed to arrays correctly');
    log('row headers were parsed to arrays correctly','green');
    let parser2 = new Parser(csvtext);
    parser2.metadata = ({'title':'bob'});
    parser2.setHeaders(0,0);
    parser2.clear(/"/g);
    parser2.setProps("row");
    parser2.propsToArray(/!!/);
    let json1 = parser2.mapProps();
    assert.deepStrictEqual(json1, {
        title: 'bob',
        overlapHeader: '"geo"',
        '"id001"': {
          '""name"': 'AK',
          '"pop"': 100,
          '""pop': { '15-20"': 20 },
          '"pop': { '15-20': {
              'divorced"':3.5
          } }
        },
        '"id002': {
          '""name"': 'AL',
          '"pop"': 1000,
          '""pop': { '15-20"': 200 },
          '"pop': { '15-20': {
              'divorced"':45.8
          } }
        }
    },'parser2 did not map properties as expected!')
    log('parser mapped properties as expected','green');


    // testing a simple array with row headers in the column

    let testRowArray = [
      ["Species", "Falcon", "Dove", "Duck"],
      ["Top Speed (mph)", 84, 35, 25],
      ["Weight (lb)", 5, 0.5, 11]
    ]
    let parserRowTest = new Parser(testRowArray);
    parserRowTest.setHeaders(0,0);
    parserRowTest.setProps('ROW');
    let jsobRowTest = parserRowTest.mapProps();
    assert.deepStrictEqual(jsobRowTest, {
      overlapHeader: 'Species',
      Falcon: { 'Top Speed (mph)': 84, 'Weight (lb)': 5 },
      Dove: { 'Top Speed (mph)': 35, 'Weight (lb)': 0.5 },
      Duck: { 'Top Speed (mph)': 25, 'Weight (lb)': 11 }
    }, "parsing a column into a row didn't work")
    log('column-headed data transformed into jsob as expected', 'green');

  // testing an array with columnal properties

    let testArray = [
      [ "LOC-CODE", "STATE", "POP", "INCOME" ],
      [ 1, "NY", 1000000, 200000],
      [ 2, "MA", 500000, 10000]
    ]
    let parser3 = new Parser(testArray);
    parser3.setHeaders(0,1) //rowindex, columnindex. 
    parser3.setProps('COL')
    let jsob = parser3.mapProps()
    assert.deepStrictEqual(jsob, {
      overlapHeader: 'STATE',
      NY: { 'LOC-CODE': 1, POP: 1000000, INCOME: 200000 },
      MA: { 'LOC-CODE': 2, POP: 500000, INCOME: 10000 }
    }, "column-mapped object didn't work as expected");
    log('column mapped object worked as expected','green')
  // testing chop rows in parser (should remove headers also)
    let testArray2 = [
      ["City", "Population", "Most Common Profession"],
      ["Boston", "1.8m", "Government Worker"],
      ["Los Angeles", "5m", "Street Performer"],
      ["New York", "15m", "Wall Street Banker"]
    ];
    let parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL')
    parser4.chop(1); // remove LA _and_ row header LA
    assert.deepStrictEqual(parser4.mapProps(), {
      overlapHeader: 'City',
      Boston: { Population: '1.8m', 'Most Common Profession': 'Government Worker' },
      'New York': { Population: '15m', 'Most Common Profession': 'Wall Street Banker' }
    }, 'Parser removed row header when chopped on a single item');
    log('Parser chops rows and removes row headers when it does so','green')
    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL')
    parser4.chop([1,2]);
    assert.deepStrictEqual(parser4.mapProps(), {
      overlapHeader: 'City',
      Boston: { Population: '1.8m', 'Most Common Profession': 'Government Worker' },
    }, 'Parser removed row headers when passed arrays to chop');
    log('Parser chopped array of rows correctly','green')
    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL')
    parser4.chop(/5m/,0); //should remove los angeles and new york
    assert.deepStrictEqual(parser4.mapProps(), {
      overlapHeader: 'City',
      Boston: { Population: '1.8m', 'Most Common Profession': 'Government Worker' },
    }, 'Parser chop did not process regex correctly');
    log('Parser removed row headers as well as data when passed regex to chop','green');

    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL');
    parser4.chopColumn(/Government/);
    assert.deepStrictEqual(parser4.mapProps(), {
      overlapHeader: 'City',
      Boston: { Population: '1.8m' },
      'Los Angeles': { Population: '5m' },
      'New York': { Population: '15m' }
    }, 'column was not removed as expected')
    log('Parser removed a column based on a regex and removed the column header as well','green');

    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL');
    parser4.chopColumn([1,0]);
    assert.deepStrictEqual(parser4.mapProps(), {
      overlapHeader: 'City',
      Boston: {},
      'Los Angeles': {},
      'New York': {}
    }, 'array of columns were not removed as expected.')
    log('Parser removed an array of columns as expected','green');

    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL');
    parser4.chopColumn(/Population/,'Header');
    assert.deepStrictEqual(parser4.mapProps(), {
      overlapHeader: 'City',
      Boston: { 'Most Common Profession': 'Government Worker' },
      'Los Angeles': { 'Most Common Profession': 'Street Performer' },
      'New York': { 'Most Common Profession': 'Wall Street Banker' }
    }, 'chopping columns based on header regex search did not work as expected')
    log('chopping columns based on header regex search worked as expected','green')

    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL');
    parser4.chopColumn([1,0],'Header');
    assert.deepStrictEqual(parser4.mapProps(),{
      overlapHeader: 'City',
      Boston: {},
      'Los Angeles': {},
      'New York': {}
    }, 'When passing an array to parser and telling it to regex search on column names, encountered unexpected result')
    log('Chopping columns when giving parser confusing header info worked as expected','green')

    
    parser4 = new Parser(testArray2);
    parser4.setHeaders(0,0);
    parser4.setProps('COL');
    parser4.chop(/Boston/,'Header');
    assert.deepStrictEqual(parser4.mapProps(),{
      overlapHeader: 'City',
      'Los Angeles': { Population: '5m', 'Most Common Profession': 'Street Performer' },
      'New York': { Population: '15m', 'Most Common Profession': 'Wall Street Banker' }
    }, 'Chopping rows with header column worked as expected')
    log('Chopping rows on header regex worked as expected','green')

    // test merging a column into the row headers as an array for nesting
    testArray = [
      ["County","Industry","Number of Firms","Number of Employees"],
      ["Mercer","Automobile Manufacturing", 3, 112],
      ["Mercer","Wood Product Manufacturing", 12, 195],
      ["Dodd","Food Service", 50, 220],
      ["Dodd","Automobile Manufacturing", 1, 10]
    ];
    parser = new Parser(testArray);
    parser.setHeaders(0,0)
    parser.setProps('ROW');
    parser.mergeToHeader(0);
    let out = parser.mapProps();
    assert.deepStrictEqual(out, {
      overlapHeader: 'County',
      'Number of Firms': {
        Mercer: { 'Automobile Manufacturing': 3, 'Wood Product Manufacturing': 12 },
        Dodd: { 'Food Service': 50, 'Automobile Manufacturing': 1 }
      },
      'Number of Employees': {
        Mercer: {
          'Automobile Manufacturing': 112,
          'Wood Product Manufacturing': 195
        },
        Dodd: { 'Food Service': 220, 'Automobile Manufacturing': 10 }
      }
    },'Merging a col for array-style mapping did not work as expected');
    log('Merging a column into the row headers worked as expected','green')

    testArray = [
      ["County","Franklin","Preston","Franklin","Preston","Preston"],
      ["Industry","Financial Services","Financial Services","Auto Repair","Auto Repair","Consulting"],
      ["Tax Revenue (mil)",3,8,0.4,0.3,2],
      ["Employees", 900, 1950, 320, 640, 50]
    ]
    parser = new Parser(testArray);
    parser.setHeaders(0,0);
    parser.setProps('COL');
    parser.mergeToHeader(0);
    out = parser.mapProps();
    assert.deepStrictEqual(out, {
      overlapHeader: 'County',
      'Tax Revenue (mil)': {
        Franklin: { 'Financial Services': 3, 'Auto Repair': 0.4 },
        Preston: { 'Financial Services': 8, 'Auto Repair': 0.3, Consulting: 2 }
      },
      Employees: {
        Franklin: { 'Financial Services': 900, 'Auto Repair': 320 },
        Preston: { 'Financial Services': 1950, 'Auto Repair': 640, Consulting: 50 }
      }
    }, 'Merging a row for array-style mapping did not work as expected');
    log('Merging a row into the column headers worked as expected','green')
    


} catch(ex) {
    if(ex instanceof AssertionError ) {
        log(`AssertionError, ${ex.operator}: ${ex.message}`,'red');
        log('actual:','red');
        log(ex.actual);
        log('expected:','blue')
        log(ex.expected);
    }
    else {
        console.log(ex)
    }
}