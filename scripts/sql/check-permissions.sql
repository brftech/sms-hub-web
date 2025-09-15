-- Check if RLS is enabled on tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'companies', 'customers')
ORDER BY tablename;

-- Check current user and permissions
SELECT current_user, current_setting('role');

-- Check if service role can access user_profiles
SELECT has_table_privilege('service_role', 'public.user_profiles', 'SELECT');
SELECT has_table_privilege('authenticated', 'public.user_profiles', 'SELECT');
SELECT has_table_privilege('anon', 'public.user_profiles', 'SELECT');

-- Check policies on user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';

-- Try to enable RLS if it's in a weird state
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role full access
CREATE POLICY "Service role has full access" ON public.user_profiles
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access" ON public.companies
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access" ON public.customers
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Also create policies for authenticated users to access their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Grant permissions explicitly
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.companies TO service_role;
GRANT ALL ON public.customers TO service_role;
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.companies TO authenticated;
GRANT SELECT ON public.customers TO authenticated;