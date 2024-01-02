
// Modules
import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';

// Checks an incoming request format against a provided schema
// PASSES only if request matches the schema
// REJECTS request and responds with status code 400 and description of error to sender
export const validateQuerySchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request against schema
            await schema.validateAsync(req.query);

            // Passing to next function in pipeline
            next();
        }
        catch(e: any) {
            // REJECT request
            return res.status(400).json({ "message": e.details[0].message });
        }
    }
};


export const validateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request against schema
            await schema.validateAsync(req.body);

            // Passing to next function in pipeline
            next();
        }
        catch(e: any) {
            // REJECT request
            return res.status(400).json({ "message": e.details[0].message });
        }
    }
};


