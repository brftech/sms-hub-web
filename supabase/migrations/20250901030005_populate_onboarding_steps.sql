-- Populate onboarding_steps table with standardized steps for all hubs
-- This data is required for the onboarding UI to function properly

-- First, ensure hubs have the correct hub_numbers
-- We'll work with the existing hub_numbers as they are to avoid foreign key issues
-- From the screenshot: PercyMD=2, PercyTech=0, PercyText=4, Gnymble=1
-- We need to map these to the desired: PercyTech=1, Gnymble=2, PercyMD=3, PercyText=4

-- Create a mapping table for the onboarding steps based on existing hub_numbers
-- PercyTech (currently 0) -> will use 0 for now, maps to desired 1
-- Gnymble (currently 1) -> will use 1 for now, maps to desired 2  
-- PercyMD (currently 2) -> will use 2 for now, maps to desired 3
-- PercyText (currently 4) -> will use 4 for now, maps to desired 4

-- Insert onboarding steps for each hub using CURRENT hub_numbers from screenshot
-- PercyTech=0, Gnymble=1, PercyMD=2, PercyText=4
INSERT INTO public.onboarding_steps (hub_id, step_name, step_number, step_description, is_required) VALUES
-- PercyTech (hub_id: 0)
(0, 'verification', 0, 'Verify your phone number and email address', true),
(0, 'payment', 1, 'Complete Stripe payment processing', true),
(0, 'brand', 2, 'Register your brand with The Campaign Registry', true),
(0, 'privacy_terms', 3, 'Accept privacy policy and terms of service', true),
(0, 'campaign', 4, 'Create your SMS campaign with The Campaign Registry', true),
(0, 'bandwidth', 5, 'Get your dedicated Bandwidth phone number', true),
(0, 'activation', 6, 'Activate your SMS platform', true),

-- Gnymble (hub_id: 1)
(1, 'verification', 0, 'Verify your phone number and email address', true),
(1, 'payment', 1, 'Complete Stripe payment processing', true),
(1, 'brand', 2, 'Register your brand with The Campaign Registry', true),
(1, 'privacy_terms', 3, 'Accept privacy policy and terms of service', true),
(1, 'campaign', 4, 'Create your SMS campaign with The Campaign Registry', true),
(1, 'bandwidth', 5, 'Get your dedicated Bandwidth phone number', true),
(1, 'activation', 6, 'Activate your SMS platform', true),

-- PercyMD (hub_id: 2)
(2, 'verification', 0, 'Verify your phone number and email address', true),
(2, 'payment', 1, 'Complete Stripe payment processing', true),
(2, 'brand', 2, 'Register your brand with The Campaign Registry', true),
(2, 'privacy_terms', 3, 'Accept privacy policy and terms of service', true),
(2, 'campaign', 4, 'Create your SMS campaign with The Campaign Registry', true),
(2, 'bandwidth', 5, 'Get your dedicated Bandwidth phone number', true),
(2, 'activation', 6, 'Activate your SMS platform', true),

-- PercyText (hub_id: 4)
(4, 'verification', 0, 'Verify your phone number and email address', true),
(4, 'payment', 1, 'Complete Stripe payment processing', true),
(4, 'brand', 2, 'Register your brand with The Campaign Registry', true),
(4, 'privacy_terms', 3, 'Accept privacy policy and terms of service', true),
(4, 'campaign', 4, 'Create your SMS campaign with The Campaign Registry', true),
(4, 'bandwidth', 5, 'Get your dedicated Bandwidth phone number', true),
(4, 'activation', 6, 'Activate your SMS platform', true);
