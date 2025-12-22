-- This migration adds the parentGenre column to AdvancedGenre table
-- The column was already added manually to the database, so we check if it exists first

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'AdvancedGenre' 
        AND column_name = 'parentGenre'
    ) THEN
        ALTER TABLE "AdvancedGenre" ADD COLUMN "parentGenre" TEXT;
    END IF;
END $$;