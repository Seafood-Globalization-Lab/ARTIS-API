
// Modules
import { Router } from 'express';
import { sendMetadataColQuery, sendMetadataQuery } from '../db';
import countriesSchemas from '../schemas/countries';
import validateSchema from '../middleware/schemaValidator';

// Router for scinames
const router = Router();

// GET all distinct values from the ARTIS sciname table for a particular column
router.get('/', validateSchema(countriesSchemas.colReq), async (req, res) => {

    try {
        // sciname countries column
        const colName: string = req.body.variable;
        // Requesting ARTIS database for a specific column
        const finalResult = await sendMetadataColQuery('countries', colName);
        // returns results
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})

// GET specific columns and filter sciname metadata based on certain criteria
router.get('/query', validateSchema(countriesSchemas.queryReq), async (req, res) => {

    try {
        // Getting criteria from body
        const criteria: any = req.body;
        // Sending sciname metadata request to ARTIS database
        const finalResult: any = await sendMetadataQuery('countries', criteria);
        // Sending sciname metadata back
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})


export default router;
