
import { makePgRequest } from "./connect_db";

// Note: Metadata requests connect directly to the database

// Creates a SQL request to get unique values in a metadata table column
const createColQuery = (tblName: string, colName: string): string => {
    if (colName === "order") { colName = '"' + colName + '"'; }
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

// Requests unique values from metadata table column
export const sendMetadataColQuery = async (tblName, colName) => {
    // Creating a SQL query string for dstinct values in sciname metadata column
    const query: string = createColQuery(tblName, colName);

    try {
        // sending SQL query to database
        const resp = await makePgRequest(query);

        // formating final response
        let finalResult = {
            [colName]: resp
                    .map((item) => { return item[colName]; })
                    .filter((item: string) => {return item && item.length > 0; })
        }
        return finalResult;
    }
    catch(e) {
        throw new Error(e);
    }
}

// creates a SQL statement for metadata data in the ARTIS database
const createMetadataQuery = (tblName: string, criteria) => {
    let query = 'SELECT ' + criteria.colsWanted.join(', ') + ` FROM ${tblName}`;

    // if there are filtering criteria build conditional SQL statement
    if ('searchCriteria' in criteria) {
        query = query + ' WHERE ';
        // go through all search criteria filtering options
        for (const k of Object.keys(criteria.searchCriteria)) {
            // create a list of the values that for each filtering option and put quotes around them
            let currCriteria: string[] = criteria.searchCriteria[k].map((item: string): string => {
                return `\'${item}\'`;
            });

            // follows format 'VARIABLE in (list of valid values)'
            query = query + `${k} in (${currCriteria.join(', ')}) AND `
        }
        // remove last ' AND '
        query = query.slice(0, query.length - 5);
    }

    return query;
}

// request metadata from the ARTIS database
export const sendMetadataQuery = async (tblName: string, criteria) => {
    try {
        // create metadata query
        const query: string = createMetadataQuery(tblName, criteria);
        // send query to database and return response
        const resp = await makePgRequest(query);
        return resp;
    }
    catch(e) {
        throw new Error(e);
    }
}

// column information for schema checking--------------------------------------------------
// supplemental tables
export const supplementalTables: string[] = ['sciname', 'products', 'countries'];
// Sciname columns
export const scinameCols: string[] = [
    'sciname', 'common_name', 'genus', 'subfamily', 
    'family', 'order', 'class', 'superclass', 'phylum',
    'kingdom', 'isscaap'
];
// Product table columns
export const productsCols: string[] = [
    'hs6', 'description', 'parent', 'classification', 'presentation', 'state'
]
// Countries table columns
export const countriesCols = [
    'iso3c', 'country_name', 'owid_region', 'continent'
];
