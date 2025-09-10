#!/usr/bin/env node

/**
 * Setup Superadmin User
 * 
 * This script creates a superadmin user in the database and Supabase Auth
 * using the create-superadmin Edge Function.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vgpovgpwqkjnpnrjelyg.supabase.co';
const SUPERADMIN_EMAIL = 'superadmin@sms-hub.com';
const SUPERADMIN_PASSWORD = 'superadmin123!';
const SUPERADMIN_CREATION_PASSWORD = process.env.SUPERADMIN_CREATION_PASSWORD || 'setup-superadmin-2025';

async function setupSuperadmin() {
  try {
    console.log('🔐 Setting up superadmin user...');
    console.log(`📧 Email: ${SUPERADMIN_EMAIL}`);
    console.log(`🔑 Password: ${SUPERADMIN_PASSWORD}`);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-superadmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
      },
      body: JSON.stringify({
        email: SUPERADMIN_EMAIL,
        password: SUPERADMIN_PASSWORD,
        superadminPassword: SUPERADMIN_CREATION_PASSWORD
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Superadmin user created successfully!');
      console.log(`👤 User ID: ${result.userId}`);
      console.log(`📧 Email: ${result.email}`);
      console.log('');
      console.log('🚀 You can now login at:');
      console.log(`   Web App: http://localhost:3000/superadmin`);
      console.log(`   Unified App: http://localhost:3001`);
      console.log('');
      console.log('🔐 Credentials:');
      console.log(`   Email: ${SUPERADMIN_EMAIL}`);
      console.log(`   Password: ${SUPERADMIN_PASSWORD}`);
    } else {
      console.error('❌ Failed to create superadmin user:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error setting up superadmin:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupSuperadmin();
