
import { redisOptions } from './connect_db';
import { Queue, Job } from 'bullmq';
import { PgWorker, setUpWorkers } from './worker';
import { processPgReq } from './processors';

export interface IConnectionOptions {
    host: string;
    port: number;
}

export class PgQueue {

    // Member variables----------------------------------------------------------------------
    // redis database connection details
    private connectionOptions: IConnectionOptions;

    // config options for when to remove jobs from queue
    // note this is in seconds
    private readonly DEFAULT_REMOVE_CONFIG = {
        removeOnComplete: {
            age: 0.5 * 60
        },
        removeOnFail: {
            age: 0.5 * 60
        }
    };

    private q: Queue;

    // Constructor----------------------------------------------------------------------
    constructor(qName, connectionOptions) {
        this.connectionOptions = connectionOptions;
        this.q = new Queue(qName, { connection: this.connectionOptions });
    }
    
    // Methods---------------------------------------------------------------------------

    // Add a job to the queue
    public addJobToQ = async (data: any) => {
        return await this.q.add(data.jobName, data, this.DEFAULT_REMOVE_CONFIG);
    }

    // Check the status of a job in the queue
    public checkJobStatus = async (jobId: any) => {

        // Get job status based on job id provided
        const jobStatus = await this.q.getJobState(jobId);

        // job update will always return that job status
        let jobUpdate = {
            status: jobStatus,
            result: []
        };

        // if the job has been completed then the result of the job is provided
        if (jobStatus === 'completed') {
            const requestedJob = await this.q.getJob(jobId);
            jobUpdate.result = requestedJob.returnvalue;
            // remove job to optimize memory
            await requestedJob.remove();
        }
        
        return jobUpdate
    }
}

// Queue that manages all Postgres requests
export const pgJobsQ = new PgQueue('pgJobsQ', redisOptions);

// setting up workers of the Postgres queue
export let workers: PgWorker[] = [];
workers = setUpWorkers(workers, 'pgJobsQ', processPgReq, Number(process.env.NUM_PG_WORKERS));
