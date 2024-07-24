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

        // Get user details: email, api_key
        const user_email = body.email;
        const user_key = body.api_key;

        // Query database
        await queryUsers(
            `DELETE FROM users WHERE api_key = '${user_key}' AND email = '${user_email}'`
        );

        // If user does not exist no work required send 200 back
        return new Response(JSON.stringify({ api_key: user_key }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(null, { status: 500 });
    }
});
