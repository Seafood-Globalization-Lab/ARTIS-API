// Modules
import { Router } from 'express';

// router for all consumption data requests
const router = Router();

// Getting snet data: specific columns and filter based on specific criteria
router.get('/query', async (req, res) => {
    try {
        const colsWanted: string[] = decodeURI(
            String(req.query.cols_wanted)
        ).split(',');
        const filteredSearch: number = parseInt(
            String(req.query.search_criteria)
        );

        let criteria: any = {
            jobName: 'consumption',
            colsWanted: colsWanted,
            searchCriteria: {},
        };

        const baseParams: string[] = ['cols_wanted', 'search_criteria'];

        if (filteredSearch === 1) {
            Object.entries(req.query).forEach(([key, value]) => {
                // only parse non base parameters for filtering criteria
                if (!baseParams.includes(key)) {
                    criteria['searchCriteria'][key] = decodeURI(
                        String(value)
                    ).split(',');
                }
            });

            if (!('custom_timeline' in criteria.searchCriteria)) {
                // Get start and end year from requests
                criteria['searchCriteria']['start_year'] = parseInt(
                    criteria['searchCriteria']['start_year']
                );
                criteria['searchCriteria']['end_year'] = parseInt(
                    criteria['searchCriteria']['end_year']
                );
                // place start and end year within a year array
                criteria['searchCriteria']['year'] = [
                    criteria['searchCriteria']['start_year'],
                    criteria['searchCriteria']['end_year'],
                ];
                // remove start and end year from search criteria since we will be using a year array
                delete criteria['searchCriteria']['start_year'];
                delete criteria['searchCriteria']['end_year'];
            }
        }

        // Sending request to ARTIS database
        // const jobSubmitted = await pgJobsQ.addJobToQ(criteria);
        // res.status(200).json(jobSubmitted);
    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;
