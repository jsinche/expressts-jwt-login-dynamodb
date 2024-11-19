import dotenv from 'dotenv';
import express from 'express';
import { authRouter } from './routes/authRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/auth',authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);    
});