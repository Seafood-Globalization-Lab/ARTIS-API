import express from 'express';
import scinameRouter from './routers/sciname'
import countriesRouter from './routers/countries'
import productionRouter from './routers/production'
import supplementalRouter from './routers/supplemental'
import snetRouter from './routers/snet'

const app = express();

app.use(express.json());
/*
app.use('/sciname', scinameRouter);
app.use('/countries', countriesRouter);
app.use('/production', productionRouter);
*/
app.use('/supplemental', supplementalRouter);
app.use('/snet', snetRouter);

export default app;