CREATE DATABASE IF NOT EXISTS myapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'myapp_user'@'%' IDENTIFIED BY 'myapp_password';
GRANT ALL PRIVILEGES ON myapp_db.* TO 'myapp_user'@'%';
FLUSH PRIVILEGES;