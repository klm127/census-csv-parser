

2021/07/10 - v 1.0.3 - 

    Fixed module exports. Example of accessing members:
        const csv = require('census-csv-parser');
        const Parser = csv.Parser;
        const util = csv.util;
    
    Added "keepFirst" to the chop functions of the utilities

    Fixed Parser mapping so it can work with column-key data and map either way

    Added relevant tests and all are passing

    