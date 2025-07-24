import { AssetModel } from "../models/assetModel.js";
import yahooFinance from "yahoo-finance2";

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
            return 'Other';
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

