import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import assetsRoutes from './routes/assetRoutes.js';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/assets', assetsRoutes);

app.get('/', (req, res) => {
   res.json({
    message: 'Finance Portfolio Management API',
    endpoints: {
        assets: '/api/assets',
    }
});
});

export default app;