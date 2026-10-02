CREATE TABLE IF NOT EXISTS equipment (

    id BIGSERIAL PRIMARY KEY,

    equipment_name VARCHAR(150) NOT NULL,

    equipment_code VARCHAR(50) NOT NULL,

    category VARCHAR(50) NOT NULL,

    manufacturer VARCHAR(150),

    model VARCHAR(100),

    serial_number VARCHAR(100),

    purchase_date DATE,

    purchase_cost NUMERIC(15,2),

    warranty_until DATE,

    location VARCHAR(150),

    amc_provider VARCHAR(150),

    amc_contact VARCHAR(100),

    amc_start DATE,

    amc_end DATE,

    amc_cost_per_year NUMERIC(15,2),

    amc_type VARCHAR(50),

    amc_coverage_notes VARCHAR(500),

    last_maintenance_date DATE,

    next_maintenance_date DATE,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP,

    CONSTRAINT uk_equipment_code
        UNIQUE (equipment_code),

    CONSTRAINT uk_equipment_serial
        UNIQUE (serial_number)

);

CREATE TABLE IF NOT EXISTS equipment_maintenance_logs (

    id BIGSERIAL PRIMARY KEY,

    equipment_id BIGINT NOT NULL,

    maintenance_date DATE NOT NULL,

    maintenance_type VARCHAR(50) NOT NULL,

    performed_by VARCHAR(150) NOT NULL,

    cost NUMERIC(15,2),

    notes VARCHAR(1000),

    next_scheduled_date DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_maintenance_equipment
        FOREIGN KEY (equipment_id)
        REFERENCES equipment(id)
        ON DELETE RESTRICT

);

CREATE INDEX IF NOT EXISTS idx_equipment_category
    ON equipment(category);

CREATE INDEX IF NOT EXISTS idx_equipment_status
    ON equipment(status);

CREATE INDEX IF NOT EXISTS idx_equipment_amc_end
    ON equipment(amc_end);

CREATE INDEX IF NOT EXISTS idx_equipment_next_maintenance
    ON equipment(next_maintenance_date);

CREATE INDEX IF NOT EXISTS idx_maintenance_equipment
    ON equipment_maintenance_logs(equipment_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_date
    ON equipment_maintenance_logs(maintenance_date);