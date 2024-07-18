import express from 'express';
import accessRouter from './routers/authenticate';

const app = express();

app.use(express.json());
// creates, deletes, alters user permissions
app.use('/access', accessRouter);

export default app;
