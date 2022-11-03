
// Modules
import { NextFunction, Request, Response } from 'express';
import { snetCols, snetWeightTypes } from '../db/snet';
import Joi from 'joi';

const Schemas = {

    queryReq: Joi.object({
        colsWanted: Joi.array().items(Joi.string().valid(...snetCols)).required(),
        weightType: Joi.string().valid(...snetWeightTypes).required(),
        searchCriteria: Joi.object().optional()
    })
}

export default Schemas;
