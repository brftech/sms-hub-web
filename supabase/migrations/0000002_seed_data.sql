-- Seed Data for SMS Hub Web Marketing Database
-- Creates initial hubs and default marketing lists

-- =====================================================
-- INSERT HUBS
-- =====================================================

INSERT INTO hubs (hub_number, name, domain) VALUES
    (0, 'PercyTech', 'percytech.com'),
    (1, 'Gnymble', 'gnymble.com'),
    (2, 'PercyMD', 'percymd.com'),
    (3, 'PercyText', 'percytext.com')
ON CONFLICT (hub_number) DO NOTHING;

-- =====================================================
-- CREATE DEFAULT EMAIL LISTS (one per hub)
-- =====================================================

-- PercyTech Email List
INSERT INTO email_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 0, 'PercyTech Marketing', 'Main marketing list for PercyTech hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- Gnymble Email List
INSERT INTO email_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('00000000-0000-0000-0000-000000000002', 1, 'Gnymble Marketing', 'Main marketing list for Gnymble hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- PercyMD Email List
INSERT INTO email_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('00000000-0000-0000-0000-000000000003', 2, 'PercyMD Marketing', 'Main marketing list for PercyMD hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- PercyText Email List
INSERT INTO email_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('00000000-0000-0000-0000-000000000004', 3, 'PercyText Marketing', 'Main marketing list for PercyText hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE DEFAULT SMS LISTS (one per hub)
-- =====================================================

-- PercyTech SMS List
INSERT INTO sms_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 0, 'PercyTech SMS', 'Main SMS list for PercyTech hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- Gnymble SMS List
INSERT INTO sms_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('10000000-0000-0000-0000-000000000002', 1, 'Gnymble SMS', 'Main SMS list for Gnymble hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- PercyMD SMS List
INSERT INTO sms_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('10000000-0000-0000-0000-000000000003', 2, 'PercyMD SMS', 'Main SMS list for PercyMD hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- PercyText SMS List
INSERT INTO sms_lists (id, hub_id, list_name, description, list_type, status)
VALUES 
    ('10000000-0000-0000-0000-000000000004', 3, 'PercyText SMS', 'Main SMS list for PercyText hub', 'marketing', 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE HELPER FUNCTION TO GET DEFAULT LIST ID
-- =====================================================

-- Function to get the default email list for a hub
CREATE OR REPLACE FUNCTION get_default_email_list_id(p_hub_id INTEGER)
RETURNS UUID AS $$
DECLARE
    list_id UUID;
BEGIN
    SELECT id INTO list_id
    FROM email_lists
    WHERE hub_id = p_hub_id
    AND list_type = 'marketing'
    ORDER BY created_at ASC
    LIMIT 1;
    
    RETURN list_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get the default SMS list for a hub
CREATE OR REPLACE FUNCTION get_default_sms_list_id(p_hub_id INTEGER)
RETURNS UUID AS $$
DECLARE
    list_id UUID;
BEGIN
    SELECT id INTO list_id
    FROM sms_lists
    WHERE hub_id = p_hub_id
    AND list_type = 'marketing'
    ORDER BY created_at ASC
    LIMIT 1;
    
    RETURN list_id;
END;
$$ LANGUAGE plpgsql;

-- Log the migration
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed data migration completed';
  RAISE NOTICE '- Created 4 hubs';
  RAISE NOTICE '- Created 4 default email lists';
  RAISE NOTICE '- Created 4 default SMS lists';
  RAISE NOTICE '- Created helper functions';
  RAISE NOTICE '========================================';
END $$;

