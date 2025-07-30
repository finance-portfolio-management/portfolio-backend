create database if not EXISTS portfolio_db;
USE portfolio_db;
CREATE TABLE IF NOT EXISTS assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  exchange VARCHAR(50) NOT NULL,
  current_price DECIMAL(18, 4) DEFAULT NULL,
  price_updated_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historical_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_id INT NOT NULL, 
  date_time DATETIME NOT NULL,
  interval_type VARCHAR(10) NOT NULL, 
  open DECIMAL(15, 4) NOT NULL, 
  high DECIMAL(15, 4) NOT NULL, 
  low DECIMAL(15, 4) NOT NULL, 
  close DECIMAL(15, 4) NOT NULL, 
  volume BIGINT, 

  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,

  UNIQUE KEY unique_historical (asset_id, date_time, interval_type)
);


CREATE TABLE IF NOT EXISTS portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  quantity DECIMAL(15, 4) NOT NULL, -- 正数=买入，负数=卖出
  trade_date DATE NOT NULL, -- 交易日期
  FOREIGN KEY (symbol, trade_date) REFERENCES daily_prices(symbol, date) -- 关联当天价格
);

-- 2. 每日价格表（存储一个月的价格数据，按股票+日期唯一）
CREATE TABLE IF NOT EXISTS daily_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(50) NOT NULL,
  date DATE NOT NULL, -- 价格对应的日期（一个月内）
  price DECIMAL(15, 4) NOT NULL, -- 当天的价格（预先存储）
  UNIQUE KEY unique_symbol_date (symbol, date) -- 确保一个股票一天只有一个价格
);

-- AAPL（股票）：初始价格180，每日波动±2%
INSERT INTO daily_prices (symbol, date, price) VALUES
  ('AAPL', '2024-07-01', 180.00),
  ('AAPL', '2024-07-02', 182.50),
  ('AAPL', '2024-07-03', 179.80),
  ('AAPL', '2024-07-04', 181.20),
  ('AAPL', '2024-07-05', 184.60),
  ('AAPL', '2024-07-06', 183.10),
  ('AAPL', '2024-07-07', 185.90),
  ('AAPL', '2024-07-08', 187.20),
  ('AAPL', '2024-07-09', 186.50),
  ('AAPL', '2024-07-10', 189.10),
  ('AAPL', '2024-07-11', 191.30),
  ('AAPL', '2024-07-12', 188.70),
  ('AAPL', '2024-07-13', 187.50),
  ('AAPL', '2024-07-14', 189.80),
  ('AAPL', '2024-07-15', 192.40),
  ('AAPL', '2024-07-16', 190.90),
  ('AAPL', '2024-07-17', 193.20),
  ('AAPL', '2024-07-18', 195.60),
  ('AAPL', '2024-07-19', 194.10),
  ('AAPL', '2024-07-20', 196.80),
  ('AAPL', '2024-07-21', 198.30),
  ('AAPL', '2024-07-22', 197.50),
  ('AAPL', '2024-07-23', 199.70),
  ('AAPL', '2024-07-24', 201.20),
  ('AAPL', '2024-07-25', 199.90),
  ('AAPL', '2024-07-26', 202.50),
  ('AAPL', '2024-07-27', 204.10),
  ('AAPL', '2024-07-28', 203.30),
  ('AAPL', '2024-07-29', 205.60),
  ('AAPL', '2024-07-30', 207.20);

-- MSFT（股票）：初始价格400，每日波动±1.5%
INSERT INTO daily_prices (symbol, date, price) VALUES
  ('MSFT', '2024-07-01', 400.00),
  ('MSFT', '2024-07-02', 404.50),
  ('MSFT', '2024-07-03', 401.20),
  ('MSFT', '2024-07-04', 398.70),
  ('MSFT', '2024-07-05', 403.30),
  ('MSFT', '2024-07-06', 405.90),
  ('MSFT', '2024-07-07', 408.10),
  ('MSFT', '2024-07-08', 406.50),
  ('MSFT', '2024-07-09', 409.80),
  ('MSFT', '2024-07-10', 412.30),
  ('MSFT', '2024-07-11', 410.70),
  ('MSFT', '2024-07-12', 413.50),
  ('MSFT', '2024-07-13', 415.20),
  ('MSFT', '2024-07-14', 413.90),
  ('MSFT', '2024-07-15', 416.80),
  ('MSFT', '2024-07-16', 419.20),
  ('MSFT', '2024-07-17', 417.50),
  ('MSFT', '2024-07-18', 420.10),
  ('MSFT', '2024-07-19', 422.60),
  ('MSFT', '2024-07-20', 421.30),
  ('MSFT', '2024-07-21', 424.50),
  ('MSFT', '2024-07-22', 423.10),
  ('MSFT', '2024-07-23', 425.80),
  ('MSFT', '2024-07-24', 428.30),
  ('MSFT', '2024-07-25', 426.90),
  ('MSFT', '2024-07-26', 429.50),
  ('MSFT', '2024-07-27', 431.20),
  ('MSFT', '2024-07-28', 430.10),
  ('MSFT', '2024-07-29', 432.70),
  ('MSFT', '2024-07-30', 434.50);


  -- GOVT（国债）：低波动，初始价格100，每日波动±0.3%
