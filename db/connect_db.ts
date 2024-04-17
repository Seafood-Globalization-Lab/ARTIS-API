
// Modules
// const config = require('config');
const pgp = require('pg-promise')();
const dotenv = require('dotenv').config();
const { Queue } = require('bullmq');


// POSTGRES Database Connection-------------------------------------------------
// log in data for ARTIS data base connection
const ssl = {rejectUnauthorized: false};
let cn = null;
// create database connection based on environment variables
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV == 'test') {
    // connection object
    cn = {
        "host": process.env.DB_HOST,
        "user": process.env.DB_USER,
        "port": process.env.DB_PORT,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME
    };
}
// specific production database variables added
if (process.env.NODE_ENV === 'production') {
    cn = {
        connectionString: process.env.DATABASE_URL,
        max: 30,
        ssl: ssl
    };
}
//----------------------------------------------------------------------------------------

// redis database config options----------------------------------------------------------
export const redisOptions = {
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT)
};
//----------------------------------------------------------------------------------------

// Connecting to database
export const db = pgp(cn);

// Send Request over to PostgresSQL database
export const makePgRequest = async (query: string) => {
    try {
        // sending request over to the database
        return await db.any(query);
    }
    catch(e) {
        // throwing any errors that occur
        throw new Error(e);
    }
}

// Metadata requests connect directly to the database
const createColQuery = (tblName: string, colName: string): string => {
    if (colName === "order") { colName = '"' + colName + '"'; }
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

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
