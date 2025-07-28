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
}