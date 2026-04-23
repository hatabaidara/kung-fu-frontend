// Test script to verify API connectivity and CORS
console.log('=== API CONNECTIVITY TEST ===');

// Test 1: Check if VITE_API_URL is available
const apiUrl = import.meta.env.VITE_API_URL || 'https://VOTRE-BACKEND.railway.app/api';
console.log('VITE_API_URL from environment:', apiUrl);

// Test 2: Test health endpoint
async function testHealthEndpoint() {
  try {
    console.log('Testing health endpoint...');
    
    const response = await fetch(`${apiUrl}/health`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health check successful:', data);
      return true;
    } else {
      console.log('Health check failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('Health check error:', error.message);
    return false;
  }
}

// Test 3: Test CORS headers
async function testCORS() {
  try {
    console.log('Testing CORS headers...');
    
    const response = await fetch(`${apiUrl}/health`, {
      method: 'OPTIONS'
    });
    
    console.log('CORS Response status:', response.status);
    console.log('CORS Headers:');
    console.log('Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    
    return response.ok;
  } catch (error) {
    console.log('CORS test error:', error.message);
    return false;
  }
}

// Test 4: Test actual API endpoints
async function testAPIEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test members endpoint
    const membersResponse = await fetch(`${apiUrl}/members`);
    console.log('Members endpoint status:', membersResponse.status);
    
    if (membersResponse.ok) {
      const members = await membersResponse.json();
      console.log('Members count:', members.length);
      console.log('Sample member:', members[0]);
    }
    
    return membersResponse.ok;
  } catch (error) {
    console.log('API endpoints test error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting API connectivity tests...');
  
  const healthOk = await testHealthEndpoint();
  const corsOk = await testCORS();
  const apiOk = await testAPIEndpoints();
  
  console.log('\n=== TEST RESULTS ===');
  console.log('Health Check:', healthOk ? 'PASS' : 'FAIL');
  console.log('CORS:', corsOk ? 'PASS' : 'FAIL');
  console.log('API Endpoints:', apiOk ? 'PASS' : 'FAIL');
  
  const allTestsPass = healthOk && corsOk && apiOk;
  console.log('Overall:', allTestsPass ? 'PASS' : 'FAIL');
  
  if (allTestsPass) {
    console.log('Frontend-Backend connection is working correctly!');
  } else {
    console.log('There are issues with the frontend-backend connection.');
  }
}

// Run tests when script loads
setTimeout(runAllTests, 1000);
