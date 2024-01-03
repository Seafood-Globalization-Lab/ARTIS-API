# How to make Requests to the ARTIS API

## Summary
<table>
    <tbody>
    <tr>
        <th>HTTP Request Type</th>
        <th>Endpoint</th>
        <th>Parameters</th>
        <th>Response</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/snet/query</td>
        <td>
        Required Parameters:
        <ul>
            <li>cols_wanted (at least one value required): "exporter_iso3c", "importer_iso3c", "source_country_iso3c", "hs6", "sciname", "habitat", "method", "dom_source", "year". </li>
            <li>weight_type (only one value can be selected): "product_weight_t" or "live_weight_t"</li>
            <li>start_year: year from 1996-2020 (inclusive)</li>
            <li>end_year: year from 1996-2020 (inclusive)</li>
            <li>search_criteria: Either 1 or 0. 1 notes that additional filtering criteria will be included, 0 notes no filter criteria is required.</li>
            <i>Note: start_year cannot be greater than end_year. For results for just 1 year, make start_year equal to end_year.</i>
        </ul>
        Optional Parameters:
        <ul>
            <li>Send in additional column names as parameters, with strings as values for the values you want to filter for.</li>
        </ul>
        </td>
        <td>
            List of objects where each object corresponds to a row of with the appropriate raw/filtered/summarized data from the ARTIS database.
        </td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/supplemental</td>
        <td>
        Required Parameters:
        <ul>
            <li>table: supplemental table name.</li>
            <li>variable: column name within supplemental table.</li>
        </ul>
        </td>
        <td>
        A list of strings representing unique values in the column requested.
        </td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/supplemental/query</td>
        <td>
        Required Parameters:
        <ul>
            <li>table: supplemental table name you want information from.</li>
            <li>cols_wanted: columns include in the table requested.</li>
            <li>search_criteria: Either 1 or 0. 1 notes that additional filtering criteria will be included, 0 notes no filter criteria is required.</li>
        </ul>
        Optional Parameters:
        <ul>
            <li>Send in additional column names as parameters, with strings as values for the values you want to filter for.</li>
        <ul>
        </td>
        <td>
            A list of object where each object represents a row of data in the supplemental table requested.
        </td>
    </tr>
    </tbody>
</table>

An indepth review of the API requests and responses is available below.

## Requests for Main ARTIS snet data

This section outlines how to make requests for data within the ARTIS snet table. Note that all requests require some kind of filtering criteria, if you would like to request the complete ARTIS snet data please send an email to [ENTER EMAIL HERE].

A request for the main ARTIS snet table consists of 3 fields:
- cols_wanted **(REQUIRED)**: A string containing the names of the columns, comma separated without spaces, used to summarize the ARTIS data you are requesting.
- weight_type **(REQUIRED)**: A string either "live_weight_t" or "product_weight_t", denoting what mass measurement you would like to use. Note you can only choose ONE weight_type.
- search_criteria **(REQUIRED)**: Either 1 or 0. 1 notes that additional filtering criteria will be included, 0 notes no filter criteria is required. Note all optional parameters sent will be treated as filtering criteria if search_criteria is set to 1. If search_criteria is set to 0, then all optional parameters will be ignored.

### Examples

If you wanted to send a request for all ARTIS snet data summarize by year you would send a GET request to the `/snet/query` endpoint, with the following parameters:

*Note:* In this request we are NOT performing any filtering on the ARTIS snet (with exception of the start and end years).

```json
{
    "cols_wanted": "year",
    "weight_type": "live_weight_t",
    "start_year": 2015,
    "end_year": 2020,
    "search_criteria": 0
}
```
The endpoint with parameters would look like this:

`/snet/query?cols_wanted=year&weight_t=live_weight_t&start_year=2015&end_year=2020&search_criteria=0`

Here is a sample response:
```json
[
    {
        "year": 2020,
        "live_weight_t": 44166033.00951629
    },
    {
        "year": 2015,
        "live_weight_t": 40891197.02143691
    },
    {
        "year": 2018,
        "live_weight_t": 46537958.721290946
    },
    {
        "year": 2017,
        "live_weight_t": 44763794.736794
    },
    {
        "year": 2019,
        "live_weight_t": 45180309.70194027
    },
    {
        "year": 2016,
        "live_weight_t": 41962089.008993454
    }
]
```


If you wanted to send the same request but only for US and China capture trade from 2017 - 2019 you would include the following parameters:
```json
{
    "cols_wanted": "exporter_iso3c,year",
    "weight_type": "live_weight_t",
    "start_year": 2017,
    "end_year": 2019,
    "search_criteria": 1,
    "exporter_iso3c": "CHN,USA",
    "method": "capture"
}
```

The final url would look like this:

`/snet/query?cols_wanted=exporter_iso3c,year&weight_type=live_weight_t&start_year=2017&end_year=2019&search_criteria=1&exporter_iso3c=CHN,USA&method=capture`

