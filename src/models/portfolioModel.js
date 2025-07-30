import db from '../config/db.js';

export class TransactionModel {
  /**
   * 买入/卖出时，自动获取当天价格并创建交易记录
   * @param {string} symbol 股票代码
   * @param {string} name 股票名称
   * @param {number} quantity 数量（正数=买入，负数=卖出）
   * @param {string} tradeDate 交易日期（YYYY-MM-DD）
   * @returns {number} 交易ID
   */
  static async create(symbol, name, quantity, tradeDate) {
    // 1. 先查询当天的价格（从daily_prices表获取）
    const [priceRows] = await db.execute(
      `SELECT price FROM daily_prices 
       WHERE symbol = ? AND date = ?`,
      [symbol, tradeDate]
    );
    if (priceRows.length === 0) {
      throw new Error(`${symbol}在${tradeDate}没有价格数据，请先录入`);
    }
    const tradePrice = priceRows[0].price; // 当天的价格

    // 2. 创建交易记录（无需手动传price，自动关联当天价格）
    const [result] = await db.execute(
      `INSERT INTO transactions 
       (symbol, name, quantity, trade_date) 
       VALUES (?, ?, ?, ?)`,
      [symbol, name, quantity, tradeDate]
    );
    return result.insertId;
  }

  /**
   * 查询目标日期前的所有交易
   */
  static async getAllBeforeDate(targetDate) {
    const [rows] = await db.execute(
      `SELECT t.*, dp.price AS trade_price 
       FROM transactions t
       JOIN daily_prices dp ON t.symbol = dp.symbol AND t.trade_date = dp.date
       WHERE t.trade_date <= ?
       ORDER BY t.symbol, t.trade_date ASC`,
      [targetDate]
    );
    return rows; // 包含交易时的价格（trade_price）
  }

  /**
   * 查询目标日期的所有股票价格
   */
  static async getPricesByDate(targetDate) {
    const [rows] = await db.execute(
      `SELECT symbol, price 
       FROM daily_prices 
       WHERE date = ?`,
      [targetDate]
    );
    return rows.reduce((map, row) => {
      map[row.symbol] = row.price;
      return map;
    }, {}); // { "AAPL": 160, "MSFT": 300 }
  }
}