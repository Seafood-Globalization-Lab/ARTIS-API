// Modules
import {
    supplementalTables,
    scinameCols,
    countriesCols,
    productsCols,
} from '../db';
import Joi from 'joi';

export const supplementalSchemas = {
    /* structure for /sciname */
    colReq: Joi.object({
        table: Joi.string()
            .valid(...supplementalTables)
            .required(),
        // Only contains a "variable" field which NEEDS to be a sciname metadata column name
        variable: Joi.string()
            .when('table', {
                is: 'sciname',
                then: Joi.string()
                    .valid(...scinameCols)
                    .required(),
            })
            .when('table', {
                is: 'countries',
                then: Joi.string()
                    .valid(...countriesCols)
                    .required(),
            })
            .when('table', {
                is: 'products',
                then: Joi.string()
                    .valid(...productsCols)
                    .required(),
            })
            .required(),
    }),
    /* structure for /sciname/query */
    queryReq: Joi.object({
        table: Joi.string()
            .valid(...supplementalTables)
            .required(),
        // can only ask for columns in the sciname metadata table
        cols_wanted: Joi.string().required(), // TODO: this needs to be a regex expression for all accepted columns
        search_criteria: Joi.number().integer().valid(0, 1).required(),
    }).unknown(true),
};
