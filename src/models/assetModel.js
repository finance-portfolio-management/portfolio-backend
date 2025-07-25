import db from '../config/db.js';

export class AssetModel {

    static async createOrUpdateAsset(asset) {
        const { symbol, name, type, exchange, current_price, price_updated_at} = asset;
        const sql = `
            INSERT INTO assets (symbol, name, type, exchange, current_price, price_updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                type = VALUES(type),
                exchange = VALUES(exchange),
                current_price = VALUES(current_price),
                price_updated_at = VALUES(price_updated_at)
        `;
        const [result] = await db.execute(
           sql,
            [symbol, name, type, exchange, current_price, price_updated_at]
        );
        return result.insertId ? result.insertId :await this.getBySymbol(symbol);
    }


    static async getBySymbol(symbol) {
        const [rows] = await db.execute(
            `SELECT * FROM assets WHERE symbol = ?`, [symbol]);
        return rows[0] || null;
    }

    static async getAll() {
        const [rows] = await db.execute(`SELECT * FROM assets order by symbol`);
        return rows;
    }


    static async deleteBySymbol(symbol) {
        await db.execute(
            `DELETE FROM assets WHERE symbol = ?`, [symbol]);
    }

    static async updateBySymbol(symbol, data) {
        const { name, type, exchange } = data;
        await db.execute(
            `UPDATE assets SET name = ?, type = ?, exchange = ? WHERE symbol = ?`,
            [name, type, exchange, symbol]
        );
    }


    
}