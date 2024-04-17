
import { Router } from 'express';
import { pgJobsQ } from '../db';
import { validateSchema } from '../middleware';
import { snetSchemas } from '../schemas';

// Router to manage all requests involving seafood trade network data
const router = Router();

router.get('/query', validateSchema(snetSchemas.queryReq),  async (req, res) => {

    try {
        const colsWanted: string[] = decodeURI(String(req.query.cols_wanted)).split(',');
        const weightType: string = String(req.query.weight_type);
        const filteredSearch: number = parseInt(String(req.query.search_criteria));

        let criteria: any = {
            jobName: 'snet',
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

            // if a custom hs version year pairing is not provided then a start and end year must be provided
            if (!('custom_timeline' in criteria.searchCriteria)) {

                // Get start and end year from requests
                criteria["searchCriteria"]["start_year"] = parseInt(criteria["searchCriteria"]["start_year"]);
                criteria["searchCriteria"]["end_year"] = parseInt(criteria["searchCriteria"]["end_year"]);
                // place start and end year within a year array
                criteria["searchCriteria"]["year"] = [criteria["searchCriteria"]["start_year"], criteria["searchCriteria"]["end_year"]];
                // remove start and end year from search criteria since we will be using a year array
                delete criteria["searchCriteria"]["start_year"];
                delete criteria["searchCriteria"]["end_year"];
            }
        }

        // Sending request to ARTIS database
        const jobSubmitted = await pgJobsQ.addJobToQ(criteria);
        res.status(200).json(jobSubmitted);
    }
    catch(e) {
        res.sendStatus(500);
    }
});

export default router;
