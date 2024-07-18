import { generate_key } from '../../authentication';
import { queryUsers } from '../../db';
import { authenticate } from '../../middleware';

export const POST = authenticate(async (req) => {
    try {
        // Check that the user submitting the request is a 'master' user and has write priviledges
        const request_key = req.headers.get('X-API-KEY');
        const valid_user = await queryUsers(
            `SELECT * FROM users WHERE write = TRUE AND user_type = 'master' AND api_key = '${request_key}'`
        );
        if (valid_user.length != 1) {
            return new Response(
                JSON.stringify({ message: 'Invalid API key' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const body = await req.json();

        // Check if user already exists return an error message back stating that user already exists
        // Required parameters
        const first_name = body.first_name;
        const last_name = body.last_name;
        const user_email = body.email;

        // check if user already exists
        const user_exists = await queryUsers(
            `SELECT * FROM users WHERE first_name = '${first_name}' AND last_name = '${last_name}' AND email = '${user_email}'`
        );

        if (user_exists.length > 0) {
            return new Response(
                JSON.stringify({ message: 'User already exists.' }),
                {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // if expiration date is not provided then the default is 1 year from now
        let expiration_date = new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
        );

        // otherwise expiration date is determined by request
        if ('expiration_date' in body) {
            const expiration_details: string = String(body.expiration_date);
            expiration_date = new Date(expiration_details);
        }

        // if user type and permissions are not provided make a default collaborator user with read permissions, NO write permissions
        const user_type = body.user_type ? body.user_type : 'collaborator';
        const write_permission = body.write_permission
            ? body.write_permission
            : false;
        const read_permission = body.read_permission
            ? body.read_permission
            : true;

        // Keep generating a new key until the key is not found amongst existing keys
        let key_exists = [];
        let new_key = '';
        do {
            new_key = generate_key();
            key_exists = await queryUsers(
                `SELECT * FROM users WHERE api_key = '${new_key}'`
            );
        } while (key_exists.length > 0);

        await queryUsers(
            `INSERT INTO users(first_name,last_name,email,api_key,user_type,write,read,expiration_date) VALUES('${first_name}', '${last_name}', '${user_email}', '${new_key}', '${user_type}', ${write_permission}, ${read_permission}, '${expiration_date.toISOString()}')`
        );

        // return successful code with the API key for the newly created user
        return new Response(JSON.stringify({ api_key: new_key }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(null, { status: 500 });
    }
});
