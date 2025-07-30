const mysql = require('mysql2/promise');
require('dotenv').config(); // 确保这行在最顶部

// 调试输出检查环境变量
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // 密码为空字符串作为fallback
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 添加连接测试方法
pool.testConnection = async () => {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  return true;
};

module.exports = pool;