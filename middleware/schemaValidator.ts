
// Modules
import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';

// Checks an incoming request format against a provided schema
// PASSES only if request matches the schema
// REJECTS request and responds with status code 400 and description of error to sender
const validateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request against schema
            await schema.validateAsync(req.body);

            // Passing to next function in pipeline
            next();
        }
        catch(e) {
            // REJECT request
            console.log(e);
            return res.status(400).json({ e });
        }
    }
};


export default validateSchema;