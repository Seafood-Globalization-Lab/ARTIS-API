
// Modules
import { NextFunction, Request, Response } from 'express';
import { productionCols } from '../db'
import Joi from 'joi';

const Schemas = {

    /* structure for /sciname */
    colReq: Joi.object({
        // Only contains a "variable" field which NEEDS to be a sciname metadata column name 
        variable: Joi.string().valid(...productionCols).required()
    }),
    /* structure for /sciname/query */
    queryReq: Joi.object({
        // can only ask for columns in the sciname metadata table
        colsWanted: Joi.array().items(Joi.string().valid(...productionCols)).required(),
        // OPTIONAL: object where keys are sciname metadata column names, values are filtering criteria
        searchCriteria: Joi.object().optional()
    })
}

export default Schemas;
