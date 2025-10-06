-- setup.sql
-- Library App Database Setup Script

-- 1. Create the database (run this part only once in postgres)
CREATE DATABASE library_db;

-- Connect to the new database
\c library_db;

-- 2. Create the "books" table
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  available BOOLEAN DEFAULT TRUE
);

-- 3. Optional: Insert some sample data
INSERT INTO books (title, author, available) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', TRUE),
('To Kill a Mockingbird', 'Harper Lee', FALSE),
('1984', 'George Orwell', TRUE);
