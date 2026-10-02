-- ============================================================
-- V21
-- Fix Breakage -> Item relationship
--
-- Old:
-- breakage_records.inventory_item_id
--     -> inventory_items.id
--
-- Correct:
-- breakage_records.inventory_item_id
--     -> items.id
-- ============================================================

ALTER TABLE breakage_records
DROP CONSTRAINT IF EXISTS fkraylog657jcy42ellj1a0afux;

ALTER TABLE breakage_records
DROP CONSTRAINT IF EXISTS fk_breakage_inventory_item;

ALTER TABLE breakage_records
DROP CONSTRAINT IF EXISTS fk_breakage_item;

ALTER TABLE breakage_records
ADD CONSTRAINT fk_breakage_item
FOREIGN KEY (inventory_item_id)
REFERENCES items(id);