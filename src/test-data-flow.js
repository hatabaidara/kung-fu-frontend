// Test script to verify data flow and search functionality
console.log('=== DATA FLOW AND SEARCH VERIFICATION ===');

// Test 1: Check if API_BASE_URL is correctly set
const apiBaseUrl = import.meta.env.VITE_API_URL;
console.log('🔗 API_BASE_URL:', apiBaseUrl);

// Test 2: Test API connectivity
async function testAPIConnectivity() {
  try {
    console.log('\n=== API CONNECTIVITY TEST ===');
    
    // Test health endpoint
    const healthResponse = await fetch(`${apiBaseUrl}/health`);
    if (healthResponse.ok) {
      console.log('✅ Backend health check passed');
      const healthData = await healthResponse.json();
      console.log('📊 Health data:', healthData);
    } else {
      console.log('❌ Backend health check failed:', healthResponse.status);
    }
    
    // Test members endpoint
    const membersResponse = await fetch(`${apiBaseUrl}/members`);
    if (membersResponse.ok) {
      console.log('✅ Members endpoint accessible');
      const members = await membersResponse.json();
      console.log('👥 Members count:', members.length);
      
      // Test search functionality
      const searchTerm = 'Test';
      const searchResults = members.filter(member => 
        member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`🔍 Search results for "${searchTerm}":`, searchResults.length);
      if (searchResults.length > 0) {
        console.log('📋 Found members:');
        searchResults.forEach(member => {
          console.log(`   - ${member.first_name} ${member.last_name} (${member.email})`);
        });
      }
    } else {
      console.log('❌ Members endpoint failed:', membersResponse.status);
    }
    
  } catch (error) {
    console.log('❌ API connectivity error:', error.message);
  }
}

// Test 3: Test data creation
async function testDataCreation() {
  try {
    console.log('\n=== DATA CREATION TEST ===');
    
    const testMember = {
      first_name: 'Test',
      last_name: 'User',
      email: `test.user.${Date.now()}@example.com`,
      phone: '+33612345678',
      date_of_birth: '1990-01-01',
      membership_type: 'basic',
      membership_status: 'active',
      join_date: '2024-01-01',
      expiry_date: '2024-12-31'
    };
    
    const createResponse = await fetch(`${apiBaseUrl}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMember)
    });
    
    if (createResponse.ok) {
      console.log('✅ Member created successfully');
      const createdMember = await createResponse.json();
      console.log('📝 Created member ID:', createdMember.id);
      
      // Verify it appears in search
      setTimeout(async () => {
        const membersResponse = await fetch(`${apiBaseUrl}/members`);
        const members = await membersResponse.json();
        const foundMember = members.find(m => m.id === createdMember.id);
        
        if (foundMember) {
          console.log('✅ Created member appears in search results');
        } else {
          console.log('❌ Created member not found in search results');
        }
      }, 2000);
      
    } else {
      console.log('❌ Member creation failed:', createResponse.status);
      const errorData = await createResponse.text();
      console.log('📄 Error response:', errorData);
    }
    
  } catch (error) {
    console.log('❌ Data creation error:', error.message);
  }
}

// Test 4: Check React component rendering
function checkReactRendering() {
  console.log('\n=== REACT RENDERING CHECK ===');
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const innerHTML = rootElement.innerHTML;
    
    if (innerHTML && innerHTML.length > 0) {
      console.log('✅ React content is rendering');
      
      // Check for common React patterns
      if (innerHTML.includes('data-reactroot') || innerHTML.includes('react')) {
        console.log('✅ React detected in DOM');
      }
      
      // Check for error indicators
      if (innerHTML.includes('error') || innerHTML.includes('Error')) {
        console.log('⚠️  Potential error content detected');
      }
      
    } else {
      console.log('❌ No React content rendered');
    }
  } else {
    console.log('❌ Root element not found');
  }
}

// Run all tests
setTimeout(() => {
  testAPIConnectivity();
  testDataCreation();
  checkReactRendering();
}, 1000);

console.log('✅ Data flow verification script loaded');
