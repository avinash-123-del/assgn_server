import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoConnection } from './dbConnection/dbConnect.js';
import router from './routes/route.js';

dotenv.config();

const app = express();

mongoConnection()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api" , router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});
