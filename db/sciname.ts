
import { sendQuery } from './connect_db'

// Structure of Sciname Table Responses
interface IScinameTblResult {
    [property: string]: string
}

// Creates a SQL query for all values in a column
const createColQuery = (tblName: string, colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

// Structure for all distinct values within a column of sciname table
interface IScinameColResponse {
    [property: string]: string[]
}

// Creates SQL query string for all values in a column of the sciname table
const createScinameColQuery = (colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM sciname`;
}

type IScinameSearchCriteria = {
    [key: string]: string[]
}

// Structure for a filtered request from sciname
interface IScinameCriteria {
    colsWanted: string[],
    searchCriteria: IScinameSearchCriteria
}

// Makes an ARTIS DB request unique values from a specific column in sciname metadata
export const sendScinameColQuery = async (colName: string) => {
    // Creating a SQL query string for dstinct values in sciname metadata column
    const query: string = createScinameColQuery(colName);

    try {
        // sending SQL query to database
        const resp = await sendQuery(query);
        // formating final response
        let finalResult: IScinameColResponse = {
            [colName]: resp
                    .map((item: IScinameTblResult) => { return item[colName]; })
                    .filter((item: string) => {return item.length > 0; })
        }
        return finalResult;
    }
    catch(e) {
        console.log(e);
    }
}

// Creates SQL query string based on a specific set of criteria
const createScinameQuery = (criteria: any): string =>  {

    let query = 'SELECT ' + criteria.colsWanted.join(', ') + ' FROM sciname';

    // if there are filtering criteria
    if (Object.keys(criteria.searchCriteria).length > 0) {
        query = query + ' WHERE ';
        for (const k of Object.keys(criteria.searchCriteria)) {
            let currCriteria: string[] = criteria.searchCriteria[k].map((item: string): string => {
                return `\'${item}\'`;
            });

            query = query + `${k} in (${currCriteria.join(', ')}) AND`
        }

        query = query.slice(0, query.length - 4);
    }

    return query;
}

// Makes an ARTIS DB request for sciname metadata based on specific criteria
export const sendScinameQuery = async (scinameRequest: any) => {
    const query = createScinameQuery(scinameRequest);
    try {
        const resp = await sendQuery(query);
        return resp;
    }
    catch(e) {
        console.log(e);
    }
}

// Sciname columns
export const scinameCols = [
    'sciname', 'common_name', 'genus', 'subfamily', 
    'family', 'order', 'class', 'superclass', 'phylum',
    'kingdom', 'isscaap'
];