
import { Job } from 'bullmq';
import { makePgRequest } from './connect_db';

// Example processor function for workers that echos a message back
export const echoMessage = async (job: Job) => {

    console.log(`processing job ${job.id}`)

    const new_message = `job ${job.id} outgoing message`
    return new_message;
}

// main processing function that processes all data requests
export const processPgReq = async (job: Job) => {

    const jobName = job.data.jobName;

    if (jobName === 'snet') {
        return await processSnet(job);
    }

    // this type of job cannot be processed
    return 'No result, this type of request is unknown.'
}

// processor to process a data request for the seafood trade network table
export const processSnet = async (job: Job) => {

    // get snet request criteria
    const criteria = job.data;

    // initial query getting built
    let query = `SELECT ${criteria.colsWanted.join(', ')}, SUM(${criteria.weightType}) AS ${criteria.weightType} FROM snet`;

    let minYear: number = 1996;
    let maxYear: number = 2020;

    // filter years first to make this sql request more efficient
    if ('searchCriteria' in criteria) {
        if ('year' in criteria.searchCriteria) {

            minYear = Number(criteria.searchCriteria.year[0]);
            maxYear = Number(criteria.searchCriteria.year[1]);
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
        // remove custom timeline from search criteria since it has been processed
        delete criteria['searchCriteria']['custom_timeline']
    }

    // build hs version - year conditional statement
    let hs_years = "";
    for (let i = 0; i < hs_years_requested.length; i++) {
        // get current hs version and start and end year for each hs version
        let curr_hs_year = hs_years_requested[i].split("-");
        let curr_hs = curr_hs_year[0];
        let curr_start = curr_hs_year[1];
        let curr_end = curr_hs_year[2];
        // build SQL conditional statement for hs version and year range
        hs_years = hs_years + `(hs_version = '${curr_hs}' AND year >= ${curr_start} AND year <= ${curr_end}) OR `;
    }
    hs_years = "(" + hs_years.slice(0, -4) + ")";
    query = query + ' AND ' + hs_years;

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

    // make a request to the postgresSQL database
    const result = await makePgRequest(query);
    console.log('in processor function')
    console.log(result);
    
    return result;
}
