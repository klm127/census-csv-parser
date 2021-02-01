const Parser = require('./parser')
const util = require('./util')
const fs = require('fs').promises;

const inputPath = "./test_data/maritaldataSmall.csv";
const outputPath = "./json_results/maritalsmall.json";

(async function(){
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
    //woops, not mapping nested props properly
    json = JSON.stringify(json);
    await fs.writeFile(outputPath,json).catch((e)=> {console.log('error writing file'); console.log(e);})

})().catch( (ex) => {
    console.log(`error!\n${ex}`)
})