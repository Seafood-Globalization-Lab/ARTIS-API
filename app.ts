import express from 'express';
import accessRouter from './routers/authenticate';
import consumptionRouter from './routers/consumption';

const app = express();

app.use(express.json());
// creates, deletes, alters user permissions
app.use('/access', accessRouter);
// manages all requests for consumption data
app.use('/consumption', consumptionRouter);

export default app;
