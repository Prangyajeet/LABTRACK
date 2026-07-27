-- ============================================
-- Remove old unique constraint on category
-- ============================================

ALTER TABLE categories
DROP CONSTRAINT IF EXISTS categories_department_id_category_name_key;

-- ============================================
-- Add composite unique constraint
-- ============================================

ALTER TABLE categories
ADD CONSTRAINT uk_category_department_status
UNIQUE (
    department_id,
    category_name,
    status
);