import { AssetModel } from "../models/assetModel.js";
import yahooFinance from "yahoo-finance2";
import { HistoricalModel } from "../models/historicalModel.js";

export const syncAssetInfo = async (symbol) => {
    try{
        const quote = await yahooFinance.quote(symbol);

        const asserInfo = {
            symbol: quote.symbol,
            name: quote.longName || quote.shortName || symbol,
            type: getAssetType(quote),
            exchange: quote.exchange
    };

    const assetId = await AssetModel.createOrUpdateAsset(asserInfo);

    return { assetId, ...asserInfo };
    } catch (error) {
        console.error(`Error syncing asset info for ${symbol}:`, error);
        throw error;
    };
};

export const getAllAssets = async () => {
    try {
        return await AssetModel.getAll();
    } catch (error) {
        console.error('Error fetching all assets:', error);
        throw error;
    }
};


export const getAssetBySymbol = async (symbol) => {
    try {
        return await AssetModel.getBySymbol(symbol);
    } catch (error) {
        console.error(`Error fetching asset by symbol ${symbol}:`, error);
        throw error;
    }
};

const getAssetType = (quote) => {
    switch (quote.type) {
        case 'EQUITY':
            return 'Stock';
        case 'CRYPTOCURRENCY':
            return 'Crypto';
        case 'ETF':
            return 'ETF';
        case 'MUTUALFUND':
            return 'Mutual Fund';
            default:
            return 'Stock';
    }
};


export const deleteAsset = async (symbol) => {
    try{
        const asset = await AssetModel.getBySymbol(symbol);
        if (!asset) {
            throw new Error('Asset not found');
        }

        await AssetModel.deleteBySymbol(symbol);
    } catch (error) {
        console.error(`Error deleting asset ${symbol}:`, error);
        throw error;
    }

};


export const updateAsset = async (symbol, data) => {
    try{
        const asset = await AssetModel.getBySymbol(symbol);
        if (!asset) {
            throw new Error('Asset not found');
        }

        await AssetModel.updateBySymbol(symbol, data);
        return await AssetModel.getBySymbol(symbol);
    } catch (error) {
        console.error(`Error updating asset ${symbol}:`, error);
        throw error;
    }

};

export const syncAssetHistoricalData = async (symbol, startDate, endDate, interval = '1d') => {
    try {
        const asset = await AssetModel.getBySymbol(symbol);
        if (!asset) {
            throw new Error('asset ${symbol} not found');
        }

        const rawHistoricalData = await yahooFinance.historical(symbol, {
            period1: startDate,
            period2: endDate,
            interval
        });

        if (!rawHistoricalData || rawHistoricalData.length === 0) {
            throw new Error(`No historical data found for ${symbol} between ${startDate} and ${endDate}`);
        }


        await HistoricalModel.saveHistoricalData(asset.id, rawHistoricalData, interval);
        console.log(`Historical data for ${symbol} synced successfully`);
    } catch (error) {
        console.error(`Error syncing historical data for ${symbol}:`, error);
        throw error;
    }
};

export const getAssetHistoricalData = async (symbol, startDate, endDate, interval = '1d') => {
    try {
        const asset = await AssetModel.getBySymbol(symbol);
        if (!asset) {
            throw new Error('Asset not found');
        }
        const historicalData = await HistoricalModel.getHistoricalData(asset.id, startDate, endDate, interval);

        if (historicalData.length === 0) {
            throw new Error(`No historical data found for ${symbol} between ${startDate} and ${endDate}`);
        }

        return historicalData;
    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        throw error;
    }
};


