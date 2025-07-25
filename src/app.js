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
        addassets: 'POST /api/assets',
        listAssets: 'GET /api/assets',
        getAsset: 'GET /api/assets/:symbol',
        deleteAsset: 'DELETE /api/assets/:symbol',
        updateAsset: 'PUT /api/assets/:symbol',
        getHistoricalData: 'GET /api/assets/:symbol/historical',
        syncHistoricalData: 'POST /api/assets/:symbol/historical/sync'
    }
});
});

app.use((err, req, res, next) => {;
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    }
);
});

export default app;