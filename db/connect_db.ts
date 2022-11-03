
// Modules
const config = require('config');
const pgp = require('pg-promise')();

// log in data for ARTIS data base connection
const cn = config.get('artis_db_cn');
// Connecting to database
const db = pgp(cn);

// Structure of Sciname Table Responses
interface IScinameTblResult {
    [property: string]: string
}

export const sendQuery = async (query: string) => {
    try {
        return await db.any(query);
    }
    catch(e) {
        console.log(e);
    }
}