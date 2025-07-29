import db from '../config/db.js'

export class PortfolioAssetModel {
    static async add(portfolioId, assetId, quantity, buyPrice) {
        const sql = `
        insert into portfolio_assets
        (portfolio_id, asset_id, quantity, buy_price)
        values(?, ?, ?, ?)
        on duplicate key update
        quantity = quantity + ?,
        buy_price = (buy_price * quantity + ? * ?)/(quantity + ?),
        updated_at = CURRENT_TIMESTAMP
        `;

        await db.execute(sql, [
            portfolioId, assetId, quantity, buyPrice,
            quantity, buyPrice, quantity, quantity
        ]);
        return true;
    }
}