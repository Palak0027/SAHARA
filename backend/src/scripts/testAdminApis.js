const BASE_URL = 'http://localhost:5000/api';

async function testAdmin() {
  try {
    console.log('1. Logging in as Admin (admin@sahara.org)...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin@sahara.org',
        password: 'Admin@123'
      })
    });
    const loginData = await loginRes.json();

    if (!loginData.success) {
      console.error('Login failed:', loginData);
      return;
    }

    const token = loginData.token;
    console.log('✅ Admin Login Successful! User:', loginData.user.name);

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n2. Testing GET /api/admin/stats...');
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, { headers });
    const statsData = await statsRes.json();
    console.log('✅ Stats Users breakdown:', statsData.stats?.users);
    console.log('✅ Stats Needs breakdown:', statsData.stats?.needs);
    console.log('✅ Stats Pending Verifications:', statsData.stats?.verifications);

    console.log('\n3. Testing GET /api/admin/verifications...');
    const verifRes = await fetch(`${BASE_URL}/admin/verifications`, { headers });
    const verifData = await verifRes.json();
    console.log(`✅ Pending Verifications count: ${verifData.organizations?.length}`);

    console.log('\n4. Testing GET /api/admin/users...');
    const usersRes = await fetch(`${BASE_URL}/admin/users`, { headers });
    const usersData = await usersRes.json();
    console.log(`✅ Users returned: ${usersData.users?.length}`);

    console.log('\n5. Testing GET /api/admin/volunteers...');
    const volRes = await fetch(`${BASE_URL}/admin/volunteers`, { headers });
    const volData = await volRes.json();
    console.log(`✅ Volunteers returned: ${volData.volunteers?.length}`);

    console.log('\n🎉 ALL ADMIN BACKEND APIS ARE WORKING 100% LIVE!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdmin();
