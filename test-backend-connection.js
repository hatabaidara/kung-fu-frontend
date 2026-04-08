// Test script pour vérifier la communication frontend-backend
const API_URL = 'https://kung-fu-backend.onrender.com/api';

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test API endpoints
    const apiResponse = await fetch(`${API_URL}`);
    const apiData = await apiResponse.json();
    console.log('✅ API endpoints:', apiData);
    
    // Test auth endpoint
    const authResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth working:', authData);
    } else {
      console.log('⚠️ Auth needs user creation first');
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
}

// Run test
testBackendConnection();
