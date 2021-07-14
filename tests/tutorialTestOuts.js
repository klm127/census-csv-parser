const util = require('../util.js')
const log = require('../logger.js')
let Parser = require('../Parser.js');
Parser = Parser.Parser
    
let cityData = [
    ["City", "Population", "Primary Industry","Cost of Living versus National Average"],
    ["New York City", 8550405, "Financial Services",1.2],
    ["Boston", 667137, "Education Services", 1.2],
    ["Washington DC", 702445, "Federal Government", 1.17],
    ["Chicago",2720546,"Financial Services",0.99],
    ["Detroit",677116,"Automobile Manufacturing",0.89],
    ["Houston",2296224,"Crude Petroleum and Natural Gas Extraction",1.08 ]
  ]
  let cityParser = new Parser(cityData);
  cityParser.setHeaders(0,2);
  cityParser.setProps('COL')
  console.log(cityParser.mapProps());