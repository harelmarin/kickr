ALTER TABLE competitions ADD COLUMN type VARCHAR(20) DEFAULT 'LEAGUE';
UPDATE competitions SET type = 'CUP' WHERE external_id IN (2, 3, 848);
