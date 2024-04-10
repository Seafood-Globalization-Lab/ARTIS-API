import { NextFunction, Request, Response } from 'express';
import { db_check_api_key } from '../db';

// Authenticates a user's API key
export const authenticate_key = async (req, res, next) => {

    // Get API key from request header
    const api_key : string = req.header("X-API-KEY");
    // Check api key against list of potential api keys
    const auth_record = await db_check_api_key(api_key);

    if (auth_record.length === 1) {
        // API key is valid, pass request on to further checks or processing

        // Check API key expiration date
        const expiration : string = auth_record[0]["expiration_date"];
        if (expiration === "never") {
            // If no expiration date has been issued ie master users or ARTIS website pass request along
            next()
        } else {
            // check expiration date against today's date
            const current_timestamp = new Date().getTime();
            const expiration_timestamp = new Date(expiration).getTime();

            // if expiration timestamp is after current timestamp process request
            if (expiration_timestamp > current_timestamp) {
                next()
            }
            else {
                // HTTP 403 response code: Access denied (eg. Invalid API key)
                return res.status(403).json({ "message": "Invalid API key" });
            }
        }
    }
    else {
        // HTTP 403 response code: Access denied (eg. Invalid API key)
        return res.status(403).json({ "message": "Invalid API key" });
    }

    
}

// Registers a new API user and returns their new API key

// Deletes an API user

// Changes a current API user's permissions

