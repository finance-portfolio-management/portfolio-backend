import { TransactionModel } from "../models/portfolioModel.js";

export class AssetService {
  /**
   * 买入股票（自动使用当天价格）
   */
  static async buyAsset(symbol, name, quantity, tradeDate) {
    if (quantity <= 0) throw new Error('买入数量必须为正数');
    // 直接调用模型层，无需传price（模型会自动获取当天价格）
    return await TransactionModel.create(symbol, name, quantity, tradeDate);
  }

  /**
   * 卖出股票（自动使用当天价格，校验持仓）
   */
  static async sellAsset(symbol, name, quantity, tradeDate) {
    if (quantity <= 0) throw new Error('卖出数量必须为正数');
    // 1. 先查询当前持仓（目标日期前的总数量）
    const allTransactions = await TransactionModel.getAllBeforeDate(tradeDate);
    const symbolTransactions = allTransactions.filter(tx => tx.symbol === symbol);
    const totalHolding = symbolTransactions.reduce((sum, tx) => sum + tx.quantity, 0);

    if (totalHolding < quantity) {
      throw new Error(`持仓不足，${symbol}当前持仓: ${totalHolding.toFixed(4)}, 尝试卖出: ${quantity}`);
    }

    // 2. 创建卖出记录（quantity为负数，自动使用当天价格）
    return await TransactionModel.create(symbol, name, -quantity, tradeDate);
  }

  /**
   * 查询目标日期的持仓（自动读取当天价格）
   */
  static async getAllHoldings(targetDate) {
    try {
      // 1. 获取目标日期前的所有交易
      const allTransactions = await TransactionModel.getAllBeforeDate(targetDate);
      
      // 没有交易记录时直接返回空持仓
      if (allTransactions.length === 0) {
        return { 
          targetDate, 
          holdings: [], 
          totalMarketValue: '0.00', 
          totalRealizedProfit: '0.00', 
          totalAsset: '0.00' 
        };
      }
  
      // 2. 使用 DailyPrices 模型获取目标日期的所有股票价格
      const priceMap = await TransactionModel.getPricesByDate(targetDate);
      
      // 检查是否有价格数据
      if (!priceMap || Object.keys(priceMap).length === 0) {
        throw new Error(`No price data available for ${targetDate}`);
      }
  
      // 3. 按股票分组计算持仓
      const symbolMap = new Map();
      allTransactions.forEach(tx => {
        if (!symbolMap.has(tx.symbol)) symbolMap.set(tx.symbol, []);
        symbolMap.get(tx.symbol).push(tx);
      });
  
      const holdings = [];
      let totalMarketValue = 0;
      let totalRealizedProfit = 0;
  
      symbolMap.forEach((transactions, symbol) => {
        const latestPrice = priceMap[symbol];
        
        // 跳过没有价格的资产（而不是抛出错误）
        if (!latestPrice) {
          console.warn(`Symbol ${symbol} has no price data on ${targetDate}`);
          return;
        }
  
        // 计算持仓和收益（FIFO逻辑）
        const { quantity, avgCost, marketValue, unrealizedProfit, realizedProfit } = 
          this.calculateSingleHolding(transactions, latestPrice);
  
        // 只添加有持仓的资产
        if (quantity <= 0) return;
  
        totalMarketValue += marketValue;
        totalRealizedProfit += realizedProfit;
  
        holdings.push({
          symbol,
          name: transactions[0].name,
          quantity:Number(quantity).toFixed(4),
          avgCost: avgCost.toFixed(4),
          latestPrice: Number(latestPrice).toFixed(4),
          marketValue: marketValue.toFixed(4),
          unrealizedProfit: unrealizedProfit.toFixed(4),
          realizedProfit: realizedProfit.toFixed(4),
          profitRate: avgCost > 0 ? `${((unrealizedProfit / avgCost) * 100).toFixed(2)}%` : '0.00%',
          holdingPercentage: '0.00%'
        });
      });
  
      // 计算持仓占比
      if (totalMarketValue > 0) {
        holdings.forEach(item => {
          item.holdingPercentage = ((parseFloat(item.marketValue) / totalMarketValue) * 100).toFixed(2) + '%';
        });
      }
  
      return {
        targetDate,
        holdings,
        totalMarketValue: totalMarketValue.toFixed(4),
        totalRealizedProfit: totalRealizedProfit.toFixed(4),
        totalAsset: (totalMarketValue + totalRealizedProfit).toFixed(4)
      };
    } catch (error) {
      console.error('Error in getAllHoldings:', error);
      throw new Error('Failed to retrieve holdings: ' + error.message);
    }
  }
  
  /**
   * 辅助方法：FIFO计算单个股票持仓（改进精度处理）
   */
  static calculateSingleHolding(transactions, latestPrice) {
    let totalQuantity = 0;
    let totalCost = 0;
    let realizedProfit = 0;
    const fifoQueue = [];
  
    transactions.forEach(tx => {
      const { quantity, trade_price: price } = tx;
      
      // 买入操作
      if (quantity > 0) {
        totalQuantity += quantity;
        totalCost += quantity * price;
        fifoQueue.push({ quantity, price });
      } 
      // 卖出操作
      else {
        const sellQty = -quantity;
        let remainingSellQty = sellQty;
        
        // 按FIFO原则处理卖出
        while (remainingSellQty > 0 && fifoQueue.length > 0) {
          const firstBuy = fifoQueue[0];
          
          // 如果最早买入的数量小于等于要卖出的数量
          if (firstBuy.quantity <= remainingSellQty) {
            realizedProfit += (price - firstBuy.price) * firstBuy.quantity;
            totalQuantity -= firstBuy.quantity;
            totalCost -= firstBuy.quantity * firstBuy.price;
            remainingSellQty -= firstBuy.quantity;
            fifoQueue.shift(); // 移除已处理的买入记录
          } 
          // 如果最早买入的数量大于要卖出的数量
          else {
            realizedProfit += (price - firstBuy.price) * remainingSellQty;
            totalQuantity -= remainingSellQty;
            totalCost -= remainingSellQty * firstBuy.price;
            firstBuy.quantity -= remainingSellQty;
            remainingSellQty = 0;
          }
        }
      }
    });
  
    const avgCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;
    const marketValue = totalQuantity * latestPrice;
    const unrealizedProfit = marketValue - totalCost;
  
    return { quantity: totalQuantity, avgCost, marketValue, unrealizedProfit, realizedProfit };
  }
}