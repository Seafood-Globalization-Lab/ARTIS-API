import express from 'express';
import scinameRouter from './routers/sciname'
import countriesRouter from './routers/countries'
import snetRouter from './routers/snet'

const app = express();

app.use(express.json());
app.use('/sciname', scinameRouter);
app.use('/countries', countriesRouter);
app.use('/snet', snetRouter);

export default app;