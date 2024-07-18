import { sendMetadataQuery } from '../../db';

export async function GET(req: Request) {
    const query = new URL(req.url).searchParams;

    try {
        // Getting criteria from body
        const tblName: string = String(query.get('table'));
        let criteria: any = {
            colsWanted: decodeURI(String(query.get('cols_wanted'))).split(','),
        };

        // Special case "order" column name for sciname metadata table
        criteria.colsWanted.forEach((item, index) => {
            if (item === 'order') {
                criteria.colsWanted[index] = '"order"';
            }
        });

        const filteredSearch: Number = parseInt(
            String(query.get('search_criteria'))
        );
        const baseParams: String[] = [
            'table',
            'cols_wanted',
            'search_criteria',
        ];

        if (filteredSearch === 1) {
            criteria['searchCriteria'] = {};

            for (const [key, value] of query.entries()) {
                // only parse non base parameters for filtering criteria
                if (!baseParams.includes(key)) {
                    criteria['searchCriteria'][key] = decodeURI(
                        String(value)
                    ).split(',');
                }
            }
        }
        // Sending supplemental metadata request to ARTIS database
        const finalResult: any = await sendMetadataQuery(tblName, criteria);

        if (finalResult.length > 0) {
            // Sending supplemental metadata back
            return new Response(JSON.stringify(finalResult), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(null, { status: 204 });
        }
    } catch (e) {
        console.log(e);

        return new Response(null, { status: 500 });
    }
}
