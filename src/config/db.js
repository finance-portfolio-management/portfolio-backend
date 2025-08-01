import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME,
  waitForConnections: true,   
  connectionLimit: 10,
  queueLimit: 0,
});
// console.log('DB_USER:', process.env.DB_USER); // 打印特定变量

async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting database connection:', error);
        throw error;
    }
    }

getConnection();


export default pool;