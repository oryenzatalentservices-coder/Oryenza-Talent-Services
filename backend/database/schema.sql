-- Oryenza Talent Services Database Schema
-- Compatible with MySQL 5.7+ and MySQL 8.0+

CREATE DATABASE IF NOT EXISTS oryenza_talent_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE oryenza_talent_db;

-- 1. Inquiries Table (Client / Employer Hiring Requirements)
CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  company VARCHAR(150) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  requirement VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'contacted', 'closed') DEFAULT 'new',
  admin_notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email),
  INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Candidates Table (Job Seekers & Talent Pool Applications)
CREATE TABLE IF NOT EXISTS candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  current_role VARCHAR(150) DEFAULT NULL,
  experience_years DECIMAL(4, 1) DEFAULT 0.0,
  preferred_location VARCHAR(100) DEFAULT NULL,
  skills TEXT DEFAULT NULL,
  resume_path VARCHAR(255) DEFAULT NULL,
  resume_original_name VARCHAR(255) DEFAULT NULL,
  portfolio_url VARCHAR(255) DEFAULT NULL,
  status ENUM('applied', 'screening', 'interview', 'offered', 'placed', 'rejected') DEFAULT 'applied',
  admin_notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_candidate_status (status),
  INDEX idx_candidate_email (email),
  INDEX idx_candidate_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Live Stats & Metrics Table (Customizable KPIs)
CREATE TABLE IF NOT EXISTS site_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  metric_key VARCHAR(50) UNIQUE NOT NULL,
  metric_value INT NOT NULL,
  label VARCHAR(100) NOT NULL,
  suffix VARCHAR(10) DEFAULT '+',
  display_order INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed for Site Stats
INSERT INTO site_stats (metric_key, metric_value, label, suffix, display_order)
VALUES 
  ('happy_clients', 25, 'Happy clients', '+', 1),
  ('industries_served', 15, 'Industries served', '+', 2),
  ('successful_placements', 250, 'Successful placements', '+', 3),
  ('retention_rate', 96, '1-Year retention rate', '%', 4)
ON DUPLICATE KEY UPDATE 
  metric_value = VALUES(metric_value),
  label = VALUES(label),
  suffix = VALUES(suffix);
