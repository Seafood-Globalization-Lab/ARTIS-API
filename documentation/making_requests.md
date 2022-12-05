# How to make Requests to the ARTIS API

## Requests for Main ARTIS snet data

This section outlines how to make requests for data within the ARTIS snet table. Note that all requests require some kind of filtering criteria, if you would like to request the complete ARTIS snet data please send an email to [ENTER EMAIL HERE].

A request for the main ARTIS snet table consists of 3 fields:
- colsWanted **(REQUIRED)**: A list of strings containing the names of the columns used to summarize the ARTIS data you are requesting.
- weightType **(REQUIRED)**: A string either "live_weight_t" or "product_weight_t", denoting what mass measurement you would like to use. Note you can only choose ONE weightType.
- searchCriteria *(Optional)*: An object with key value pairs that is used to filter the ARTIS snet data down to a desired output. The keys need to be the ARTIS snet column names. All keys except for year, should have a list of strings denoting which values you want to keep in your output. The year parameter should be a list of integers of length 2, where the first integer is the start year and the second integer is the end year, denoting the timeframe of ARTIS data you want to request.

### Examples

If you wanted to send a request for all ARTIS snet data summarize by exporting country and year you would send the following request.

*Note:* In this request we are NOT performing any filtering on the ARTIS snet.
```json
{
    "colsWanted": ["exporter_iso3c", "year"],
    "weightType": "live_weight_t"
}
```

If you wanted to send the same request but only for 2017 - 2019 you would edit the request like this:
```json
{
    "colsWanted": ["exporter_iso3c", "year"],
    "weightType": "live_weight_t",
    "searchCriteria": {
        "year": [2017, 2019]
    }
}
```

If you wanted to explore bilateral trade relationships for a specific species (salmo salar), you would send the following request:
```json
{
    "colsWanted": ["exporter_iso3c", "importer_iso3c", "year"],
    "weightType": "live_weight_t",
    "searchCriteria": {
        "sciname": ["salmo salar"]
    }
}
```
---
## Requests for Supplemental data

This is section outline how to make requests for any of the supplemental data tables:
- baci
- countries
- production
- products
- sciname

You can make 2 kinds of requests for data in supplemental tables:
1. Getting all the unique values for a specific table. These requests are made to the url: ```/supplemental/```
    - This type of request has two REQUIRED parameters:
        - table: A string corresponding to the name of the supplemental table you want information from.
        - variable: A string corresponding to the name of the column. Will return all unique values in this column.
2. Getting all rows based on a filtered search criteria. These requests are made to the url: ```/supplemental/query/```
    - This type of the request has the uses the following parameters:
        - table **(REQUIRED)**: A string corresponding to the name of the supplemental table you want information from.
        - colsWanted **(REQUIRED)**: A list of strings corresponding to the columns that will be returned for each row.
        - searchCriteria *(Optional)*: An object with key value pairs that is used to filter the ARTIS snet data down to a desired output. The keys need to be the column names of the specific supplemental table being requested from. All keys should have a list of strings denoting which values you want to keep in your output.

### Examples

If you wanted to get all scientific names for all the species / species groups in ARTIS:
```json
{
    "table": "sciname",
    "variable": "sciname"
}
```

If you wanted to get all common names for all the species / species groups in ARTIS:
```json
{
    "table": "sciname",
    "variable": "common_name"
}
```

If you wanted to get all scientific, common names and ISSCAAP groups for a specific genus (for example thunnus):
```json
{
    "table": "sciname",
    "colsWanted": ["sciname", "common_name", "isscaap"],
    "searchCriteria": {
        "genus": ["thunnus"]
    }
}
```

If you wanted to get production of all USA and Chilean salmo salar by production method and year:
```json
{
    "table": "production",
    "colsWanted": ["iso3c", "method", "year", "live_weight_t"],
    "searchCriteria": {
        "sciname": ["salmo salar"],
        "iso3c": ["USA", "CHL"]
    }
}
```



