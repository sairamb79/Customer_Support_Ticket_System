CREATE DATABASE support_ticket_system;

USE support_ticket_system;

SHOW TABLES;

-- create a admin user
INSERT INTO users (username, email, password, user_type) 
VALUES ('admin', 'admin@sts.com', '$2a$10$8Wof4.VIzCmsXQF4EmZcNOHQg4GgOsa/LUhI5CfwvLbztWVEMHP8i', 'admin');