Here is a sample response:
```json
[
    {
        "exporter_iso3c": "USA",
        "year": 2017,
        "live_weight_t": 1975004.9836222837
    },
    {
        "exporter_iso3c": "CHN",
        "year": 2018,
        "live_weight_t": 3086899.0878980905
    },
    {
        "exporter_iso3c": "USA",
        "year": 2019,
        "live_weight_t": 1699555.4157051465
    },
    {
        "exporter_iso3c": "CHN",
        "year": 2019,
        "live_weight_t": 2960335.342349926
    },
    {
        "exporter_iso3c": "CHN",
        "year": 2017,
        "live_weight_t": 3256231.7707880796
    },
    {
        "exporter_iso3c": "USA",
        "year": 2018,
        "live_weight_t": 1807505.2796781566
    }
]
```

If you wanted to explore bilateral trade relationships for a specific species (salmo salar) in 2019, you would send the following request:
```json
{
    "cols_wanted": "exporter_iso3c,importer_iso3c,year",
    "weight_type": "live_weight_t",
    "start_year": 2019,
    "end_year": 2019,
    "search_criteria": 1,
    "sciname": "salmo salar"
}
```

The final URL would look like this:
`/snet/query?cols_wanted=exporter_iso3c,importer_iso3c,year&weight_type=live_weight_t&start_year=2019&end_year=2019&search_criteria=1&sciname=salmo salar`

Here is a sample response:

```json
[
    {
        "exporter_iso3c": "AUS",
        "importer_iso3c": "CHN",
        "year": 2019,
        "live_weight_t": 7919.87229991926
    },
    {
        "exporter_iso3c": "BEL",
        "importer_iso3c": "COG",
        "year": 2019,
        "live_weight_t": 5205.84567743523
    },
    {
        "exporter_iso3c": "BEL",
        "importer_iso3c": "NLD",
        "year": 2019,
        "live_weight_t": 2997.68945007121
    },
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
        - cols_wanted **(REQUIRED)**: A string corresponding to the columns, comma separated, that will be returned for each row.
        - search_criteria **(REQUIRED)**: Either 1 or 0. 1 notes that additional filtering criteria will be included, 0 notes no filter criteria is required. Note all optional parameters sent will be treated as filtering criteria if search_criteria is set to 1. If search_criteria is set to 0, then all optional parameters will be ignored.

### Examples

If you wanted to get all scientific names for all the species / species groups in ARTIS you would send a request to the `/supplemental` endpoint with the following parameters:
```json
{
    "table": "sciname",
    "variable": "sciname"
}
```

The final URL would be:
`/supplemental/?table=sciname&variable=sciname`

Here is sample response:
```json
{
    "sciname": [
        "eucinostomus melanopterus",
        "nassarius",
        "merlucciidae",
        "stellifer minor",
        "malacocephalus occidentalis",
        "patagonotothen ramsayi",
        "pomadasys kaakan",
        "carangoides malabaricus"
    ]
}
```

If you wanted to get all common names for all the species / species groups in ARTIS, you would send a request to the `/supplemental` endpoint with the following parameters:

```json
{
    "table": "sciname",
    "variable": "common_name"
}
```

The final URL would be:
`/supplemental/?table=sciname&variable=common_name`

Here is a sample response:
```json
"common_name": [
        "scomber mackerels nei",
        "mango tilapia",
        "ocellated wedge sole",
        "spotted porcupinefish",
        "shi drum",
        "leopard fish",
        "globose clam",
        "geelbek croaker"
]
```

If you wanted to get all scientific, common names and ISSCAAP groups for a specific genus (for example thunnus) you would send a request to the `/supplemental/query` endpoint with the following parameters:

```json
{
    "table": "sciname",
    "cols_wanted": "sciname,common_name,isscaap",
    "search_criteria": 1,
    "genus": "thunnus"
}
```
The final URL would be:
`/supplemental/query?table=sciname&cols_wanted=sciname,common_name,isscaap&search_criteria=1&genus=thunnus`

Here is a sample response:
```json
[
    {
        "sciname": "thunnus",
        "common_name": "tunas nei",
        "isscaap": "Tunas, bonitos, billfishes"
    },
    {
        "sciname": "thunnus alalunga",
        "common_name": "albacore",
        "isscaap": "Tunas, bonitos, billfishes"
    }
]
```

If you wanted to get production of all USA and Chilean salmo salar by production method and year, you would send a request to the `/supplemental/query` endpoint with the following parameters:

```json
{
    "table": "production",
    "cols_wanted": "iso3c,method,year,live_weight_t",
    "search_criteria": 1,
    "sciname": "salmo salar",
    "iso3c": "USA,CHL"
}
```
The final URL would be:
`/supplemental/query?table=production&cols_wanted=iso3c,method,year,live_weight_t&search_criteria=1&sciname=salmo salar&iso3c=USA,CHL`

Here is a sample response:
```json
[
    {
        "iso3c": "CHL",
        "sciname": "salmo salar",
        "method": "aquaculture",
        "habitat": "inland",
        "live_weight_t": 493.49,
        "year": 2018
    },
    {
        "iso3c": "CHL",
        "sciname": "salmo salar",
        "method": "aquaculture",
        "habitat": "marine",
        "live_weight_t": 660644.9,
        "year": 2018
    },
    {
        "iso3c": "USA",
        "sciname": "salmo salar",
        "method": "aquaculture",
        "habitat": "marine",
        "live_weight_t": 16107,
        "year": 2018
    }
]
```


