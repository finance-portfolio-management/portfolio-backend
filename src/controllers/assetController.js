
import { syncAssetInfo, getAllAssets, getAssetBySymbol, deleteAsset  as deleteAssetService , updateAsset as 

updateAssetService, getAssetHistoricalData, syncAssetHistoricalData
} from "../services/assetService.js";

import { HistoricalModel } from '../models/historicalModel.js';


export const addAsset = async (req, res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) {
            return res.status(400).json({
                success: false,
                error: 'Symbol is required'
                 });
        }
        const asset = await syncAssetInfo(symbol);
        return res.status(201).json({
            success: true,
            data: {
                id: asset.id,
                symbol: asset.symbol,
                name: asset.name,
                type: asset.type,
                exchange: asset.exchange,
                current_price: asset.current_price,
                price_updated_at: asset.price_updated_at
            }
        });
    } catch (error) {
       res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};


export const listAssets = async (req, res) => {
    try{
        const assets = await getAllAssets();
        res.json({
            success: true,
            data: assets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};

export const getAsset = async (req, res) => {
    try{
        const {symbol} = req.params;
        const asset = await getAssetBySymbol(symbol);
        if (!asset) {
            return res.status(404).json({
                success: false,
                error: 'Asset not found'
            });
        }
        res.json({
            success: true,
            data: asset
        });
    }   catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const deleteAsset = async (req, res) => {
    try{
        const {symbol} = req.params;
        await deleteAssetService(symbol);
        res.json({
            success: true,
            message: 'Asset deleted successfully'
        });
    }  catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }

};


export const updateAsset = async (req, res) => {
    try{
        const {symbol} = req.params;
        const data = req.body;
        
        const updatedAsset = await updateAssetService(symbol, data);
        res.json({            success: true,
            data: updatedAsset
        });
    }   catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }

}


export const getHistoricalData = async (req, res) => {
    try{
        const { symbol } = req.params;
        const { start, end, interval } = req.query;
        if (!start || !end) {
            return res.status(400).json({
                success: false,
                error: 'Start and end dates are required'
            });
        }

        let historicalData = await getAssetHistoricalData(symbol, start, end, interval);
        if (!historicalData || historicalData.length ===0){
            console.log(`No historical data found for ${symbol} between ${start} and ${end}`);
            await syncAssetHistoricalData(symbol, new Date(start), new Date(end), interval);

            historicalData = await getAssetHistoricalData(symbol, start, end, interval);    
        }

        if (historicalData && historicalData.length > 0) {
            res.json({
                success: true,
                data: historicalData
            });
        }else {
            res.status(404).json({
                success: false,
                error: `No historical data found for ${symbol} between ${start} and ${end}`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
  };

export const syncHistoricalData = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { start, end, interval } = req.body;
        if(!start || !end) {
            return res.status(400).json({
                success: false,
                error: 'Start and end dates are required'
            });
        }

        await syncAssetHistoricalData(symbol, new Date(start), new Date(end), interval || '1d');
        res.json({
            success: true,
            message: `Historical data for ${symbol} synced successfully`
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

