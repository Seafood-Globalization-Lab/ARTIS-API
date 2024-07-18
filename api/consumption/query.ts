import { createConsumptionQuery, makePgRequest } from '../../db';
import { authenticate, validateSchema } from '../../middleware';
import { consumptionSchemas } from '../../schemas';

export const GET = authenticate(
    validateSchema(consumptionSchemas.queryReq)(async (req) => {
        const query = new URL(req.url).searchParams;

        try {
            const colsWanted: string[] = decodeURI(
                String(query.get('cols_wanted'))
            ).split(',');
            const filteredSearch: number = parseInt(
                String(query.get('search_criteria'))
            );

            let criteria: any = {
                colsWanted: colsWanted,
                searchCriteria: {},
            };

            const baseParams: string[] = ['cols_wanted', 'search_criteria'];

            if (filteredSearch === 1) {
                for (const [key, value] of query.entries()) {
                    // only parse non base parameters for filtering criteria
                    if (!baseParams.includes(key)) {
                        criteria['searchCriteria'][key] = decodeURI(
                            String(value)
                        ).split(',');
                    }
                }

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

            const consumptionQuery = createConsumptionQuery(criteria);
            // make a request to the postgresSQL database
            const result = await makePgRequest(consumptionQuery);

            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (e) {
            console.error(e);

            return new Response(null, { status: 500 });
        }
    })
);
