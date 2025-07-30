import db from '../config/db.js';

export class PortfolioModel{
    static async create(name, description) {
        const sql = `
        insert into portfolios (name, description)
        values (?, ?)
        `;
        const [result] = await db.execute(sql, [name, description]);
        return result.insertId;
    }

    static async findAll() {
        const sql = `
        select * from portfolios order by created_at desc
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }


static async findById(portfolioId) {

    const [portfolio] = await db.execute(
      `SELECT id, name, description, created_at, updated_at 
       FROM portfolios 
       WHERE id = ?`,
      [portfolioId]
    );
    if (portfolio.length === 0) return null;
  
  
    const [assets] = await db.execute(`
      SELECT 
        pa.id AS holding_id,
        pa.asset_id,
        pa.quantity,
        pa.buy_price,
        a.symbol,
        a.name AS asset_name
      FROM portfolio_assets pa
      LEFT JOIN assets a ON pa.asset_id = a.id 
      WHERE pa.portfolio_id = ?
    `, [portfolioId]);
  

    return { ...portfolio[0], assets };
  }

  static async update(portfolioId, { name, description }) {
    const sql = `
      UPDATE portfolios 
      SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    await db.execute(sql, [name, description, portfolioId]);
    return true;
  }

  static async delete(portfolioId){
    const sql = `
    delete from portfolios where id = ?
    `;
    await db.execute(sql, [portfolioId]);
    return true
  }

  static async get(portfolioId){
    const [rows] = await db.execute(
        `
        select id from portfolios where id = ?
        `,
        [portfolioId]
    );
    return rows.length > 0;
  }
}

