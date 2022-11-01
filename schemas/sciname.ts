
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const Schemas = {
    colReq: Joi.object({
        variable: Joi.string()
    })
}

export default Schemas;
