import { ObjectSchema } from 'joi';
import { Middleware } from '../types';

// Checks an incoming request format against a provided schema
// PASSES only if request matches the schema
// REJECTS request and responds with status code 400 and description of error to sender
export const validateSchema = (schema: ObjectSchema): Middleware => {
    return (handler) => {
        return async (req): Promise<Response> => {
            try {
                // Validate request against schema
                const url = new URL(req.url);
                const query = Object.fromEntries(url.searchParams.entries());

                await schema.validateAsync(query);

                // Passing to next function in pipeline
                return handler(req);
            } catch (e: any) {
                // REJECT request

                console.error(e);

                return new Response(
                    JSON.stringify({ message: e.details[0].message }),
                    {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
        };
    };
};
