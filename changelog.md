2021/07/25 - v 1.0.5 -

    Added mergeToHeader function to Parser. This takes a row or column (depending on how you set your headers) and merges into the header column as an array, allowing for the nesting of data. 

2021/07/14 - v 1.0.4 -

    Added chop and ChopColumn functions to the Parser object, and added functionality to allow searching via headers, added corresponding tests.

    Started tutorial stubs.

2021/07/10 - v 1.0.3 - 

    Fixed module exports. Example of accessing members:
        const csv = require('census-csv-parser');
        const Parser = csv.Parser;
        const util = csv.util;
    
    Added "keepFirst" to the chop functions of the utilities

    Fixed Parser mapping so it can work with column-key data and map either way

    Added relevant tests and all are passing

    