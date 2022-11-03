
// Modules
import { NextFunction, Request, Response } from 'express';
import { scinameCols } from '../db/sciname'
import Joi from 'joi';

const Schemas = {

    /* structure for /sciname 
    Only contains a "variable" field which NEEDS to be a sciname metadata column name */
    colReq: Joi.object({
        variable: Joi.string().valid(...scinameCols).required()
    }),

    queryReq: Joi.object({
        colsWanted: Joi.array().items(Joi.string().valid(...scinameCols)).required(),
        searchCriteria: Joi.object().optional()
    })
}

export default Schemas;
