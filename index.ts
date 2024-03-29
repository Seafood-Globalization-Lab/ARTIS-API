import app from "./app";
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`running on port ${PORT}`));