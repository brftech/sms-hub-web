-- Reassign hub numbers to the desired mapping
-- PercyTech=1, Gnymble=2, PercyMD=3, PercyText=4
-- We need to update companies table first to avoid foreign key constraint violations

-- Step 1: Temporarily disable foreign key constraint to allow reassignment
ALTER TABLE public.companies DROP CONSTRAINT companies_hub_id_fkey;

-- Step 2: Update companies table references 
-- Current mapping: PercyTech=0, Gnymble=1, PercyMD=2, PercyText=4
-- Target mapping: PercyTech=1, Gnymble=2, PercyMD=3, PercyText=4
UPDATE public.companies SET hub_id = 101 WHERE hub_id = 0; -- PercyTech temp
UPDATE public.companies SET hub_id = 102 WHERE hub_id = 1; -- Gnymble temp  
UPDATE public.companies SET hub_id = 103 WHERE hub_id = 2; -- PercyMD temp
-- PercyText (4) can stay as is since it's the target value

-- Step 3: Update hub_number assignments in hubs table
-- First move to temporary values to avoid unique constraint violations
UPDATE public.hubs SET hub_number = 201 WHERE name = 'PercyTech';   -- 0 -> temp
UPDATE public.hubs SET hub_number = 202 WHERE name = 'Gnymble';     -- 1 -> temp  
UPDATE public.hubs SET hub_number = 203 WHERE name = 'PercyMD';     -- 2 -> temp
UPDATE public.hubs SET hub_number = 204 WHERE name = 'PercyText';   -- 4 -> temp

-- Now assign final values
UPDATE public.hubs SET hub_number = 1 WHERE hub_number = 201;  -- PercyTech: temp -> 1
UPDATE public.hubs SET hub_number = 2 WHERE hub_number = 202;  -- Gnymble: temp -> 2
UPDATE public.hubs SET hub_number = 3 WHERE hub_number = 203;  -- PercyMD: temp -> 3
UPDATE public.hubs SET hub_number = 4 WHERE hub_number = 204;  -- PercyText: temp -> 4

-- Step 4: Update companies table to final values
UPDATE public.companies SET hub_id = 1 WHERE hub_id = 101; -- PercyTech: temp -> 1
UPDATE public.companies SET hub_id = 2 WHERE hub_id = 102; -- Gnymble: temp -> 2
UPDATE public.companies SET hub_id = 3 WHERE hub_id = 103; -- PercyMD: temp -> 3

-- Step 5: Re-enable foreign key constraint
ALTER TABLE public.companies ADD CONSTRAINT companies_hub_id_fkey 
    FOREIGN KEY (hub_id) REFERENCES public.hubs(hub_number);

-- Step 4: Update onboarding_steps to use new hub_id assignments
UPDATE public.onboarding_steps SET hub_id = 1 WHERE hub_id = 0; -- PercyTech: 0 -> 1
UPDATE public.onboarding_steps SET hub_id = 2 WHERE hub_id = 1; -- Gnymble: 1 -> 2  
UPDATE public.onboarding_steps SET hub_id = 3 WHERE hub_id = 2; -- PercyMD: 2 -> 3
-- PercyText already at 4, no change needed
