
import { NextFunction, Request, Response } from 'express';
import { scinameCols } from '../connections/connect'
import Joi from 'joi';

const Schemas = {
    colReq: Joi.object({
        variable: Joi.string().valid(...scinameCols).required()
    })
}

export default Schemas;
