CREATE TABLE breakage_records (
    id BIGSERIAL PRIMARY KEY,

    inventory_item_id BIGINT NOT NULL,

    breakage_date_time TIMESTAMP NOT NULL,

    quantity INTEGER NOT NULL,

    responsible_name VARCHAR(150) NOT NULL,

    person_type VARCHAR(20) NOT NULL,

    responsible_id VARCHAR(100),

    department_class_section VARCHAR(200),

    cause TEXT NOT NULL,

    estimated_cost NUMERIC(15,2) DEFAULT 0,

    recovery_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    remarks TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_breakage_inventory_item
        FOREIGN KEY (inventory_item_id)
        REFERENCES inventory_items(id),

    CONSTRAINT chk_breakage_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_breakage_person_type
        CHECK (person_type IN ('STUDENT', 'FACULTY', 'STAFF')),

    CONSTRAINT chk_breakage_recovery_status
        CHECK (recovery_status IN ('PENDING', 'PAID', 'WAIVED')),

    CONSTRAINT chk_breakage_cost
        CHECK (estimated_cost >= 0)
);

CREATE INDEX idx_breakage_date
    ON breakage_records(breakage_date_time);

CREATE INDEX idx_breakage_item
    ON breakage_records(inventory_item_id);

CREATE INDEX idx_breakage_person_type
    ON breakage_records(person_type);

CREATE INDEX idx_breakage_recovery_status
    ON breakage_records(recovery_status);

CREATE INDEX idx_breakage_status
    ON breakage_records(status);