INSERT INTO daily_prices (symbol, date, price) VALUES
  ('GOVT', '2024-07-01', 100.00),
  ('GOVT', '2024-07-02', 100.20),
  ('GOVT', '2024-07-03', 100.10),
  ('GOVT', '2024-07-04', 100.30),
  ('GOVT', '2024-07-05', 100.40),
  ('GOVT', '2024-07-06', 100.30),
  ('GOVT', '2024-07-07', 100.50),
  ('GOVT', '2024-07-08', 100.60),
  ('GOVT', '2024-07-09', 100.50),
  ('GOVT', '2024-07-10', 100.70),
  ('GOVT', '2024-07-11', 100.80),
  ('GOVT', '2024-07-12', 100.70),
  ('GOVT', '2024-07-13', 100.90),
  ('GOVT', '2024-07-14', 101.00),
  ('GOVT', '2024-07-15', 100.90),
  ('GOVT', '2024-07-16', 101.10),
  ('GOVT', '2024-07-17', 101.20),
  ('GOVT', '2024-07-18', 101.10),
  ('GOVT', '2024-07-19', 101.30),
  ('GOVT', '2024-07-20', 101.40),
  ('GOVT', '2024-07-21', 101.30),
  ('GOVT', '2024-07-22', 101.50),
  ('GOVT', '2024-07-23', 101.60),
  ('GOVT', '2024-07-24', 101.50),
  ('GOVT', '2024-07-25', 101.70),
  ('GOVT', '2024-07-26', 101.80),
  ('GOVT', '2024-07-27', 101.70),
  ('GOVT', '2024-07-28', 101.90),
  ('GOVT', '2024-07-29', 102.00),
  ('GOVT', '2024-07-30', 101.90);

