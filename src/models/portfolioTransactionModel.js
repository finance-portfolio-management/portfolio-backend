import db from '../config/db.js';

export class PortfolioTransactionModel {
 
  static async record(data) {
    const { portfolioId, assetId, type, quantity, price, dateTime } = data;
    const actualQuantity = type === 'sell' ? -quantity : quantity; 

    await db.execute(`
      INSERT INTO portfolio_transactions 
        (portfolio_id, asset_id, type, quantity, price, date_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [portfolioId, assetId, type, actualQuantity, price, dateTime]);
  }

 
  static async getByDate(portfolioId, targetDate) {
    const [rows] = await db.execute(`
      SELECT 
        pt.*,
        a.symbol,
        a.name,
        a.type AS asset_type
      FROM portfolio_transactions pt
      JOIN assets a ON pt.asset_id = a.id
      WHERE pt.portfolio_id = ?
        AND pt.date_time <= ?
      ORDER BY pt.date_time ASC
    `, [portfolioId, `${targetDate} 23:59:59`]);

    return rows;
  }
}