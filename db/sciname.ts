
import { IMetadataCriteria, sendMetadataColQuery, sendMetadataQuery } from './connect_db'

// Creates a SQL query for all values in a column
const createColQuery = (tblName: string, colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

// Makes an ARTIS DB request unique values from a specific column in sciname metadata
export const sendScinameColQuery = async (colName: string) => {
    try {
        const scinameResult = await sendMetadataColQuery('sciname', colName);
        return scinameResult;
    }
    catch(e) {
        console.log(e);
    }
}

// Makes an ARTIS DB request for sciname metadata based on specific criteria
export const sendScinameQuery = async (scinameRequest: IMetadataCriteria) => {
    try {
        const scinameResult = await sendMetadataQuery('sciname', scinameRequest);
        return scinameResult;
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