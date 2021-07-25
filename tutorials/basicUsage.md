# Tutorial Stubs

### Why census-csv-parser

### Installing

### Importing

### What Parser Does



### Accessing Parser

{@link Parser} prepares data for conversion into a .json object. It simplifies the management of headers and nested properties. Once you have the `census-csv-parser` node module installed in your `node_modules` folder, you can access `Parser` with the following syntax in your node javascript file:

```
const csv = require('census-csv-parser');
const Parser = csv.Parser;
```

### Loading some data

Data is loaded into a `Parser` instance at the time of its construction. The data is often a two-dimensional array, but it may also be a csv string if rows are delimited by a newline character and columns are delimited by a coma. {@link util} can create 2-D arrays from strings delimited in other ways with the `csvArray` function.

**Example A: Simple Array Initialization**
```
//...
let myData = [
    ["City", "Population", "Primary Industry","Cost of Living versus National Average"],
    ["New York City", 8550405, "Financial Services",1.2],
    ["Boston", 667137, "Education Services", 1.2],
    ["Washington DC", 702445, "Federal Government", 1.17]
    ["Chicago",2720546,"Financial Services",0.99],
    ["Detroit",677116,"Automobile Manufacturing",0.89],
    ["Houston",2296224,"Crude Petroleum and Natural Gas Extraction",1.08 ]
]
let myParser = new Parser(myData);
```

You can also use the [fs module](https://nodejs.org/api/fs.html) to retrieve data from a file.

**Example B: Using Data from a File**
```
//...
const fs = require('fs').promises;
const inputPath = "./raw-data/cityComparisons.csv";

async function loadCsv() {
    let csvData = await fs.readFile(inputPath, 'utf8');
    let parser = new Parser(csvData);
    // ....

}
loadCsv().catch( (ex)=> {
    console.log(`error!\n${ex}`)
})

```

### Configuring Parser

Parser must be configured to be properly used. It must be told which rows are row headers and which column contains the column headers (sometimes 0,0) and whether it should be nesting the columns into rows when it creates the .json object or the rows into the columns. The parser is configured by using the `setHeaders` and `setProps` methods.

**Example Configuring Parser**:
```
//...
let myParser = new Parser(myData);
parser.setHeaders(0,0);
parser.setProps('COL');
```

### Parser Output

You can retrieve the Parser output with `Parser.mapProps`. It will return a `.json` object nested based on the way it was configured.

### Column Major Example

In a column-major configuration, the header column becomes the first level of javascript objects. 

**Example simple Column-Major**
```
let myData = [
    ["City", "Population", "Primary Industry","Cost of Living versus National Average"],
    ["New York City", 8550405, "Financial Services",1.2],
    ["Boston", 667137, "Education Services", 1.2],
    ["Washington DC", 702445, "Federal Government", 1.17]
    ["Chicago",2720546,"Financial Services",0.99],
    ["Detroit",677116,"Automobile Manufacturing",0.89],
    ["Houston",2296224,"Crude Petroleum and Natural Gas Extraction",1.08 ]
]
let myParser = new Parser(myData);
myParser.setHeaders(0,0);
myParser.setProps('COL');
console.log(myParser.mapProps());
```
**Example output**
```
{
  overlapHeader: 'City',
  'New York City': {
    Population: 8550405,
    'Primary Industry': 'Financial Services',
    'Cost of Living versus National Average': 1.2
  },
  Boston: {
    Population: 667137,
    'Primary Industry': 'Education Services',
    'Cost of Living versus National Average': 1.2
  }, //... etc
}
```

_Note_: If you set the header to a duplicative value, you run the risk of losing data. For example, if `setHeaders(0,2)` was called instead (making the header column 'Primary Industry'), New York City's data would get overwritten By Chicago's, because they have the same primary industry. Header values should be unique.


### Row Major Example
### Cleaning Data with Parser

### Example Output

```
js {
    "abc":123
}
```
|Header1 |Header2  | Header3|
--- | --- | ---
|data1|data2|data3|
|data11|data12|data13|

### Order

1. Parser.setProps(row, column)

1. Parser.setHeaders(rowOrColumnString)

1. Parser.chop , mergeArray, etc

1. Parser.mapProps();