CREATE TABLE storage_locations (

    id BIGSERIAL PRIMARY KEY,

    location_code VARCHAR(20) NOT NULL,

    location_name VARCHAR(100) NOT NULL,

    description TEXT,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT uk_storage_location_code_status
        UNIQUE(location_code, status),

    CONSTRAINT uk_storage_location_name_status
        UNIQUE(location_name, status)
);