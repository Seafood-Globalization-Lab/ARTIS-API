
import express from 'express';
import scinameRouter from './routers/sciname'

const app = express();

app.use(express.json());
app.use('/sciname', scinameRouter);

app.listen(8000, () => console.log('Server started'))