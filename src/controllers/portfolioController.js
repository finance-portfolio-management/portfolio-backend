import { AssetService } from "../services/portfolioService.js";

export class AssetController {
  // 买入（无需传price，自动用当天价格）
  static async buy(req, res) {
    try {
      const { symbol, name, quantity, tradeDate } = req.body;
      if (!symbol || !name || !quantity || !tradeDate) {
        throw new Error('请传入symbol、name、quantity、tradeDate');
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tradeDate)) {
        throw new Error('tradeDate格式应为YYYY-MM-DD');
      }

      const transactionId = await AssetService.buyAsset(
        symbol,
        name,
        Number(quantity),
        tradeDate
      );
      res.json({ success: true, transactionId, message: '买入成功' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // 卖出（同上，自动用当天价格）
  static async sell(req, res) {
    try {
      const { symbol, name, quantity, tradeDate } = req.body;
      if (!symbol || !name || !quantity || !tradeDate) {
        throw new Error('请传入symbol、name、quantity、tradeDate');
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tradeDate)) {
        throw new Error('tradeDate格式应为YYYY-MM-DD');
      }

      const transactionId = await AssetService.sellAsset(
        symbol,
        name,
        Number(quantity),
        tradeDate
      );
      res.json({ success: true, transactionId, message: '卖出成功' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // 查询持仓（仅需传目标日期）
  static async getHoldings(req, res) {
    try {
      const { targetDate } = req.query;
      if (!targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
        throw new Error('请传入正确格式的targetDate（YYYY-MM-DD）');
      }

      const holdings = await AssetService.getAllHoldings(targetDate);
      res.json({ success: true, data: holdings });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}