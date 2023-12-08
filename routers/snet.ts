
// Modules
import { Router } from 'express';
import { validateSchema } from '../middleware/schemaValidator';
import snetSchemas from '../schemas/snet';
import { sendSnetQuery } from '../db';

const router = Router();

// Getting snet data: specific columns and filter based on specific criteria
router.get('/query', async (req, res) => {
    try {
        const colsWanted: string[] = String(req.query.colsWanted).split(",");
        const weightType: string = String(req.query.weightType);
        const filteredSearch: number = parseInt(String(req.query.searchCriteria));

        let criteria: any = {
            colsWanted: colsWanted,
            weightType: weightType,
            searchCriteria: {}
        };

        const baseParams: string[] = ["colsWanted", "weightType", "searchCriteria"];

        if (filteredSearch === 1) {

            Object.entries(req.query).forEach(([key, value]) => {
                // only parse non base parameters for filtering criteria
                if (!baseParams.includes(key)) {
                    criteria['searchCriteria'][key] = String(value).split(",")
                }
            })

            criteria["searchCriteria"]["start_year"] = parseInt(criteria["searchCriteria"]["start_year"]);
            criteria["searchCriteria"]["end_year"] = parseInt(criteria["searchCriteria"]["end_year"]);

            criteria["searchCriteria"]["year"] = [criteria["searchCriteria"]["start_year"], criteria["searchCriteria"]["end_year"]];
            delete criteria["searchCriteria"]["start_year"];
            delete criteria["searchCriteria"]["end_year"];
        }

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