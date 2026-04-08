// Minimal test to check if React is loading
console.log('=== MINIMAL REACT TEST ===');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM loaded');
  
  // Check if root element exists
  const root = document.getElementById('root');
  if (root) {
    console.log('✅ Root element found');
    
    // Wait a bit for React to render
    setTimeout(() => {
      const content = root.innerHTML;
      console.log('📊 Root content length:', content.length);
      
      if (content.length > 0) {
        console.log('✅ React content is rendering');
        
        // Look for React patterns
        if (content.includes('data-reactroot') || 
            content.includes('react') || 
            content.includes('React') ||
            content.includes('class="') ||
            content.includes('style="')) {
          console.log('✅ React components detected');
        } else {
          console.log('⚠️  React patterns not clearly detected');
        }
        
        // Check for errors
        if (content.includes('error') || content.includes('Error')) {
          console.log('❌ Error content detected');
        } else {
          console.log('✅ No obvious errors in content');
        }
        
        // Log actual content for debugging
        console.log('📄 First 200 chars of content:', content.substring(0, 200));
        
      } else {
        console.log('❌ React content is empty');
      }
    }, 3000);
    
  } else {
    console.log('❌ Root element not found');
  }
});

// Test API connectivity
setTimeout(async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('🔗 Testing API URL:', apiUrl);
    
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
}, 2000);
