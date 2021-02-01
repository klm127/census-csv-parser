/**
 * @namespace Example
 */

const Parser = require('./parser')
const util = require('./util')
const fs = require('fs').promises;

const inputPath = "./test_data/maritaldataSmall.csv";
const outputPath = "./json_results/maritaldataSmall.json";

/**
 * An example of using this library to parse a .csv into a mapped .json
 * @memberof! Example
 * @see {@link https://github.com/klm127/census-csv-parser/tree/master/test_data | input csvs on Github} for example inputs.
 * @see {@link https://github.com/klm127/census-csv-parser/tree/master/json_results | output .jsons on Github } for example outputs.
 * @example <caption>Example.js - using fs to write files and census-csv-parser members to process census data</caption>
 * const Parser = require('./parser')
const util = require('./util')
const fs = require('fs').promises;

const inputPath = "./test_data/maritaldataSmall.csv"; 
const outputPath = "./json_results/maritaldataSmall.json";

(async function(){ //file read/write (fs) is asynchronous
    const content = await fs.readFile(inputPath,'utf8') //read file
    let arr = util.csvArray(content); //convert to array with default delimiters
    arr = util.transpose(arr); //rotate the array- columns to rows
    arr = util.chop(arr,0); //chop off top row
    arr = util.chopColumn(arr,0); //chop off top column
    arr = util.clear(arr); //clear quotation marks(default value)
    arr = util.numerify(arr); //convert values to numbers where possible
    arr = util.clear(arr,/Margin of Error!!/); //clear unwanted text
    arr = util.clear(arr,/Estimate!!/); //clear unwanted text
    let parser = new Parser(arr); //create new parser and load it with array
    parser.setHeaders(0,0); //set the header row and columns
    parser.setProps('row'); // set to map properties from row(column not yet implemented)
    parser.propsToArray(/!!/); //split first column to an array on the regex
    let json = parser.mapProps(); //get json
    json = JSON.stringify(json); //convert to string for file write
    await fs.writeFile(outputPath,json).catch((e)=> {console.log('error writing file'); console.log(e);})
    //write
})().catch( (ex) => {
    console.log(`error!\n${ex}`) //catch exception
})
 */
async function example(){
    const content = await fs.readFile(inputPath,'utf8')
    let arr = util.csvArray(content);
    arr = util.transpose(arr);
    arr = util.chop(arr,0);
    arr = util.chopColumn(arr,0);
    arr = util.clear(arr);
    arr = util.numerify(arr);
    arr = util.clear(arr,/Margin of Error!!/);
    arr = util.clear(arr,/Estimate!!/);
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