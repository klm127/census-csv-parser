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

const csv = require('census-csv-parser');
const Parser = csv.Parser;
const util = csv.util;

async function example(){
    const content = await fs.readFile(inputPath,'utf8'); // get the raw text
    let arr = util.csvArray(content,/","/); // turn text to csv
    // clean data
    arr = util.transpose(arr); // rotate array so rows become columns, columns become rows
    arr = util.chop(arr,/Margin of Error!!/,-1); // delete any row with the word Margin of Error!! in any cell
    arr = util.chopColumn(arr,0); // remove column 0
    arr = util.clear(arr,/Estimate!!/); //clear the word "Estimate!!" wherever it's found in any cell in the array
    arr = util.chop(arr, 0); // remove the first row
    arr = util.clear(arr); // clear quotation marks
    arr = util.numerify(arr); // turn string numbers to numbers
    // parse to js obj
    let parser = new Parser(arr); // set up a parser
    parser.setHeaders(0,0); // set headers rows and columns
    parser.setProps('row'); // this means the row headers will be attribute keys while top level object names will be column headers
    parser.propsToArray(/!!/); // split the properties into sub arrays for nested attributes
    let json = parser.mapProps(); // create the json
    json = JSON.stringify(json); // turn the json into a string
    await fs.writeFile(outputPath,json).catch((e)=> {console.log('error writing file'); console.log(e);}) // write to file

}
example().catch( (ex) => {
    console.log(`error!\n${ex}`) // catch errors
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
