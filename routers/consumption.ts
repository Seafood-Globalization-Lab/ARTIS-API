
// Modules
import { Router } from 'express';
import { sendConsumptionQuery } from '../db';

const router = Router();

// Getting snet data: specific columns and filter based on specific criteria
router.get('/query', async (req, res) => {
    try {
        const colsWanted: string[] = decodeURI(String(req.query.cols_wanted)).split(",");
        const filteredSearch: number = parseInt(String(req.query.search_criteria));

        let criteria: any = {
            colsWanted: colsWanted,
            searchCriteria: {}
        };

        const baseParams: string[] = ["cols_wanted", "search_criteria"];

        if (filteredSearch === 1) {

            Object.entries(req.query).forEach(([key, value]) => {
                // only parse non base parameters for filtering criteria
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

        // Sending request to ARTIS database
        const finalResult = await sendConsumptionQuery(criteria);

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