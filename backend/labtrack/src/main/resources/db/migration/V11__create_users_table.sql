CREATE TABLE users (

    id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL,

    password VARCHAR(255) NOT NULL,

    phone_number VARCHAR(15) NOT NULL,

    role_id BIGINT NOT NULL,

    department_id BIGINT NOT NULL,

    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,

    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,

    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    last_login_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT uk_user_email_status
        UNIQUE (email, status),

    CONSTRAINT uk_user_phone_status
        UNIQUE (phone_number, status),

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id),

    CONSTRAINT fk_user_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
);