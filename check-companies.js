const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vgpovgpwqkjnpnrjelyg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompanies() {
  try {
    console.log('🔍 Checking companies...');
    
    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, public_name, hub_id, payment_status, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching companies:', error);
      return;
    }
    
    console.log(`📊 Found ${companies.length} companies:`);
    companies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.public_name} (ID: ${company.id})`);
      console.log(`   Hub: ${company.hub_id}, Payment: ${company.payment_status || 'null'}`);
      console.log(`   Created: ${company.created_at}`);
      console.log('');
    });
    
    // Check user profiles
    console.log('👤 Checking user profiles...');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, role, company_id, payment_status, onboarding_completed')
      .order('created_at', { ascending: false });
    
    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError);
      return;
    }
    
    console.log(`👥 Found ${profiles.length} user profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.email} (Role: ${profile.role})`);
      console.log(`   Company ID: ${profile.company_id}, Payment: ${profile.payment_status || 'null'}`);
      console.log(`   Onboarding: ${profile.onboarding_completed ? 'Completed' : 'Not completed'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCompanies();
