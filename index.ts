
import express from 'express';
import scinameRouter from './routers/sciname'
//import snetRouter from './routers/snet'

const app = express();

app.use(express.json());
app.use('/sciname', scinameRouter);
//app.use('/snet', snetRouter);

app.listen(8000, () => console.log('Server started'))