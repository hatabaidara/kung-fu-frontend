// Simple test to verify frontend is working
console.log('=== SIMPLE FRONTEND TEST ===');

// Test basic React rendering
setTimeout(() => {
  const root = document.getElementById('root');
  if (root) {
    const content = root.innerHTML;
    console.log('📱 Root element content length:', content.length);
    
    if (content.length > 100) {
      console.log('✅ React app is rendering content');
    } else {
      console.log('❌ React app content is minimal or empty');
    }
    
    // Check for error patterns
    if (content.includes('error') || content.includes('Error')) {
      console.log('⚠️  Error content detected');
    }
  } else {
    console.log('❌ Root element not found');
  }
}, 2000);

// Test API connectivity
setTimeout(async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('🔗 API URL:', apiUrl);
    
    const response = await fetch(`${apiUrl}/health`);
    if (response.ok) {
      console.log('✅ API connectivity working');
      const data = await response.json();
      console.log('📊 API response:', data);
    } else {
      console.log('❌ API connectivity failed:', response.status);
    }
  } catch (error) {
    console.log('❌ API error:', error.message);
  }
}, 3000);
