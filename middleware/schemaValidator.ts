
import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';

const validateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        }
        catch(e) {
            console.log(e);
            return res.status(400).json({ e });
        }
    }
};


export default validateSchema;