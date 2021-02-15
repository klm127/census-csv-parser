/**
 * @namespace Example
 */

const Parser = require('./parser')
const util = require('./util')
const fs = require('fs').promises;

const inputPath = "./test_data/maritaldataLarge.csv";
const outputPath = "./json_results/maritaldataLarge.json";

/**
 * An example of using this library to parse a .csv into a mapped .json
 * @memberof! Example
 * @see {@link https://github.com/klm127/census-csv-parser/tree/master/test_data | input csvs on Github} for example inputs.
 * @see {@link https://github.com/klm127/census-csv-parser/tree/master/json_results | output .jsons on Github } for example outputs.
 * @example <caption>Example.js - using fs to write files and census-csv-parser members to process census data</caption>
 * 
async function example(){
    const content = await fs.readFile(inputPath,'utf8');
    let arr = util.csvArray(content,/","/);
    arr = util.transpose(arr);
    arr = util.chop(arr,/Margin of Error!!/,-1);
    arr = util.chopColumn(arr,0);
    arr = util.clear(arr,/Estimate!!/);
    arr = util.chop(arr, 0);
    arr = util.clear(arr);
    arr = util.numerify(arr);
    let parser = new Parser(arr);
    parser.setHeaders(0,0);
    parser.setProps('row');
    parser.propsToArray(/!!/);
    let json = parser.mapProps();
    json = JSON.stringify(json);
    await fs.writeFile(outputPath,json).catch((e)=> {console.log('error writing file'); console.log(e);})

}
example().catch( (ex) => {
    console.log(`error!\n${ex}`)
})
 */
async function example(){
    const content = await fs.readFile(inputPath,'utf8');
    let arr = util.csvArray(content,/","/);
    arr = util.transpose(arr);
    arr = util.chop(arr,/Margin of Error!!/,-1);
    arr = util.chopColumn(arr,0);
    arr = util.clear(arr,/Estimate!!/);
    arr = util.chop(arr, 0);
    arr = util.clear(arr);
    arr = util.numerify(arr);
    let parser = new Parser(arr);
    parser.setHeaders(0,0);
    parser.setProps('row');
    parser.propsToArray(/!!/);
    let json = parser.mapProps();
    json = JSON.stringify(json);
    await fs.writeFile(outputPath,json).catch((e)=> {console.log('error writing file'); console.log(e);})

}
example().catch( (ex) => {
    console.log(`error!\n${ex}`)
})