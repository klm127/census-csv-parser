# census-csv-parser

_v 1.0.2_

[https://github.com/klm127/census-csv-parser](https://github.com/klm127/census-csv-parser)

## Description

census-csv-parser aims to ease the cleaning of csv data, with a focus on data gathered from [census.gov](https://www.census.gov), by providing utility functions and objects for rapidly manipulating csv files by operating on them as two dimensional arrays.

The usual goal is to convert .csv data into .json objects, whereby column or header rows become nested properties of those objects, for use in a variety of applications.

## Dependencies

[node](https://nodejs.org/en/)
[npm](https://www.npmjs.com/)

## Documentation

This code aims to be thoroughly documented. If you are viewing this readme on NPM, navigate to the github repo to see the link.

[Available here](https://quaffingcode.com/census-csv-parser/doc/index.html)

To create the documentation from the GitHub repo, first run 'npm install' to install the theme dependency. Then execute, e.g., `npm run document-minami` for the minami themed documentation.

## Running

- Use [Node.js](https://nodejs.org/en/)
- Create your project folder
- Run `npm init`
- Run `npm install census-csv-parser`
- To access the parser, use `const Parser = require('census-csv-parser/parser')`
- To access the utility functions, use `const util = require('census-csv-parser/util')`
- To create a new parser object, `const parser = new Parser()
- To access a util function, use, i.e. `util.csvArray(mycsvtext)`

## Testing

Run `npm run test` to run unit tests

## What it does

A section of geograph data downloaded from the census website might look like this:

| "GEO_ID"      | "NAME"                 | "S1201_C01_001E"                                | "S1201_C01_001M"                                       | "S1201_C01_002E"                                                                      | "S1201_C01_002M"                                                                             |
|---------------|------------------------|-------------------------------------------------|--------------------------------------------------------|---------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| "id"          | "Geographic Area Name" | "Estimate!!Total!!Population 15 years and over" | "Margin of Error!!Total!!Population 15 years and over" | "Estimate!!Total!!Population 15 years and over!!AGE AND SEX!!Males 15 years and over" | "Margin of Error!!Total!!Population 15 years and over!!AGE AND SEX!!Males 15 years and over" |
| "0400000US01" | "Alabama"              | "4004468"                                       | "3955"                                                 | "1909410"                                                                             | "4332"                                                                                       |
| "0400000US02" | "Alaska"               | "578225"                                        | "856"                                                  | "301975"                                                                              | "1721"                                                                                       |
| "0400000US04" | "Arizona"              | "5919085"                                       | "1614"                                                 | "2926106"                                                                             | "2405"                                                                                       |
| "0400000US05" | "Arkansas"             | "2439812"                                       | "2922"                                                 | "1181259"                                                                             | "3972"                                                                                       |
| "0400000US06" | "California"           | "32124112"                                      | "4693"                                                 | "15865087"                                                                            | "6043"                                                                                       |
| "0400000US08" | "Colorado"             | "4720810"                                       | "2634"                                                 | "2372402"                                                                             | "4047"                                                                                       |
| "0400000US09" | "Connecticut"          | "2975029"                                       | "1595"                                                 | "1441236"                                                                             | "2275"                                                                                       |

And we want the output to look like this:
```
{
    "Alabama": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 4004468,
                "AGE AND SEX": {
                    "Males 15 years and over": 1909410
                }
            }
        }
    },
    "Alaska": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 578225,
                "AGE AND SEX": {
                    "Males 15 years and over": 301975
                }
            }
        }
    },
    "Arizona": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 5919085,
                "AGE AND SEX": {
                    "Males 15 years and over": 2926106
                }
            }
        }
    },
    "Arkansas": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 2439812,
                "AGE AND SEX": {
                    "Males 15 years and over": 1181259
                }
            }
        }
    },
    "California": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 32124112,
                "AGE AND SEX": {
                    "Males 15 years and over": 15865087
                }
            }
        }
    },
    "Colorado": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 4720810,
                "AGE AND SEX": {
                    "Males 15 years and over": 2372402
                }
            }
        }
    },
    "Connecticut": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 2975029,
                "AGE AND SEX": {
                    "Males 15 years and over": 1441236
                }
            }
        }
    }
}
```

census-csv-parser accomplishes this by using utility functions to clean the data. Properties are nested in the output `.json` by defining a property column and a header row in the `Parser` object. This property column is an array of arrays, each sub-array describing a path to map properties to. The header row describes the objects properties will be mapped to. As `Parser` converts the data array to an object, it maps values from the property column to objects created from the header row and places them all in a wrapper object. 

This mapping, defined in the `chain` and `chainMultiple` functions in the `util` namespace has some interesting features. Here is how it operates.

## Chain procedure

#### Definitions

 **Name** | **Definition** | **Example** 
 -------- | -------------- | -----------
| Property Array | An array corresponding to the "property" column, where each value is another array representing properties to be nested. | ["Total", "Population", "15 and Older"], ["Total", "Population", "15-20"], ["Total", "Population", "20-25"]... |
| Header Array | An array corresponding to the "header" row, where each value is the first property of the final json object. | ["Alabama","Arkansas",....]
| Data Array | The data to be mapped | [ 100000, 150000, ....], [200000, 40000...] |
| Wrapper Object | The final object generated, stringable as a JSON | {"Alabama": {"Total": {"Population":{"15-20":100000, "20-25":150000}}}},{"Arkansas":...}....}

1. Get the property array, header array, and 2-d data array for the intersecting area.
1. Create a wrapper object.
1. Iterate through the header array.
    1. Create a new object in the wrapper object where the key is equal to the current header array iteration.
    1. Iterate through the property array.
        1. For each row of the property array, Iterate through that sub-array.
            - Check next value of the property array sub-array to see if it already exists in the object as a property.
                - If it does, Check to see if it's a final value (not a sub-object)
                    - If it's a final value check if there more properties to iterate.
                        * If there are not more properties to iterate, overwrite the existing value with the value in the data array at the intersection of the current property array value and current header array value. (duplicate property mapping)
                        * If there are more properties to map, create a new object at that key and map the existing final value to a key with the same name as the parent object. This accounts for the encountering of "total" type values. Continues the mapping process recursively with the new object and the unused portion of the properties sub-array.
                    * If it's not a final value, (it's an object), continue the mapping process recursively with that object and the unused portion of the properties array.
                - If the property does not exist yet in the object, check to see whether its final property.
                    * If it is a final property, create that property in the object and set its value to the data point at the intersection of the property array and header array in the data array.
                    * If it is not the final property, create a new object for that property and continue the mapping process recursively with the new object and the unused portion of the properties sub-array.
        2. When finished with a property sub-array, move to the next property sub-array.
    3. When finished with a data array column, move to the next header array value and repeat the process.
2. When it all data is mapped to an object, return that object.

## Other

See the [Example](./Example.html) namespace for more example usage.