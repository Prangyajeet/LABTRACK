ALTER TABLE inventory_transactions
    ADD COLUMN supplier_id BIGINT,
    ADD COLUMN invoice_number VARCHAR(100),
    ADD COLUMN purchase_order_number VARCHAR(100),
    ADD COLUMN batch_number VARCHAR(100),
    ADD COLUMN purchase_price NUMERIC(12, 2),
    ADD COLUMN receiving_date DATE,
    ADD COLUMN expiry_date DATE;