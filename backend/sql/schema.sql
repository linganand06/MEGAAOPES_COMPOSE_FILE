CREATE DATABASE IF NOT EXISTS crm;
USE crm;

CREATE TABLE IF NOT EXISTS deals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  stage ENUM('New', 'In Progress', 'Won', 'Lost') NOT NULL DEFAULT 'New',
  value DECIMAL(15, 2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  close_date DATETIME NULL
);

-- Add indexes on columns useful for filtering/search
CREATE INDEX idx_stage ON deals(stage);
CREATE INDEX idx_created_at ON deals(created_at);
CREATE INDEX idx_close_date ON deals(close_date);
