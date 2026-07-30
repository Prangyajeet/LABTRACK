CREATE TABLE inventory_transactions (

    id BIGSERIAL PRIMARY KEY,

    transaction_number VARCHAR(30) NOT NULL UNIQUE,

    inventory_item_id BIGINT NOT NULL,

    transaction_type VARCHAR(30) NOT NULL,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    remarks VARCHAR(500),

    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    performed_by BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT fk_inventory_transaction_inventory
        FOREIGN KEY (inventory_item_id)
        REFERENCES inventory_items(id),

    CONSTRAINT fk_inventory_transaction_user
        FOREIGN KEY (performed_by)
        REFERENCES users(id)
);

-- ===========================================
-- Indexes
-- ===========================================

CREATE INDEX idx_inventory_transaction_inventory
ON inventory_transactions(inventory_item_id);

CREATE INDEX idx_inventory_transaction_user
ON inventory_transactions(performed_by);

CREATE INDEX idx_inventory_transaction_type
ON inventory_transactions(transaction_type);

CREATE INDEX idx_inventory_transaction_date
ON inventory_transactions(transaction_date);

CREATE INDEX idx_inventory_transaction_status
ON inventory_transactions(status);