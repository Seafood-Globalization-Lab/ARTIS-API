import express from 'express';
import supplementalRouter from './routers/supplemental'
import snetRouter from './routers/snet'
import { authenticate_key } from './middleware/authenticate';

const app = express();

app.use(express.json());
app.use('/', authenticate_key)
app.use('/supplemental', supplementalRouter);
app.use('/snet', snetRouter);

export default app;