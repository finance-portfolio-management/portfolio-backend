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
}