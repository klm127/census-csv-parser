# census-csv-parser


## Description

census-csv-parser aims to ease the cleaning of csv data, especially data gathered from [census.gov](https://www.census.gov), by providing utiliy functions and objects for quickly scrubbing large portions of csv or other text data.

The typical goal is generally to ultimately convert .csv data into .json objects, whereby column or header rows become nested properties of those objects.

## Dependencies

Node.js

## Documentation

[Available here](quaffingcode.com/census-csv-parser/doc/index.html)

## Installation

Clone this repositor with git using: `git clone https://github.com/klm127/census-csv-parser.git`
Install with npm using `npm install census-csv-parser`

## Running

Use [Node.js](https://nodejs.org/en/)
...

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
                "Population 15 years and over": 3955,
                "AGE AND SEX": {
                    "Males 15 years and over": 1909410
                }
            }
        }
    },
    "Alaska": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 856,
                "AGE AND SEX": {
                    "Males 15 years and over": 301975
                }
            }
        }
    },
    "Arizona": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 1614,
                "AGE AND SEX": {
                    "Males 15 years and over": 2926106
                }
            }
        }
    },
    "Arkansas": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 2922,
                "AGE AND SEX": {
                    "Males 15 years and over": 1181259
                }
            }
        }
    },
    "California": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 4693,
                "AGE AND SEX": {
                    "Males 15 years and over": 15865087
                }
            }
        }
    },
    "Colorado": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 2634,
                "AGE AND SEX": {
                    "Males 15 years and over": 2372402
                }
            }
        }
    },
    "Connecticut": {
        "Total": {
            "Population 15 years and over": {
                "Population 15 years and over": 1595,
                "AGE AND SEX": {
                    "Males 15 years and over": 1441236
                }
            }
        }
    }
}
```

census-csv-parser accomplishes this by using utility functions to clean the data. Properties are nested in the output `.json` by defining a property row or column (row not yet implemented) and a header row (column not yet implemented) in the `Parser` object. This property column is an array of arrays, each sub-array describing a path to map properties to. The header row describes the objects properties will be mapped to. As `Parser` converts the data array to an object, it maps values from the property column to objects created from the header row and places them all in a wrapper object. 

This mapping, defined in the `chain` and `chainMultiple` functions in the `util` namespace has some interesting features. Here is how it operates.

## Chain procedure

1. It gets the property arrays, header array, 2-d data array for the intersecting area and iterates through the header array and data array columns.
    1. It creates a new object in the wrapper object where the key is equal to the header.
    1. It iterates through the property array and intersecting data column.
        1. For each row of the property array, it iterates through that sub-array.
            - The next value of the sub-array to sees if it already exists in the object as a property.
                - If it does, it is checked to see if it's a final value (not a sub-object)
                    - If it's a final value it checks if there more properties to iterate.
                        * If there are not more properties to iterate, it overwrites that value. (duplicate property mapping)
                        * If there are more properties to map, it creates a new object at that key and maps the existing final value to a key with the same name as the parent object. This accounts for the encountering of "total" type values. It then continues the mapping process recursively with the new object and the unused portion of the properties sub-array.
                    * If it's not a final value, (it's an object), it continues the mapping process recursively with that object and the unused portion of the properties array.
                - If the property does not exist yet in the object, it checks to see whether its final property.
                    * If it is on the final property, it creates that property in the object and sets its value to the data point.
                    * If it is not on the final property, it creates a new object for that property and continues the mapping process recursively with the new object and the unused portion of the properties sub-array.
        2. When it finishes with the property sub-array, it moves to the next property sub-array and data point.
    3. When it finishes with a data column, it moves to the next header value and next data column and repeats the process.
2. When it has finished mapping all data to objects, it returns that object.

## Other

See the [Example](./Example.html) namespace for more example usage.