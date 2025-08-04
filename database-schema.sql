-- MySQL Database Schema for SPAS Authentication System
-- Run this script to create the necessary database and tables

-- Create database (optional - you may already have the database)
CREATE DATABASE IF NOT EXISTS spas_auth;
USE spas_auth;

-- Create users table
CREATE TABLE users (
    id VARCHAR(191) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    PRIMARY KEY (id),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Sample data (for testing - remove in production)
-- Password is 'password123' hashed with bcrypt
INSERT INTO users (id, name, email, hashed_password, created_at, updated_at) VALUES
('demo-user-1', 'Demo User', 'demo@spas.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/5QqQqQq', NOW(), NOW());