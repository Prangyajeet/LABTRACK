ALTER TABLE breakage_records
DROP CONSTRAINT IF EXISTS fk_breakage_inventory_item;

ALTER TABLE breakage_records
ADD CONSTRAINT fk_breakage_item
FOREIGN KEY (inventory_item_id)
REFERENCES items(id);

DROP INDEX IF EXISTS idx_breakage_item;

CREATE INDEX idx_breakage_item
ON breakage_records(inventory_item_id);