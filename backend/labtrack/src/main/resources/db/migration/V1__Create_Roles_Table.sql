CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,

    role_name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (role_name, description)
VALUES
('ADMIN', 'Full system access'),
('FACULTY', 'Faculty inventory and reports access'),
('TECHNICIAN', 'Daily laboratory operations');