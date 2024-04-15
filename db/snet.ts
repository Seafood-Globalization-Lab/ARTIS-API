
// Modules
import { sendQuery } from './connect_db'

// year is a number array, all other filtering criteria are string arrays
interface ISnetSearchCriteria {
    [property: string]: string[] | number[];
}

// Snet DB request format
interface ISnetCriteria {
    colsWanted: string[],
    weightType: string,
    searchCriteria: ISnetSearchCriteria
}

// Creates SQL query for ARTIS snet table
const createSnetQuery = (criteria: ISnetCriteria): string => {

    console.log(criteria);
    
    // initial 
    let query = `SELECT ${criteria.colsWanted.join(', ')}, SUM(${criteria.weightType}) AS ${criteria.weightType} FROM snet`;

    let minYear: number = 1996;
    let maxYear: number = 2020;

    // filter years first to make this sql request more efficient
    if ('searchCriteria' in criteria) {
        if ('year' in criteria.searchCriteria) {

            minYear = Number(criteria.searchCriteria.year[0]);
            maxYear = Number(criteria.searchCriteria.year[1]);
            // query = 'WITH t1 as (' + query + ') SELECT * FROM t1 WHERE ' + `year >= ${minYear} AND year <= ${maxYear}`
        }
    }

    query = query + ` WHERE year >= ${minYear} AND year <= ${maxYear}`

    // add in default hs version - year pairings
    const custom_artis_hs_years = ["HS96-1996-2003", "HS02-2004-2009", "HS07-2010-2012", "HS12-2013-2020"];

    let hs_years_requested = custom_artis_hs_years;
    // include user requested HS version - year timeseries
    if ('searchCriteria' in criteria) {
        if ('custom_timeline' in criteria.searchCriteria) {
            hs_years_requested = criteria.searchCriteria.custom_timeline.map(String);
        }

        delete criteria['searchCriteria']['custom_timeline']
    }

    console.log(hs_years_requested);

    // build hs version - year conditional statement
    let hs_years = "";
    for (let i = 0; i < hs_years_requested.length; i++) {

        let curr_hs_year = hs_years_requested[i].split("-");
        let curr_hs = curr_hs_year[0];
        let curr_start = curr_hs_year[1];
        let curr_end = curr_hs_year[2];
        hs_years = hs_years + `(hs_version = '${curr_hs}' AND year >= ${curr_start} AND year <= ${curr_end}) OR `;
    }
    hs_years = "(" + hs_years.slice(0, -4) + ")";
    query = query + ' AND ' + hs_years;

    console.log(query)

    // if there are filtering criteria
    if ('searchCriteria' in criteria) {

        query = query + ' AND '

        // create conditions for all filtering criteria
        for (const k of Object.keys(criteria.searchCriteria)) {
            // year just has a min and max year
            if (k != 'year') {

                let currCriteria: string[] = criteria.searchCriteria[k].map((item: string | number): string => {
                    return `\'${item}\'`;
                });

                // follows format 'VARIABLE in (list of valid values)'
                query = query + `${k} in (${currCriteria.join(', ')}) AND `
            }
        }
        // remove last ' AND '
        query = query.slice(0, query.length - 5);
    }

    // group weight values by columns requested
    query = query + ` GROUP BY ${criteria.colsWanted.join(', ')}`;
    

    console.log(query);

    return query;
}

// Sends snet request to ARTIS database
export const sendSnetQuery = async (criteria: ISnetCriteria) => {
    // snet request to snet SQL query
    const query = createSnetQuery(criteria);
    try {
        // sending request to database
        const resp = await sendQuery(query);

        console.log(resp);
        return resp;
    }
    catch(e) {
        throw new Error(e);
    }
}

export const snetCols: string[] = [
    'exporter_iso3c', 'importer_iso3c', 'source_country_iso3c',
    'hs6', 'sciname', 'method', 'habitat', 'dom_source', 'year'
];

const snetSet = new Set(snetCols);

export const snetWeightTypes: string[] = ['product_weight_t', 'live_weight_t'];
export const snetHabitats: string[] = ['inland', 'marine'];
export const snetMethods: string[] = ['capture', 'aquaculture'];
export const snetExportSources: string[] = ['domestic export', 'foreign export']
