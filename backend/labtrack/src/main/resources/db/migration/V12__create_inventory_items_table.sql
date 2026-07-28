CREATE TABLE inventory_items
(
    id BIGSERIAL PRIMARY KEY,

    item_code VARCHAR(30) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    description VARCHAR(1000),

    category_id BIGINT NOT NULL,
    supplier_id BIGINT NOT NULL,
    storage_location_id BIGINT NOT NULL,

    unit VARCHAR(30) NOT NULL,

    quantity INTEGER NOT NULL,
    minimum_quantity INTEGER NOT NULL,
    maximum_quantity INTEGER NOT NULL,

    unit_price NUMERIC(12,2) NOT NULL,

    batch_number VARCHAR(50),

    manufacture_date DATE,
    expiry_date DATE,

    remarks VARCHAR(500),

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_inventory_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_inventory_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id),

    CONSTRAINT fk_inventory_storage
        FOREIGN KEY (storage_location_id)
        REFERENCES storage_locations(id)
);