ALTER TABLE departments
DROP CONSTRAINT IF EXISTS departments_department_name_key;

ALTER TABLE departments
ADD CONSTRAINT uk_department_name_status
UNIQUE (department_name, status);