
// Modules
import { Router } from 'express';
import { sendScinameColQuery } from '../db';
import scinameSchemas from '../schemas/sciname';
import validateSchema from '../middleware/schemaValidator';

// Router for scinames
const router = Router();

// GET all distinct values from the ARTIS sciname table for a particular column
router.get('/', validateSchema(scinameSchemas.colReq), async (req, res) => {

    try {
        // sciname metadata column
        const colName: string = req.body.variable;

        // Requesting ARTIS database for a specific column
        const finalResult = await sendScinameColQuery(colName);
        
        // returns results
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})


export default router;