-- CORP（企业债）：中波动，初始价格98，每日波动±0.5%
INSERT INTO daily_prices (symbol, date, price) VALUES
  ('CORP', '2024-07-01', 98.00),
  ('CORP', '2024-07-02', 98.30),
  ('CORP', '2024-07-03', 97.90),
  ('CORP', '2024-07-04', 98.50),
  ('CORP', '2024-07-05', 98.70),
  ('CORP', '2024-07-06', 98.40),
  ('CORP', '2024-07-07', 98.90),
  ('CORP', '2024-07-08', 99.10),
  ('CORP', '2024-07-09', 98.80),
  ('CORP', '2024-07-10', 99.30),
  ('CORP', '2024-07-11', 99.50),
  ('CORP', '2024-07-12', 99.20),
  ('CORP', '2024-07-13', 99.70),
  ('CORP', '2024-07-14', 99.90),
  ('CORP', '2024-07-15', 99.60),
  ('CORP', '2024-07-16', 100.10),
  ('CORP', '2024-07-17', 100.30),
  ('CORP', '2024-07-18', 100.00),
  ('CORP', '2024-07-19', 100.50),
  ('CORP', '2024-07-20', 100.70),
  ('CORP', '2024-07-21', 100.40),
  ('CORP', '2024-07-22', 100.90),
  ('CORP', '2024-07-23', 101.10),
  ('CORP', '2024-07-24', 100.80),
  ('CORP', '2024-07-25', 101.30),
  ('CORP', '2024-07-26', 101.50),
  ('CORP', '2024-07-27', 101.20),
  ('CORP', '2024-07-28', 101.70),
  ('CORP', '2024-07-29', 101.90),
  ('CORP', '2024-07-30', 101.60);

  INSERT INTO daily_prices (symbol, date, price) VALUES
  ('EQ_FUND', '2024-07-01', 200.00),
  ('EQ_FUND', '2024-07-02', 204.30),
  ('EQ_FUND', '2024-07-03', 199.70),
  ('EQ_FUND', '2024-07-04', 205.10),
  ('EQ_FUND', '2024-07-05', 208.50),
  ('EQ_FUND', '2024-07-06', 203.90),
  ('EQ_FUND', '2024-07-07', 209.20),
  ('EQ_FUND', '2024-07-08', 212.80),
  ('EQ_FUND', '2024-07-09', 208.50),
  ('EQ_FUND', '2024-07-10', 213.70),
  ('EQ_FUND', '2024-07-11', 217.20),
  ('EQ_FUND', '2024-07-12', 211.50),
  ('EQ_FUND', '2024-07-13', 214.80),
  ('EQ_FUND', '2024-07-14', 219.30),
  ('EQ_FUND', '2024-07-15', 223.50),
  ('EQ_FUND', '2024-07-16', 218.90),
  ('EQ_FUND', '2024-07-17', 225.10),
  ('EQ_FUND', '2024-07-18', 229.60),
  ('EQ_FUND', '2024-07-19', 224.80),
  ('EQ_FUND', '2024-07-20', 230.20),
  ('EQ_FUND', '2024-07-21', 234.70),
  ('EQ_FUND', '2024-07-22', 229.50),
  ('EQ_FUND', '2024-07-23', 235.80),
  ('EQ_FUND', '2024-07-24', 240.10),
  ('EQ_FUND', '2024-07-25', 235.60),
  ('EQ_FUND', '2024-07-26', 242.30),
  ('EQ_FUND', '2024-07-27', 246.80),
  ('EQ_FUND', '2024-07-28', 241.50),
  ('EQ_FUND', '2024-07-29', 248.20),
  ('EQ_FUND', '2024-07-30', 252.70);


  INSERT INTO daily_prices (symbol, date, price) VALUES
  ('BD_FUND', '2024-07-01', 120.00),
  ('BD_FUND', '2024-07-02', 120.30),
  ('BD_FUND', '2024-07-03', 120.10),
  ('BD_FUND', '2024-07-04', 120.60),
  ('BD_FUND', '2024-07-05', 120.80),
  ('BD_FUND', '2024-07-06', 120.50),
  ('BD_FUND', '2024-07-07', 121.00),
  ('BD_FUND', '2024-07-08', 121.20),
  ('BD_FUND', '2024-07-09', 120.90),
  ('BD_FUND', '2024-07-10', 121.40),
  ('BD_FUND', '2024-07-11', 121.60),
  ('BD_FUND', '2024-07-12', 121.30),
  ('BD_FUND', '2024-07-13', 121.80),
  ('BD_FUND', '2024-07-14', 122.00),
  ('BD_FUND', '2024-07-15', 121.70),
  ('BD_FUND', '2024-07-16', 122.20),
  ('BD_FUND', '2024-07-17', 122.40),
  ('BD_FUND', '2024-07-18', 122.10),
  ('BD_FUND', '2024-07-19', 122.60),
  ('BD_FUND', '2024-07-20', 122.80),
  ('BD_FUND', '2024-07-21', 122.50),
  ('BD_FUND', '2024-07-22', 123.00),
  ('BD_FUND', '2024-07-23', 123.20),
  ('BD_FUND', '2024-07-24', 122.90),
  ('BD_FUND', '2024-07-25', 123.40),
  ('BD_FUND', '2024-07-26', 123.60),
  ('BD_FUND', '2024-07-27', 123.30),
  ('BD_FUND', '2024-07-28', 123.80),
  ('BD_FUND', '2024-07-29', 124.00),
  ('BD_FUND', '2024-07-30', 123.70);


  INSERT INTO daily_prices (symbol, date, price) VALUES
  ('MIX_FUND', '2024-07-01', 160.00),
  ('MIX_FUND', '2024-07-02', 161.50),
  ('MIX_FUND', '2024-07-03', 159.80),
  ('MIX_FUND', '2024-07-04', 162.10),
  ('MIX_FUND', '2024-07-05', 163.70),
  ('MIX_FUND', '2024-07-06', 162.20),
  ('MIX_FUND', '2024-07-07', 164.50),
  ('MIX_FUND', '2024-07-08', 165.90),
  ('MIX_FUND', '2024-07-09', 164.30),
  ('MIX_FUND', '2024-07-10', 166.70),
  ('MIX_FUND', '2024-07-11', 168.20),
  ('MIX_FUND', '2024-07-12', 166.50),
  ('MIX_FUND', '2024-07-13', 168.90),
  ('MIX_FUND', '2024-07-14', 170.30),
  ('MIX_FUND', '2024-07-15', 168.70),
  ('MIX_FUND', '2024-07-16', 171.20),
  ('MIX_FUND', '2024-07-17', 172.80),
  ('MIX_FUND', '2024-07-18', 171.10),
  ('MIX_FUND', '2024-07-19', 173.60),
  ('MIX_FUND', '2024-07-20', 175.10),
  ('MIX_FUND', '2024-07-21', 173.40),
  ('MIX_FUND', '2024-07-22', 175.90),
  ('MIX_FUND', '2024-07-23', 177.50),
  ('MIX_FUND', '2024-07-24', 175.80),
  ('MIX_FUND', '2024-07-25', 178.30),
  ('MIX_FUND', '2024-07-26', 179.90),
  ('MIX_FUND', '2024-07-27', 178.20),
  ('MIX_FUND', '2024-07-28', 180.70),
  ('MIX_FUND', '2024-07-29', 182.30),
  ('MIX_FUND', '2024-07-30', 180.60);