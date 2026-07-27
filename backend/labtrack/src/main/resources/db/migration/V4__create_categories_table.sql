CREATE TABLE categories (

    id BIGSERIAL PRIMARY KEY,

    department_id BIGINT NOT NULL,

    category_name VARCHAR(100) NOT NULL,

    description VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT fk_category_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT,

    CONSTRAINT uk_department_category
        UNIQUE (department_id, category_name)
);