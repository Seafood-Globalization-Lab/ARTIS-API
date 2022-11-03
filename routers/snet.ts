
// Modules
import { Router } from 'express';
import validateSchema from '../middleware/schemaValidator';
import { sendSnetQuery } from '../db/snet';

const router = Router();

// Getting snet data: specific columns and filter based on specific criteria
router.get('/query', async (req, res) => {
    try {
        // Columns and data for filtering
        const criteria = req.body;
        // Sending request to ARTIS database
        const finalResult = await sendSnetQuery(criteria);
        // Sending response back
        res.json(finalResult);
    }
    catch(e) {
        console.log(e);
    }
})

export default router;