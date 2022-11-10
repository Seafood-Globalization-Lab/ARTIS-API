
import { sendQuery } from './connect_db'

// Structure of Countries Table Responses
interface ICountriesTblResult {
    [property: string]: string
}

// Creates a SQL query for all values in a column
const createColQuery = (tblName: string, colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

// Structure for all distinct values within a column of countries table
interface ICountriesColResponse {
    [property: string]: string[]
}

// Creates SQL query string for all values in a column of the countries table
const createCountriesColQuery = (colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM countries`;
}

type ICountriesSearchCriteria = {
    [key: string]: string[]
}

// Structure for a filtered request from countries
interface ICountriesCriteria {
    colsWanted: string[],
    searchCriteria: ICountriesSearchCriteria
}

// Makes an ARTIS DB request unique values from a specific column in countries metadata
export const sendCountriesColQuery = async (colName: string) => {
    // Creating a SQL query string for dstinct values in countries metadata column
    const query: string = createCountriesColQuery(colName);

    try {
        // sending SQL query to database
        const resp = await sendQuery(query);
        // formating final response
        let finalResult: ICountriesColResponse = {
            [colName]: resp
                    .map((item: ICountriesTblResult) => { return item[colName]; })
                    .filter((item: string) => {return item.length > 0; })
        }
        return finalResult;
    }
    catch(e) {
        console.log(e);
    }
}

// Creates SQL query string based on a specific set of criteria
const createCountriesQuery = (criteria: ICountriesCriteria): string =>  {

    let query = 'SELECT ' + criteria.colsWanted.join(', ') + ' FROM countries';

    // if there are filtering criteria
    if ('searchCriteria' in criteria) {
        query = query + ' WHERE ';
        for (const k of Object.keys(criteria.searchCriteria)) {
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

// Makes an ARTIS DB request for countries metadata based on specific criteria
export const sendCountriesQuery = async (countriesRequest: ICountriesCriteria) => {
    const query = createCountriesQuery(countriesRequest);
    try {
        const resp = await sendQuery(query);
        return resp;
    }
    catch(e) {
        console.log(e);
    }
}

// Countries columns
export const countriesCols = [
    'iso3c', 'country_name', 'owid_region', 'continent'
];