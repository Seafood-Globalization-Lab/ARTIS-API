
import { makePgRequest } from './connect_db'

// Returns rows matching API key
export const checkAPIKey = async (api_key: string) => {

    // Building query to check users with the API key provided
    const query: string = "SELECT * FROM users WHERE api_key = '" + api_key + "'";
    return await makePgRequest(query);
}

// Sends a database request to the Users table
export const queryUsers = async (query: string) => {
    try {
        return await makePgRequest(query);
    }
    catch(e) {
        throw new Error(e);
    }
} 
