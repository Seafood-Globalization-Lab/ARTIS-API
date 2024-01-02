
// Modules
import { Router } from 'express';
import { IMetadataCriteria, sendMetadataColQuery, sendMetadataQuery } from '../db';
import supplementalSchemas from '../schemas/supplemental';
import { validateQuerySchema } from '../middleware/schemaValidator';
import { createRequire } from 'module';

// Router for supplementals
const router = Router();

// GET all distinct values from the ARTIS supplemental table for a particular column
router.get('/', validateQuerySchema(supplementalSchemas.colReq), async (req, res) => {

    try {

        // supplemental metadata column
        const tblName = req.query.table;
        const colName = req.query.variable;
        // Requesting ARTIS database for a specific column
        const finalResult = await sendMetadataColQuery(tblName, colName);
        // returns results
        res.json(finalResult);
    }
    catch(e) {
        res.sendStatus(500);
    }
})

// GET specific columns and filter supplemental metadata based on certain criteria
router.get('/query', async (req, res) => {

    try {
        // Getting criteria from body
        const tblName: string = String(req.query.table);
        let criteria: any = {
            colsWanted: String(req.query.colsWanted).split(","),
        };

        const filteredSearch: Number = parseInt(String(req.query.searchCriteria));
        const baseParams: String[] = ["table", "colsWanted", "searchCriteria"];

        if (filteredSearch === 1) {

            criteria['searchCriteria'] = {};

            Object.entries(req.query).forEach(([key, value]) => {
                // only parse non base parameters for filtering criteria
                if (!baseParams.includes(key)) {
                    criteria['searchCriteria'][key] = String(value).split(",")
                }
            })
        }
        // Sending supplemental metadata request to ARTIS database
        const finalResult: any = await sendMetadataQuery(tblName, criteria);
        // Sending supplemental metadata back
        res.json(finalResult);
    }
    catch(e) {
        res.sendStatus(500);
    }
})

export default router;
