CREATE DATABASE IF NOT EXISTS fams_db;
USE fams_db;

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS asset_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    category_id BIGINT,
    purchase_date DATE NOT NULL,
    purchase_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    owner_id BIGINT,
    status VARCHAR(20),
    FOREIGN KEY (category_id) REFERENCES asset_categories(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_no VARCHAR(50) NOT NULL UNIQUE,
    asset_id BIGINT,
    type VARCHAR(20),
    transaction_date DATETIME,
    quantity INT,
    price DECIMAL(15,2),
    amount DECIMAL(15,2),
    from_user_id BIGINT,
    to_user_id BIGINT,
    notes VARCHAR(255),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS portfolios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data (Roles, Permissions, Categories)
INSERT INTO permissions (name) VALUES ('VIEW'),('ADD'),('EDIT'),('DELETE'),('REPORT')
    ON DUPLICATE KEY UPDATE name = name;

INSERT INTO roles (name) VALUES ('ADMIN'),('MANAGER'),('EMPLOYEE'),('INVESTOR')
    ON DUPLICATE KEY UPDATE name = name;

-- Role-based permissions (each role is different)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
WHERE (r.name='ADMIN' AND p.name IN ('VIEW','ADD','EDIT','DELETE','REPORT'))
   OR (r.name='MANAGER' AND p.name IN ('VIEW','ADD','EDIT','REPORT'))
   OR (r.name='EMPLOYEE' AND p.name IN ('VIEW','ADD','EDIT'))
   OR (r.name='INVESTOR' AND p.name IN ('VIEW','REPORT'))
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO asset_categories (name)
VALUES ('Stocks'),('Bonds'),('Mutual Funds'),('Real Estate'),('Fixed Assets')
    ON DUPLICATE KEY UPDATE name = name;

-- Note: Demo users are auto-created by the Spring Boot app on first run (see DataInitializer).
