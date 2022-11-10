
// Modules
import { Router } from 'express';
import { sendMetadataColQuery, sendMetadataQuery } from '../db';
import productionSchemas from '../schemas/production';
import validateSchema from '../middleware/schemaValidator';

// Router for scinames
const router = Router();

// GET all distinct values from the ARTIS sciname table for a particular column
router.get('/', validateSchema(productionSchemas.colReq), async (req, res) => {

    try {
        // sciname metadata column
        const colName: string = req.body.variable;
        // Requesting ARTIS database for a specific column
        const finalResult = await sendMetadataColQuery('production', colName);
        // returns results
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})

// GET specific columns and filter sciname metadata based on certain criteria
router.get('/query', validateSchema(productionSchemas.queryReq), async (req, res) => {

    try {
        // Getting criteria from body
        const criteria: any = req.body;
        // Sending sciname metadata request to ARTIS database
        const finalResult: any = await sendMetadataQuery('production', criteria);
        // Sending sciname metadata back
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})


export default router;
