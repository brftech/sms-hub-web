-- Add message column to leads table (if it doesn't exist)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;

-- Add other missing columns that are in the TypeScript types but not in the migration
ALTER TABLE leads ADD COLUMN IF NOT EXISTS interaction_count INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_interaction_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_phone_number TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS platform_interest TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_agent TEXT;
