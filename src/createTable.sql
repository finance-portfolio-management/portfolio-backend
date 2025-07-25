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