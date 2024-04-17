
// Modules
import { Router } from 'express';
import { generate_key } from '../authentication';
import { queryUsers } from '../db'

// Router for authentication
const router = Router();

// Registers a new API user and returns their new API key
router.post('/create_user', async (req, res) => {

    try {
        // Check that the user submitting the request is a 'master' user and has write priviledges
        const request_key = req.header('X-API-KEY').toString();
        const valid_user = await queryUsers(`SELECT * FROM users WHERE write = TRUE AND user_type = 'master' AND api_key = '${request_key}'`);
        if (valid_user.length != 1) {
            return res.status(403).json({ "message": "Invalid API key" });
        }

        // Check if user already exists return an error message back stating that user already exists
        // Required parameters
        const first_name = req.body.first_name.toString();
        const last_name = req.body.last_name.toString();
        const user_email = String(req.body.email);

        // check if user already exists
        const user_exists = await queryUsers(`SELECT * FROM users WHERE first_name = '${first_name}' AND last_name = '${last_name}' AND email = '${user_email}'`);
        if (user_exists.length > 0) {
            return res.status(409).json({'message': 'User already exists.'})
        }

        // if expiration date is not provided then the default is 1 year from now
        let expiration_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        // otherwise expiration date is determined by request
        if ('expiration_date' in req.body) {
            const expiration_details : string = String(req.body.expiration_date);
            expiration_date = new Date(expiration_details);
        }

        // if user type and permissions are not provided make a default collaborator user with read permissions, NO write permissions
        const user_type = req.body.user_type ? req.body.user_type : "collaborator";
        const write_permission = req.body.write_permission ? req.body.write_permission : false;
        const read_permission = req.body.read_permission ? req.body.read_permission : true;

        // Keep generating a new key until the key is not found amongst existing keys
        let key_exists = [];
        let new_key = '';
        do {
            new_key = generate_key();
            key_exists = await queryUsers(`SELECT * FROM users WHERE api_key = '${new_key}'`)
        } while (key_exists.length > 0);

        const resp = await queryUsers(`INSERT INTO users(first_name,last_name,email,api_key,user_type,write,read,expiration_date) VALUES('${first_name}', '${last_name}', '${user_email}', '${new_key}', '${user_type}', ${write_permission}, ${read_permission}, '${expiration_date.toISOString()}')`)
        // return successful code with the API key for the newly created user

        return res.status(200).json({'api_key': new_key});
    }
    catch(e) {
        return res.sendStatus(500);
    }

    
})


// Deletes an API user
// Note: only master users can delete users
router.post('/delete_user', async (req, res) => {

    try {
        // Check that the user submitting the request is a 'master' user and has write priviledges
        const request_key = req.header('X-API-KEY').toString();
        const valid_user = await queryUsers(`SELECT * FROM users WHERE write = TRUE AND user_type = 'master' AND api_key = '${request_key}'`)
        if (valid_user.length != 1) {
            return res.status(403).json({ "message": "Invalid API key" });
        }
    
        // Get user details: email, api_key
        const user_email = String(req.body.email);
        const user_key = String(req.body.api_key);

        // Query database
        const delete_result = await queryUsers(`DELETE FROM users WHERE api_key = '${user_key}' AND email = '${user_email}'`)
        // If user does not exist no work required send 200 back

        // if user exists submit a delete request to database and send 200 back
        return res.status(200).json({'api_key': user_key});

    }
    catch(e) {
        return res.sendStatus(500);
    }
    
})

// Changes a current API user's permissions
// Note: only master users can change user records
router.put('/update_user', async (req, res) => {

    // Get user details: first name, last name, email
    // Get update details: new expiration date, new permissions

    // Query database for user

    // if user does not exist send error code back

    // if user exists send database request to change the user and send 200 back

    res.sendStatus(404);
})

export default router;

