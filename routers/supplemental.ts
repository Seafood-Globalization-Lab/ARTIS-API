
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
        const tblName: string = String(req.query.table);
        const colName: string = String(req.query.variable);
        // Requesting ARTIS database for a specific column
        const finalResult = await sendMetadataColQuery(tblName, colName);

        if (finalResult[colName].length > 0) {
            // returns results
            res.json(finalResult);
        } else {
            res.sendStatus(204);
        }
        
    }
    catch(e) {
        res.sendStatus(500);
    }
})

// GET specific columns and filter supplemental metadata based on certain criteria
router.get('/query', validateQuerySchema(supplementalSchemas.queryReq), async (req, res) => {

    try {
        // Getting criteria from body
        const tblName: string = String(req.query.table);
        let criteria: any = {
            colsWanted: decodeURI(String(req.query.cols_wanted)).split(","),
        };

        // Special case "order" column name for sciname metadata table
        criteria.colsWanted.forEach((item, index) => {
            if (item === "order") {
                criteria.colsWanted[index] = '"order"';
            }
        })

        const filteredSearch: Number = parseInt(String(req.query.search_criteria));
        const baseParams: String[] = ["table", "cols_wanted", "search_criteria"];

        if (filteredSearch === 1) {

            criteria['searchCriteria'] = {};

            Object.entries(req.query).forEach(([key, value]) => {
                // only parse non base parameters for filtering criteria
                if (!baseParams.includes(key)) {
                    criteria['searchCriteria'][key] = decodeURI(String(value)).split(",")
                }
            })
        }
        // Sending supplemental metadata request to ARTIS database
        const finalResult: any = await sendMetadataQuery(tblName, criteria);

        if (finalResult.length > 0) {
            // Sending supplemental metadata back
            res.json(finalResult);
        } else {
            res.sendStatus(204);
        }
        
    }
    catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

export default router;
