
// Modules
import { Job, Worker } from 'bullmq';
import { redisOptions } from './connect_db';
import { PgQueue, IConnectionOptions } from './queue'
const dotenv = require('dotenv').config();

export class PgWorker {
    // Member Variables-----------------------------------------------------------------
    private qName: string;
    private connectionOptions: IConnectionOptions;
    private worker: Worker;
    private processor: any;

    // Constructor----------------------------------------------------------------------
    // Provide a queue for this worker to join
    constructor(qName: string, processor, connectionOptions: IConnectionOptions) {
        this.qName = qName;
        this.connectionOptions = connectionOptions;
        this.processor = processor;
        this.worker = new Worker(this.qName, this.processor, { connection: this.connectionOptions, autorun: true });
    };
}


// Sets up X workers for a particular queue
export const setUpWorkers = (workers: PgWorker[], qName: string, processor, num_workers: number) => {

    for (let i = 0; i < num_workers; ++i) {
        workers.push(new PgWorker(qName, processor, redisOptions));
    }

    return workers;
}

