import express from 'express';
import { authenticate_key } from './middleware/authenticate';
import accessRouter from './routers/authenticate'
import jobsRouter from './routers/jobs'
import snetRouter from './routers/snet'

const app = express();

app.use(express.json());
app.use('/', authenticate_key)
app.use('/access', accessRouter);
app.use('/jobs', jobsRouter);
app.use('/snet', snetRouter);


export default app;