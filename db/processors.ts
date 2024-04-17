
import { Job } from 'bullmq';

export const echoMessage = async (job: Job) => {

    console.log(`processing job ${job.id} with message ${job.data.message}`)

    const new_message = `job ${job.id} outgoing message ${job.data.message}`
    return new_message;
}
