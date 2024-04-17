

// Modules
import { Router } from 'express';
import { pgJobsQ } from '../db';

// Example router that just echos a message
const router = Router();

// GET message
router.get('/', async (req, res) => {

    try {
        const message = String(req.query.message);
        const jobAdded = await pgJobsQ.addJobToQ({ jobName: 'echo', message: message });
        return res.json({ jobId: jobAdded.id, message: jobAdded.data.message });
    }
    catch (e) {
        throw new Error(e);
    }
})

// Return job update
router.get('/jobUpdate', async (req, res) => {
    
    try {
        const requestedId = String(req.query.id);
        const jobUpdate = await pgJobsQ.checkJobStatus(requestedId);
        return res.json(jobUpdate);
    }
    catch(e) {
        throw new Error(e);
    }
})

export default router;
