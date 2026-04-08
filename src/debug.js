// Debug script to identify JavaScript errors on Vercel
console.log('=== FRONTEND DEBUG VERIFICATION ===');
console.log('Checking for potential JavaScript errors...\n');

// Test 1: Check if React is loading
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('✅ Root element found:', rootElement);
    
    // Check if React is rendering
    const innerHTML = rootElement.innerHTML;
    if (innerHTML && innerHTML.length > 0) {
      console.log('✅ Content is being rendered to root element');
      console.log('📄 Content length:', innerHTML.length);
      
      // Check for error indicators
      if (innerHTML.includes('error') || innerHTML.includes('Error') || innerHTML.includes('failed')) {
        console.log('❌ Potential error content detected in HTML');
      }
    } else {
      console.log('❌ No content rendered to root element');
    }
  } else {
    console.log('❌ Root element not found');
  }
} catch (error) {
  console.log('❌ Error checking React rendering:', error.message);
}

// Test 2: Check API calls
try {
  console.log('\n=== API CALL TEST ===');
  
  // Test if API_BASE_URL is correctly set
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  console.log('🔗 API_BASE_URL:', apiBaseUrl);
  
  if (apiBaseUrl) {
    // Test API call
    fetch(`${apiBaseUrl}/health`)
      .then(response => {
        console.log('✅ API call successful:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('✅ API response:', data);
      })
      .catch(error => {
        console.log('❌ API call failed:', error.message);
      });
  } else {
    console.log('❌ API_BASE_URL not set');
  }
} catch (error) {
  console.log('❌ Error testing API calls:', error.message);
}

// Test 3: Check for console errors
console.log('\n=== CONSOLE ERROR MONITORING ===');
console.log('Monitoring for JavaScript errors...');

// Override console.error to catch errors
const originalConsoleError = console.error;
console.error = function(...args) {
  console.log('❌ JAVASCRIPT ERROR DETECTED:', ...args);
  originalConsoleError.apply(console, args);
};

// Test 4: Check for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.log('❌ UNHANDLED PROMISE REJECTION:', event.reason);
});

// Test 5: Check for network errors
window.addEventListener('error', function(event) {
  console.log('❌ NETWORK ERROR:', event.error);
});

console.log('\n=== DEBUG SUMMARY ===');
console.log('✅ Debug script loaded');
console.log('✅ Error monitoring active');
console.log('✅ API testing enabled');
console.log('✅ React rendering check enabled');
