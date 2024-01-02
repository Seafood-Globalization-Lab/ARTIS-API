
// Modules
import { NextFunction, Request, Response } from 'express';
import { supplementalTables, scinameCols, countriesCols, productsCols, productionCols, baciCols } from '../db'
import Joi from 'joi';

const Schemas = {
    /* structure for /sciname */
    colReq: Joi.object({
        table: Joi.string().valid(...supplementalTables).required(),
        // Only contains a "variable" field which NEEDS to be a sciname metadata column name 
        variable: Joi.string()
                        .when('table', { is: 'sciname', then: Joi.string().valid(...scinameCols).required() })
                        .when('table', { is: 'countries', then: Joi.string().valid(...countriesCols).required() })
                        .required()
    }),
    /* structure for /sciname/query */
    queryReq: Joi.object({
        table: Joi.string().valid(...supplementalTables).required(),
        // can only ask for columns in the sciname metadata table
        colsWanted: Joi.string().required(),
        searchCriteria: Joi.number().integer().valid(0, 1).required()
    }).unknown(true)
}

export default Schemas;
