import express from 'express';
import dealsRoutes from './routes/dealsRoutes';
import cors from 'cors'

const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173'
// }));

app.use(cors());
app.use(express.json());

app.use('/api', dealsRoutes);

app.get('/', (req, res) => {
    res.send('Deals API is running');
});

export default app;
