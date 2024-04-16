
// Modules
import { NextFunction, Request, Response } from 'express';
import { consumptionCols, consumptionWeightTypes, consumptionHabitats, consumptionMethods, consumptionExportSources } from '../db/consumption';
import Joi from 'joi';

const Schemas = {

    queryReq: Joi.object({
        cols_wanted: Joi.string().required(),// Joi.array().items(Joi.string().valid(...consumptionCols)).required(),
        search_criteria: Joi.number().integer().valid(1, 0).required(),
        exporter_iso3c: Joi.string().optional(),
        consumer_iso3c: Joi.string().optional(),
        source_country_iso3c: Joi.string().optional(),
        sciname: Joi.string().optional(),
        habitat: Joi.string().optional(),
        method: Joi.string().optional(),
        dom_source: Joi.string().optional(),
        consumption_source: Joi.string().optional(),
        start_year: Joi.number().integer().min(1996).max(2020).required(),
        end_year: Joi.number().integer().min(1996).max(2020).required()
    })
}

export default Schemas;