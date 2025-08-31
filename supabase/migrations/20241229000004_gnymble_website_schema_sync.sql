-- Migration: 20241229000004_gnymble_website_schema_sync.sql
-- Purpose: Sync schema with gnymble-website expectations
-- Description: Add missing fields to leads and lead_activities tables to support contact form submissions

-- 1. Add missing fields to leads table to match gnymble-website schema
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS priority VARCHAR(20),
ADD COLUMN IF NOT EXISTS source_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- 2. Add description field to lead_activities table
ALTER TABLE public.lead_activities 
ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Create indexes for new fields for better performance
CREATE INDEX IF NOT EXISTS idx_leads_first_name ON public.leads(first_name);
CREATE INDEX IF NOT EXISTS idx_leads_last_name ON public.leads(last_name);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON public.leads(updated_at);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_source_type ON public.leads(source_type);

-- 4. Create index for lead_activities description field
CREATE INDEX IF NOT EXISTS idx_lead_activities_description ON public.lead_activities(description);

-- 5. Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS trigger_update_leads_updated_at ON public.leads;

-- Create trigger
CREATE TRIGGER trigger_update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_updated_at();

-- 6. Update existing records to populate new fields where possible
-- Split existing 'name' field into first_name and last_name
UPDATE public.leads 
SET 
    first_name = SPLIT_PART(name, ' ', 1),
    last_name = CASE 
        WHEN POSITION(' ' IN name) > 0 
        THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
        ELSE NULL 
    END,
    phone = lead_phone_number,
    status = 'new'
WHERE first_name IS NULL OR last_name IS NULL;

-- 7. Add comments for documentation
COMMENT ON COLUMN public.leads.first_name IS 'First name of the lead contact';
COMMENT ON COLUMN public.leads.last_name IS 'Last name of the lead contact';
COMMENT ON COLUMN public.leads.phone IS 'Phone number of the lead contact (alias for lead_phone_number)';
COMMENT ON COLUMN public.leads.status IS 'Current status of the lead (new, contacted, qualified, converted, lost)';
COMMENT ON COLUMN public.leads.updated_at IS 'Timestamp when the lead was last updated';
COMMENT ON COLUMN public.leads.lead_score IS 'Lead scoring value (0-100)';
COMMENT ON COLUMN public.leads.priority IS 'Priority level of the lead (low, medium, high, urgent)';
COMMENT ON COLUMN public.leads.source_type IS 'Type of lead source for categorization';
COMMENT ON COLUMN public.leads.user_agent IS 'User agent string from lead submission';

COMMENT ON COLUMN public.lead_activities.description IS 'Human-readable description of the lead activity';

-- 8. Verify the changes
DO $$
BEGIN
    -- Check if all required columns exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name IN ('first_name', 'last_name', 'phone', 'status', 'updated_at')
    ) THEN
        RAISE EXCEPTION 'Required columns were not added to leads table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lead_activities' 
        AND column_name = 'description'
    ) THEN
        RAISE EXCEPTION 'Description column was not added to lead_activities table';
    END IF;
    
    RAISE NOTICE 'Schema sync completed successfully!';
END $$;
