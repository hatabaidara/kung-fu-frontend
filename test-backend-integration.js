// Test script pour vérifier l'intégration frontend-backend
const API_BASE_URL = 'https://kung-fu-backend.onrender.com/api';

async function testBackendIntegration() {
  console.log('🔍 Testing backend integration...');
  
  try {
    // Test 1: Health check
    console.log('\n1️⃣ Testing /api/health...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: API endpoints list
    console.log('\n2️⃣ Testing /api...');
    const apiResponse = await fetch(`${API_BASE_URL}`);
    const apiData = await apiResponse.json();
    console.log('✅ API endpoints:', apiData);
    
    // Test 3: Database config
    console.log('\n3️⃣ Testing /api/test...');
    const testResponse = await fetch(`${API_BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('✅ Database config:', testData);
    
    // Test 4: Register (POST)
    console.log('\n4️⃣ Testing /api/auth/register...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test_user',
        email: 'test@example.com',
        password: 'Test1234!'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Register successful:', registerData);
    } else {
      console.log('❌ Register failed:', registerResponse.status);
    }
    
    // Test 5: Login (POST)
    console.log('\n5️⃣ Testing /api/auth/login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test_user',
        password: 'Test1234!'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
      
      // Test 6: Authenticated request
      console.log('\n6️⃣ Testing authenticated request...');
      const authResponse = await fetch(`${API_BASE_URL}/members`, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        console.log('✅ Authenticated request successful:', authData);
      } else {
        console.log('⚠️ Authenticated request failed:', authResponse.status);
      }
    } else {
      console.log('❌ Login failed:', loginResponse.status);
    }
    
    console.log('\n🎉 Integration test completed!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

// Run test
testBackendIntegration();
