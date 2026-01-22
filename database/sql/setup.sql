-- ============================================
-- JCS Dashboard Database Setup
-- ============================================
-- Complete database setup with all required tables
-- This script will:
-- 1. Drop existing database if exists
-- 2. Create fresh database
-- 3. Create all tables with proper relationships
-- 4. Set up indexes and constraints
-- ============================================
-- Run this script in MySQL Workbench or via command line:
-- mysql -u root -p < database/sql/setup.sql
-- ============================================

-- Drop existing database (if exists)
DROP DATABASE IF EXISTS jcs_dashboard;

-- Create fresh database
CREATE DATABASE jcs_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE jcs_dashboard;

-- ============================================
-- Table: departments
-- ============================================
-- Stores department/school information
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    coordinatorName VARCHAR(255) NOT NULL,
    totalCredits INT DEFAULT 0,
    eventCount INT DEFAULT 0,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_code (code),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: events
-- ============================================
-- Stores sustainability events submitted by departments
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    departmentId INT NOT NULL,
    departmentName VARCHAR(255) NOT NULL,
    fromDate VARCHAR(50) NOT NULL,
    toDate VARCHAR(50) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    participants INT NOT NULL DEFAULT 0,
    sdgs JSON NOT NULL DEFAULT ('[]'),
    status ENUM('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected') DEFAULT 'Submitted',
    credits INT DEFAULT 0,
    imageUrl VARCHAR(500) NULL,
    reportUrl VARCHAR(500) NULL,
    submissionDate VARCHAR(50) NOT NULL,
    feedback TEXT NULL,
    actionsTaken TEXT NULL,
    proofLink VARCHAR(500) NULL,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_departmentId (departmentId),
    INDEX idx_status (status),
    INDEX idx_fromDate (fromDate),
    INDEX idx_departmentName (departmentName),
    INDEX idx_createdAt (createdAt),
    FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: users
-- ============================================
-- Stores user accounts for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Coordinator', 'Viewer') NOT NULL DEFAULT 'Viewer',
    departmentId INT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    lastLogin DATETIME(6) NULL,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_departmentId (departmentId),
    INDEX idx_isActive (isActive),
    FOREIGN KEY (departmentId) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: partnerships
-- ============================================
-- Stores external partnerships and sponsorships
CREATE TABLE partnerships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizationName VARCHAR(255) NOT NULL,
    contactPerson VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    website VARCHAR(255) NULL,
    linkedin VARCHAR(255) NULL,
    partnershipType ENUM('Sponsorship', 'Event', 'Workshop', 'Other') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_organizationName (organizationName),
    INDEX idx_partnershipType (partnershipType),
    INDEX idx_status (status),
    INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: file_uploads
-- ============================================
-- Tracks uploaded files (images, documents, etc.)
CREATE TABLE file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalName VARCHAR(255) NOT NULL,
    filePath VARCHAR(500) NOT NULL,
    fileSize INT NOT NULL,
    mimeType VARCHAR(100) NOT NULL,
    uploadedBy INT NULL,
    eventId INT NULL,
    uploadType ENUM('event_image', 'proof_document', 'other') DEFAULT 'other',
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_uploadedBy (uploadedBy),
    INDEX idx_eventId (eventId),
    INDEX idx_uploadType (uploadType),
    INDEX idx_createdAt (createdAt),
    FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: audit_logs
-- ============================================
-- Tracks all important changes in the system
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NULL,
    action VARCHAR(100) NOT NULL,
    entityType VARCHAR(50) NOT NULL,
    entityId INT NOT NULL,
    oldValues JSON NULL,
    newValues JSON NULL,
    ipAddress VARCHAR(45) NULL,
    userAgent TEXT NULL,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_userId (userId),
    INDEX idx_action (action),
    INDEX idx_entityType (entityType),
    INDEX idx_entityId (entityId),
    INDEX idx_createdAt (createdAt),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: notifications
-- ============================================
-- Stores system notifications for users
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    isRead BOOLEAN DEFAULT FALSE,
    link VARCHAR(500) NULL,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    readAt DATETIME(6) NULL,
    INDEX idx_userId (userId),
    INDEX idx_isRead (isRead),
    INDEX idx_createdAt (createdAt),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: event_comments
-- ============================================
-- Stores comments/notes on events (for review process)
CREATE TABLE event_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    userId INT NULL,
    comment TEXT NOT NULL,
    isInternal BOOLEAN DEFAULT FALSE,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_eventId (eventId),
    INDEX idx_userId (userId),
    INDEX idx_createdAt (createdAt),
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: settings
-- ============================================
-- Stores system-wide settings and configuration
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keyName VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NULL,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    updatedBy INT NULL,
    createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_keyName (keyName),
    FOREIGN KEY (updatedBy) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these queries to verify the setup:

-- Show all tables
-- SHOW TABLES;

-- Show table structures
-- DESCRIBE departments;
-- DESCRIBE events;
-- DESCRIBE users;
-- DESCRIBE partnerships;
-- DESCRIBE file_uploads;
-- DESCRIBE audit_logs;
-- DESCRIBE notifications;
-- DESCRIBE event_comments;
-- DESCRIBE settings;
