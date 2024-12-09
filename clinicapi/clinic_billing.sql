-- Create the database
CREATE DATABASE IF NOT EXISTS clinic_billing;

-- Use the database
USE clinic_billing;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    medical_records TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_time DATETIME NOT NULL,
    status ENUM('booked', 'cancelled') DEFAULT 'booked',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the insurance_claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert a default admin account for testing
INSERT INTO users (username, password, medical_records) VALUES
('admin', '$2y$10$V9trfojqYAFNUBT.lMkf5eCUMzowF6R4P7tNvc29zh6Pm3IfFizVS', NULL); -- Password: admin123
