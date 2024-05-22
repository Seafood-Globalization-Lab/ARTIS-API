
import { Router } from 'express';
import { pgJobsQ } from '../db';

const router = Router();

// Return job update
router.get('/status', async (req, res) => {
    
    try {
        const requestedId = String(req.query.id);
        const jobUpdate = await pgJobsQ.checkJobStatus(requestedId);
        return res.json(jobUpdate);
    }
    catch(e) {
        throw new Error(e);
    }
});


export default router;
