import db from '../config/db.js';

export class AssetModel {

    static async createOrUpdateAsset(asset) {
        const { symbol, name, type, exchange} = asset;
        const [result] = await db.execute(
            `INSERT INTO assets (symbol, name, type, exchange)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             name = ?, type = ?, exchange = ?`,
            [symbol, name, type, exchange, name, type, exchange]
        );
        if (result.insertId){
            return result.insertId;
        }else {
            const [rows] = await db.execute(
                `SELECT id FROM assets WHERE symbol = ?`, [symbol]);
            return rows[0].id;
        }
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


    static async getHistoricalData(assetId, startDate, endDate, interval = '1d') {
        const [rows] = await db.execute(
           `select DATE_FORMAT(date, '%Y-%m-%d') as date,
            open, high, low, close, volume
            from historical_data
            where asset_id = ? and date_time between ? and ? and interval_type = ?
            order by date_time ASC`,
            [assetId, startDate, endDate, interval]
        );
        return rows;
    }
}