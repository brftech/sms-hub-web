// Test database connections directly with psql
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

async function testConnections() {
  console.log('Testing Supabase database connections...\n');

  const devPassword = 'Ali1dog2!!@@';
  const prodPassword = 'Ali1dog2@@##';

  // Test Development Database
  console.log('1. Testing DEVELOPMENT database (sms-hub-monorepo)...');
  const devConnString = `postgresql://postgres:${encodeURIComponent(devPassword)}@db.vgpovgpwqkjnpnrjelyg.supabase.co:5432/postgres`;

  try {
    // Test with psql SELECT 1
    const devCommand = `psql "${devConnString}" -c "SELECT 1" 2>&1`;
    const { stdout, stderr } = await execPromise(devCommand);
    if (stdout.includes('?column?') || stdout.includes('1')) {
      console.log('   ✅ Development database connection successful!');
    } else {
      console.log('   ❌ Connection test returned unexpected result');
    }
  } catch (err) {
    console.log('   ❌ Development database connection failed');
    console.log('   Error:', err.message.split('\n')[0]);
  }

  // Test Production Database
  console.log('\n2. Testing PRODUCTION database (PercyTech)...');
  const prodConnString = `postgresql://postgres:${encodeURIComponent(prodPassword)}@db.howjinnvvtvaufihwers.supabase.co:5432/postgres`;

  try {
    const prodCommand = `psql "${prodConnString}" -c "SELECT 1" 2>&1`;
    const { stdout, stderr } = await execPromise(prodCommand);
    if (stdout.includes('?column?') || stdout.includes('1')) {
      console.log('   ✅ Production database connection successful!');
    } else {
      console.log('   ❌ Connection test returned unexpected result');
    }
  } catch (err) {
    console.log('   ❌ Production database connection failed');
    console.log('   Error:', err.message.split('\n')[0]);
  }

  console.log('\n3. Alternative: Test with Supabase CLI');
  console.log('   Current linked project:');
  try {
    const { stdout } = await execPromise('npx supabase status 2>&1');
    const lines = stdout.split('\n');
    const projectLine = lines.find(line => line.includes('API URL'));
    if (projectLine) {
      console.log('   ', projectLine.trim());
    }
  } catch (err) {
    console.log('   Unable to get Supabase status');
  }
}

testConnections();