import { snetSchemas } from '../../schemas';
import { authenticate, validateSchema } from '../../middleware';
import { createSnetQuery, makePgRequest } from '../../db';

export const GET = authenticate(
    validateSchema(snetSchemas.queryReq)(async (req) => {
        const query = new URL(req.url).searchParams;

        try {
            const colsWanted: string[] = decodeURI(
                String(query.get('cols_wanted'))
            ).split(',');
            const weightType: string = String(query.get('weight_type'));
            const filteredSearch: number = parseInt(
                String(query.get('search_criteria'))
            );

            let criteria: any = {
                colsWanted: colsWanted,
                weightType: weightType,
                searchCriteria: {},
            };

            const baseParams: string[] = [
                'cols_wanted',
                'weight_type',
                'search_criteria',
            ];

            if (filteredSearch === 1) {
                for (const [key, value] of query.entries()) {
                    // only parse non base parameters for filtering criteria
                    // iterate over all filtering criteria
                    if (!baseParams.includes(key)) {
                        criteria['searchCriteria'][key] = decodeURI(
                            String(value)
                        ).split(',');
                    }
                }

                // if a custom hs version year pairing is not provided then a start and end year must be provided
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

            const snetQuery = createSnetQuery(criteria);
            // make a request to the postgresSQL database
            const result = await makePgRequest(snetQuery);

            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (e) {
            console.error(e);

            return new Response(null, { status: 500 });
        }
    })
);
