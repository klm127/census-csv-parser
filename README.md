# census-csv-parser

## Description

census-csv-parser aims to ease the cleaning of csv data, especially data gathered from [census.gov](https://www.census.gov), by providing utiliy functions and objects for quickly scrubbing large portions of csv or other text data.

The typical goal is generally to ultimately convert .csv data into .json objects, whereby column or header rows become nested properties of those objects.

### example

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


_to be continued..._