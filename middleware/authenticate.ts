
// Modules
import { NextFunction, Request, Response } from 'express';
import { checkAPIKey } from '../db';

// Authenticates a user's API key for every incoming request
export const authenticate_key = async (req, res, next) => {

    // Get API key from request header
    const apiKey : string = req.header("X-API-KEY");
    // Check api key against list of potential api keys
    const authRecord = await checkAPIKey(apiKey);

    if (authRecord.length === 1) {
        // API key is valid, pass request on to further checks or processing

        // Check API key expiration date
        const expiration : string = authRecord[0]["expiration_date"];
        if (expiration === "never") {
            // If no expiration date has been issued ie master users or ARTIS website pass request along
            next()
        } else {
            // Make sure expiration date is after current timestamp

            // Get timestamp right now
            const currTimestamp = new Date().getTime();
            // Create a datetime object from expiration date in database
            const expTimestamp = new Date(expiration).getTime();

            // if expiration timestamp is after current timestamp process request
            if (expTimestamp > currTimestamp) {
                next()
            }
            else {
                // HTTP 403 response code: Access denied (eg. Invalid API key) due to expiration date
                return res.status(403).json({ "message": "Invalid API key" });
            }
        }
    }
    else {
        // We do not have a record of the API key provided
        // HTTP 403 response code: Access denied (eg. Invalid API key)
        return res.status(403).json({ "message": "Invalid API key" });
    }
}
