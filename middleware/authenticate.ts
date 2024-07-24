// Modules
import { checkAPIKey } from '../db';
import { Middleware } from '../types';

// Authenticates a user's API key for every incoming request
export const authenticate: Middleware = (handler) => {
    return async (req) => {
        // Get API key from request header
        const apiKey = req.headers.get('X-API-KEY');
        // Check api key against list of potential api keys
        const authRecord = await checkAPIKey(apiKey);

        if (authRecord.length === 1) {
            // API key is valid, pass request on to further checks or processing

            // Check API key expiration date
            const expiration: string = authRecord[0]['expiration_date'];

            if (expiration === 'never') {
                // If no expiration date has been issued ie master users or ARTIS website pass request along
                return handler(req);
            } else {
                // Make sure expiration date is after current timestamp

                // Get timestamp right now
                const currTimestamp = new Date().getTime();
                // Create a datetime object from expiration date in database
                const expTimestamp = new Date(expiration).getTime();

                // if expiration timestamp is after current timestamp process request
                if (expTimestamp > currTimestamp) {
                    return handler(req);
                } else {
                    // HTTP 403 response code: Access denied (eg. Invalid API key) due to expiration date
                    return new Response(
                        JSON.stringify({ message: 'Invalid API key' }),
                        {
                            status: 403,
                            headers: { 'Content-Type': 'application/json' },
                        }
                    );
                }
            }
        } else {
            // We do not have a record of the API key provided
            // HTTP 403 response code: Access denied (eg. Invalid API key)
            return new Response(
                JSON.stringify({ message: 'Invalid API key' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    };
};
