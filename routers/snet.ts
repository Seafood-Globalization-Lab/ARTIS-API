
// Modules
import { Router } from 'express';
import { validateQuerySchema } from '../middleware/schemaValidator';
import snetSchemas from '../schemas/snet';
import { sendSnetQuery } from '../db';

const router = Router();

// Getting snet data: specific columns and filter based on specific criteria
router.get('/query', validateQuerySchema(snetSchemas.queryReq), async (req, res) => {
    try {
        const colsWanted: string[] = decodeURI(String(req.query.cols_wanted)).split(",");
        const weightType: string = String(req.query.weight_type);
        const filteredSearch: number = parseInt(String(req.query.search_criteria));

        let criteria: any = {
            colsWanted: colsWanted,
            weightType: weightType,
            searchCriteria: {}
        };

        const baseParams: string[] = ["cols_wanted", "weight_type", "search_criteria"];

        if (filteredSearch === 1) {

            Object.entries(req.query).forEach(([key, value]) => {
                // only parse non base parameters for filtering criteria
                // iterate over all filtering criteria
                if (!baseParams.includes(key)) {
                    criteria['searchCriteria'][key] = decodeURI(String(value)).split(",")
                }
            })

            if (!('custom_timeline' in criteria.searchCriteria)) {
                criteria["searchCriteria"]["start_year"] = parseInt(criteria["searchCriteria"]["start_year"]);
                criteria["searchCriteria"]["end_year"] = parseInt(criteria["searchCriteria"]["end_year"]);

                criteria["searchCriteria"]["year"] = [criteria["searchCriteria"]["start_year"], criteria["searchCriteria"]["end_year"]];
                delete criteria["searchCriteria"]["start_year"];
                delete criteria["searchCriteria"]["end_year"];
            }
        }

        console.log("here")
        console.log(criteria)

        // Sending request to ARTIS database
        const finalResult = await sendSnetQuery(criteria);
        console.log('here');
        console.log(finalResult);

        if (finalResult.length > 0) {
            // Sending response back
            res.json(finalResult);
        } else {
            res.sendStatus(204);
        }
    }
    catch(e) {
        res.sendStatus(500);
    }
})

export default router;