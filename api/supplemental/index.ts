import { sendMetadataColQuery, sendMetadataQuery } from '../../db';
import { supplementalSchemas } from '../../schemas';
import { authenticate, validateSchema } from '../../middleware';

export const GET = authenticate(
    validateSchema(supplementalSchemas.colReq)(async (req) => {
        const query = new URL(req.url).searchParams;
        try {
            // supplemental metadata column
            const tblName: string = String(query.get('table'));
            const colName: string = String(query.get('variable'));
            // Requesting ARTIS database for a specific metadata column column
            const finalResult = await sendMetadataColQuery(tblName, colName);

            if (finalResult[colName].length > 0) {
                return new Response(JSON.stringify(finalResult), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                return new Response(null, { status: 204 });
            } // no results
        } catch (e) {
            console.error(e);

            return new Response(null, { status: 500 });
        }
    })
);
