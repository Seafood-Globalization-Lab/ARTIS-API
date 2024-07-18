import express from 'express';
import { authenticate_key } from './middleware';
import accessRouter from './routers/authenticate';
import supplementalRouter from './routers/supplemental';
import snetRouter from './routers/snet';
import consumptionRouter from './routers/consumption';

const app = express();

app.use(express.json());
// check all requests have an API key
app.use('/', authenticate_key);
// creates, deletes, alters user permissions
app.use('/access', accessRouter);
// manages all requests for metadata
app.use('/supplemental', supplementalRouter);
// manages all requests for seafood trade network data
app.use('/snet', snetRouter);
// manages all requests for consumption data
app.use('/consumption', consumptionRouter);

export default app;
