CREATE TABLE IF NOT EXISTS users (
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
`name` VARCHAR(100),
`emp_id` VARCHAR(50),
`branches` VARCHAR(100),
`role` VARCHAR(100),
`is_active` BOOLEAN
)