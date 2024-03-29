
// Modules
// const config = require('config');
const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();

// log in data for ARTIS data base connection
//const cn = config.get('artis_db_cn');
const ssl = {rejectUnauthorized: false};
let cn = null;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV == 'test') {
    cn = {
        "host": process.env.DB_HOST,
        "user": process.env.DB_USER,
        "port": process.env.DB_PORT,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME
    };
}

if (process.env.NODE_ENV === 'production') {
    cn = {
        connectionString: process.env.DATABASE_URL,
        max: 30,
        ssl: ssl
    };
}

// Connecting to database
const db = pgp(cn);

// metadata table result structure
interface IMetadataTblResult {
    [property: string]: string
}

// metadata table search criteria structure
interface IMetadataSearchCriteria {
    [key: string]: string[]
}

// metadata request structure
export interface IMetadataCriteria {
    colsWanted: string[]
    searchCriteria: IMetadataSearchCriteria
}

// metadata column response
interface IMetadataColResponse {
    [property: string]: string[]
}

const createColQuery = (tblName: string, colName: string): string => {
    if (colName === "order") { colName = '"' + colName + '"'; }
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

export const sendQuery = async (query: string) => {
    try {
        return await db.any(query);
    }
    catch(e) {
        throw new Error(e);
    }
}

export const sendMetadataColQuery = async (tblName, colName) => {
    // Creating a SQL query string for dstinct values in sciname metadata column
    const query: string = createColQuery(tblName, colName);

    try {
        // sending SQL query to database
        const resp = await sendQuery(query);

        // formating final response
        let finalResult: IMetadataColResponse = {
            [colName]: resp
                    .map((item: IMetadataColResponse) => { return item[colName]; })
                    .filter((item: string) => {return item && item.length > 0; })
        }
        return finalResult;
    }
    catch(e) {
        throw new Error(e);
    }
}

const createMetadataQuery = (tblName: string, criteria: IMetadataCriteria) => {
    let query = 'SELECT ' + criteria.colsWanted.join(', ') + ` FROM ${tblName}`;

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

export const sendMetadataQuery = async (tblName: string, criteria: IMetadataCriteria) => {
    try {
        const query: string = createMetadataQuery(tblName, criteria);
        const resp = await sendQuery(query);
        return resp;
    }
    catch(e) {
        throw new Error(e);
    }
}