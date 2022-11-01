import express from 'express';
import scinameRouter from './routers/sciname'

const app = express();

app.use(express.json());
app.use('/sciname', scinameRouter);

export default app;