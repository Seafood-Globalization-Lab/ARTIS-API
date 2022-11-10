
import { IMetadataCriteria, sendMetadataColQuery, sendMetadataQuery } from './connect_db'

// Makes an ARTIS DB request unique values from a specific column in countries metadata
export const sendCountriesColQuery = async (colName: string) => {

    try {
        // sending SQL query to database
        const resp = await sendMetadataColQuery('countries', colName);
        return resp;
    }
    catch(e) {
        console.log(e);
    }
}


// Makes an ARTIS DB request for countries metadata based on specific criteria
export const sendCountriesQuery = async (countriesRequest: IMetadataCriteria) => {
    try {
        const resp = await sendMetadataQuery('countries', countriesRequest);
        return resp;
    }
    catch(e) {
        console.log(e);
    }
}

// Countries columns
export const countriesCols = [
    'iso3c', 'country_name', 'owid_region', 'continent'
];