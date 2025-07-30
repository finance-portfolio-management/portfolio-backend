import { PortfolioModel } from "../models/portfolioModel.js";
import { PortfolioTransactionModel } from "../models/portfolioTransactionModel.js";
import db from "../config/db.js"

export class PortfolioService {

    static async createPortfolio(name, description = ''){
        if (!name || name.trim() === ''){
            throw new Error('the combination cannot be empty');
        }
        if (name.length > 100){
            throw new Error('the combination name cannot exceed 100');
        }

        const portfolioId = await PortfolioModel.create(name, description);

        return portfolioId;
    }

    static async getAllPortfolios() {
        const portfolios = await PortfolioModel.findAll();

        if (portfolios.length === 0){
            return [];
        }
        return portfolios;
    }

    static async getPortfolioById(portfolioId){
        const portfolio = await PortfolioModel.findById(portfolioId);

        if(!portfolio){
            throw new Error('ID is${portfolioId} combination does not exist ');
        }

        return portfolio;
    }


    static async updatePortfolio(portfolioId, { name, description }) {
     
        const portfolio = await PortfolioModel.findById(portfolioId);
        if (!portfolio) {
          throw new Error(`ID is${portfolioId} does not exist`);
        }
    

        if (!name.trim()) {
          throw new Error('combination name can not be empty');
        }
        if (name.length > 100) {
          throw new Error('combination name can not exceed 100');
        }
    

        await PortfolioModel.update(portfolioId, { name, description });
        return true;
      }

      static async deletePortfolio(portfolioId){
        const portfolio = await PortfolioModel.findById(portfolioId);
        if(!portfolio){
            throw new Error('ID is ${portfolioId} does not exist');
        }
        await PortfolioModel.delete(portfolioId);
        return true;
      }

     



      static async getAssetStatus(portfolioId, targetDate) {
        const portfolio = await PortfolioModel.get(portfolioId);
        if (!portfolio) throw new Error(`combination ${portfolioId} not exist`);
    
        // 2. 获取截止目标日期的所有交易
        const transactions = await PortfolioTransactionModel.getByDate(portfolioId, targetDate);
        if (transactions.length === 0) {
          return {
            portfolioId,
            portfolioName: portfolio.name,
            targetDate,
            holdings: [],
            totalRealizedProfit: '0.00',
            totalAsset: '0.00'
          };
        }
    
       
        const assetMap = new Map(); 
        transactions.forEach(tx => {
          const key = tx.asset_id;
          if (!assetMap.has(key)) {
            assetMap.set(key, {
              symbol: tx.symbol,
              name: tx.name,
              type: tx.asset_type,
              transactions: [],
              totalQuantity: 0, 
              totalCost: 0,     
              realizedProfit: 0, 
              totalSellQuantity: 0, 
              totalSellAmount: 0 
            });
          }
          assetMap.get(key).transactions.push(tx);
        });
    
        assetMap.forEach(asset => {
          const { transactions } = asset;
          let remainingQuantity = 0;
          let remainingCost = 0;
          const fifoQueue = [];
    
          transactions.forEach(tx => {
            const { quantity, price } = tx;
    
            if (quantity > 0) { 
              remainingQuantity += quantity;
              remainingCost += quantity * price;
              fifoQueue.push({ quantity, price });
            } else { 
              const sellQty = -quantity;
              const sellAmount = sellQty * price; 
              let remainingSellQty = sellQty;
    
            
              asset.totalSellQuantity += sellQty;
              asset.totalSellAmount += sellAmount;
    
             
              while (remainingSellQty > 0 && fifoQueue.length > 0) {
                const first = fifoQueue[0];
                if (first.quantity <= remainingSellQty) {
                  asset.realizedProfit += (price - first.price) * first.quantity;
                  remainingQuantity -= first.quantity;
                  remainingCost -= first.quantity * first.price;
                  remainingSellQty -= first.quantity;
                  fifoQueue.shift();
                } else {
                  asset.realizedProfit += (price - first.price) * remainingSellQty;
                  remainingQuantity -= remainingSellQty;
                  remainingCost -= remainingSellQty * first.price;
                  first.quantity -= remainingSellQty;
                  remainingSellQty = 0;
                }
              }
            }
          });
    
          asset.avgCost = remainingQuantity > 0 ? remainingCost / remainingQuantity : 0;
          asset.totalQuantity = remainingQuantity;
          asset.totalCost = remainingCost;
        });
    
       
        const assets = Array.from(assetMap.values());
        let priceMap = new Map();
    
        if (assets.length > 0) {
          const assetIds = assets.map(a => a.transactions[0].asset_id);
          const [prices] = await db.execute(`
            SELECT h.asset_id, h.close AS price 
            FROM historical_data h
            JOIN (
              SELECT asset_id, MAX(date_time) AS max_date
              FROM historical_data
              WHERE asset_id IN (${assetIds.map(() => '?').join(',')})
                AND date_time <= ?
              GROUP BY asset_id
            ) sub ON h.asset_id = sub.asset_id AND h.date_time = sub.max_date
          `, [...assetIds, `${targetDate} 23:59:59`]);
    
          priceMap = new Map(prices.map(p => [p.asset_id, p.price]));
        }
    
        let totalAsset = 0;
        let totalRealizedProfit = 0;
    
        
        const holdings = assets.map(asset => {
          const assetId = asset.transactions[0].asset_id;
          
        
          let latestPrice = priceMap.get(assetId);
          if (typeof latestPrice !== 'number' || isNaN(latestPrice)) {
            latestPrice = asset.avgCost;
          }
          if (typeof latestPrice !== 'number' || isNaN(latestPrice)) {
            latestPrice = 0;
          }
    
          
          const marketValue = asset.totalQuantity * latestPrice;
          const unrealizedProfit = marketValue - asset.totalCost;
          const profitRate = asset.totalCost > 0 
            ? (unrealizedProfit / asset.totalCost) * 100 
            : 0;
    
         
          const realizedCost = asset.totalSellAmount - asset.realizedProfit; 
          const realizedProfitRate = realizedCost > 0 
            ? (asset.realizedProfit / realizedCost) * 100 
            : 0;
    
        
          totalAsset += marketValue;
          totalRealizedProfit += asset.realizedProfit;
    
          return {
            symbol: asset.symbol,
            name: asset.name,
            quantity: asset.totalQuantity.toFixed(2),
            avgCost: asset.avgCost.toFixed(2),
            latestPrice: latestPrice.toFixed(2),
            marketValue: marketValue.toFixed(2),
            unrealizedProfit: unrealizedProfit.toFixed(2),
            realizedProfit: asset.realizedProfit.toFixed(2),
          
            realizedProfitRate: realizedProfitRate.toFixed(2) + '%', 
           
            profitRate: profitRate.toFixed(2) + '%'
          };
        });
    
    
        totalAsset += totalRealizedProfit;
    
        return {
          portfolioId,
          portfolioName: portfolio.name,
          targetDate,
          holdings,
          totalRealizedProfit: totalRealizedProfit.toFixed(2),
          totalAsset: totalAsset.toFixed(2)
        };
      }
    }