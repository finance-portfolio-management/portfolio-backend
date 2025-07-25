import db from '../config/db.js';

export class HistoricalModel {

    static async saveHistoricalData(assetId, rawData, interval) {
        const sql = `
            INSERT INTO historical_data 
                (asset_id, date_time, interval_type, open, high, low, close, volume)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                open = VALUES(open),
                high = VALUES(high),
                low = VALUES(low),
                close = VALUES(close),
                volume = VALUES(volume)
        `;
        for (const item of rawData){
            const values = [
                assetId,
                new Date(item.date),
                interval,

                parseFloat(item.open.toFixed(4)),
                parseFloat(item.high.toFixed(4)),
                parseFloat(item.low.toFixed(4)),    
                parseFloat(item.close.toFixed(4)),
                item.volume || 0
            ];
        await db.execute(sql, values);
        }
    }

    static async getHistoricalData(assetId, startDate, endDate, interval) {
        const sql = `
           select DATE_FORMAT(date_time, '%Y-%m-%d %H:%i:%s') as date,
           open, high, low, close, volume
              from historical_data
              where asset_id = ? and date_time between ? and ? and interval_type = ?
              order by date_time asc
        `;

        const [rows] = await db.execute(sql, [assetId, startDate, endDate, interval]);
        return rows;
}
}