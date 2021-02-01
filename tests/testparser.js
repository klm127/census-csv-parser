const assert = require('assert')
const Parser = require('../parser.js')
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
    parser.setHeaders();
    assert.deepStrictEqual(parser.data,[ [ 'AK', 'AL' ], [ 100, 1000 ], [ 20, 200 ], [ 3.5, 45.8 ] ], "parser.data incorrect after set headers");
    assert.deepStrictEqual(parser.columnHeaders,[ 'id001', 'id002' ],'after setting headers, column headers incorrect');
    assert.deepStrictEqual(parser.rowHeaders,[ 'name', 'pop', 'pop!!15-20', 'pop!!15-20!!divorced'],'after setting headers, row headers incorrect');
    log('parser cut out headers correctly','green');

    parser.setProps('ROW');
    parser.propsToArray('!!');
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