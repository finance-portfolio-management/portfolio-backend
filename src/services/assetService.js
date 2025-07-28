import { AssetModel } from "../models/assetModel.js";
import yahooFinance from "yahoo-finance2";
import { HistoricalModel } from "../models/historicalModel.js";

export const syncAssetInfo = async (symbol) => {
    try {
      const quote = await yahooFinance.quote(symbol);
      if (!quote) throw new Error(` ${symbol} not found`);
  
      const currentPrice = 
        quote.regularMarketPrice !== undefined ? quote.regularMarketPrice :
        quote.marketPrice !== undefined ? quote.marketPrice :
        quote.price?.regularMarketPrice !== undefined ? quote.price.regularMarketPrice : null;
  
 
      const type = getAssetType(quote);
  
 
      const assetInfo = {
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || symbol,
        type,
        exchange: quote.exchange || '',
        current_price: currentPrice !== null ? parseFloat(currentPrice.toFixed(4)) : null,
        price_updated_at: new Date() 
      };
  

      console.log(`prepare to save:`, assetInfo);
  
  
      const assetId = await AssetModel.createOrUpdateAsset(assetInfo);
  
      return { assetId, ...assetInfo };
    } catch (error) {
      console.error(`Failed to synchronize assets ${error.message}`);
      throw error;
    }
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

    const quoteType = quote.quoteType || quote.type || '';
    
    switch (quoteType.toUpperCase()) { 
      case 'EQUITY':
        return 'Stock';
      case 'CRYPTOCURRENCY':
        return 'Crypto';
      case 'ETF':
        return 'ETF';
      case 'MUTUALFUND':
        return 'Mutual Fund';
      case 'INDEX':
        return 'Index';
      case 'FUTURE':
        return 'Future';
      case 'OPTION':
        return 'Option';
      case 'CURRENCY':
        return 'Currency';
      default:
        console.log(`Undefined: ${quoteType}Stock`);
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

        const vaidIntervals = ['1d', '1wk', '1mo'];
        if (!vaidIntervals.includes(interval)) {
            throw new Error(`Invalid interval ${interval}. Valid intervals are: ${vaidIntervals.join(', ')}`);
        }
        const rawHistoricalData = await yahooFinance.historical(symbol, {
            period1: new Date(startDate),
            period2: new Date(endDate),
            interval: interval
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
        throw new Error(`Asset ${symbol} not found`);
    }

    return await HistoricalModel.getHistoricalData(
        asset.id,
        startDate,
        endDate,
        interval
    );
   } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        throw error;
    }
};


