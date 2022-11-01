
import { Router } from 'express';
import db from '../connections/connect';
import scinameSchemas from '../schemas/sciname';
import validateSchema from '../middleware/schemaValidator';

const router = Router();

// Creates a SQL query for all values in a column
const createColQuery = (tblName: string, colName: string): string => {
    return `SELECT DISTINCT ${colName} FROM ${tblName}`;
}

// Creates SQL query string for all values in a column of the sciname table
const createScinameColQuery = (colName: string): string => {
    return createColQuery('sciname', colName);
}

// Structure of Sciname Table Responses
interface IScinameTblResult {
    [property: string]: string
}

// Structure for all distinct values within a column of sciname table
interface IScinameColResponse {
    [property: string]: string[]
}

// GET all distinct values from the ARTIS sciname table for a particular column
router.get('/', validateSchema(scinameSchemas.colReq), async (req, res) => {

    try {
        const colName: string = req.body.variable;

        // Requesting ARTIS database for a specific column
        const query = createScinameColQuery(colName);
        const dbResp = await db.any(query);
        
        // Database response is an array of objects with a sciname key, flattening this to an array of strings
        let finalResult: IScinameColResponse = {
            [colName]: dbResp.map((item: IScinameTblResult) => { return item[colName] })
        }

        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})


export default router;