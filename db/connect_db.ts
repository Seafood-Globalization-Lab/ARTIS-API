
// Modules
const config = require('config');
const pgp = require('pg-promise')();

// log in data for ARTIS data base connection
const cn = config.get('artis_db_cn');
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
interface IMetadataCriteria {
    colsWanted: string[]
    searchCriteria: IMetadataSearchCriteria
}

// metadata column response
interface IMetadataColResponse {
    [property: string]: string[]
}

const createColQuery = (tblName: string, colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

export const sendMetadataColQuery = async (tblName: string, colName: string) => {
    // Creating a SQL query string for dstinct values in sciname metadata column
    const query: string = createColQuery(tblName, colName);

    try {
        // sending SQL query to database
        const resp = await sendQuery(query);
        // formating final response
        let finalResult: IMetadataColResponse = {
            [colName]: resp
                    .map((item: IMetadataColResponse) => { return item[colName]; })
                    .filter((item: string) => {return item.length > 0; })
        }
        return finalResult;
    }
    catch(e) {
        console.log(e);
    }
}

export const sendQuery = async (query: string) => {
    try {
        return await db.any(query);
    }
    catch(e) {
        console.log(e);
    }
}