
import { Job } from 'bullmq';
import { makePgRequest } from './connect_db';
import { createSnetQuery } from './snet';
import { createConsumptionQuery } from './consumption';

// Example processor function for workers that echos a message back
export const echoMessage = async (job: Job) => {

    console.log(`processing job ${job.id}`)

    const new_message = `job ${job.id} outgoing message`
    return new_message;
}

// main processing function that processes all data requests
export const processPgReq = async (job: Job) => {

    const jobName = job.data.jobName;

    if (jobName === 'snet') { return await processSnet(job); }
    else if (jobName == 'consumption') { return await processConsumption(job); }

    // this type of job cannot be processed
    return 'No result, this type of request is unknown.'
}

// processor to process a data request for the seafood trade network table
const processSnet = async (job: Job) => {
    // get snet request criteria
    const criteria = job.data;
    // get SQL query for snet table
    const snetQuery = createSnetQuery(criteria);
    // make a request to the postgresSQL database
    const result = await makePgRequest(snetQuery);
    return result;
}

// processor to process a data request for consumption data
const processConsumption = async (job: Job) => {
    // get consumption request criteria
    const criteria = job.data;
    // get SQL query for consumption table
    const consumptionQuery = createConsumptionQuery(criteria);
    // make a request to the postgresSQL database
    const result = await makePgRequest(consumptionQuery);

    return result;
}
