
// Modules
import { NextFunction, Request, Response } from 'express';
import { snetCols, snetWeightTypes, snetHabitats, snetMethods, snetExportSources } from '../db/snet';
import Joi from 'joi';

const Schemas = {

    queryReq: Joi.object({
        cols_wanted: Joi.string().required(),// Joi.array().items(Joi.string().valid(...snetCols)).required(),
        weight_type: Joi.string().valid(...snetWeightTypes).required(),
        search_criteria: Joi.number().integer().valid(1, 0).required(),
        exporter_iso3c: Joi.string().optional(),
        importer_iso3c: Joi.string().optional(),
        source_country_iso3c: Joi.string().optional(),
        hs6: Joi.string().length(6).regex(new RegExp(/\d+/)).optional(),
        sciname: Joi.string().optional(),
        habitat: Joi.string().optional(),
        method: Joi.string().optional(),
        dom_source: Joi.string().optional(),
        start_year: Joi.number().integer().min(1996).max(2020).required(),
        end_year: Joi.number().integer().min(1996).max(2020).required()
    })
}

export default Schemas;
