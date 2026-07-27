CREATE TABLE suppliers (

    id BIGSERIAL PRIMARY KEY,

    supplier_name VARCHAR(100) NOT NULL,

    contact_person VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL,

    phone_number VARCHAR(15) NOT NULL,

    address TEXT NOT NULL,

    gst_number VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT uk_supplier_name_status
        UNIQUE (supplier_name, status),

    CONSTRAINT uk_supplier_email_status
        UNIQUE (email, status),

    CONSTRAINT uk_supplier_phone_status
        UNIQUE (phone_number, status),

    CONSTRAINT uk_supplier_gst_status
        UNIQUE (gst_number, status)
);