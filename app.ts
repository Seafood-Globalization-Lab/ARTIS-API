import express from 'express';
import accessRouter from './routers/authenticate'
import supplementalRouter from './routers/supplemental'
import snetRouter from './routers/snet'
import consumptionRouter from './routers/consumption'
import { authenticate_key } from './middleware/authenticate';

const app = express();

app.use(express.json());
app.use('/', authenticate_key)
app.use('/access', accessRouter);
app.use('/supplemental', supplementalRouter);
app.use('/snet', snetRouter);
app.use('/consumption', consumptionRouter);

export default app;