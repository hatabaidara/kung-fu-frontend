// Test to identify why React is not rendering
console.log('=== REACT LOADING DIAGNOSIS ===');

// Test 1: Check if React is actually loading
setTimeout(() => {
  const root = document.getElementById('root');
  if (root) {
    const content = root.innerHTML;
    console.log('📊 Root content length:', content.length);
    console.log('📄 Content preview:', content.substring(0, 200));
    
    // Check if React is actually initializing
    const hasReactContent = content.includes('react') || 
                           content.includes('React') || 
                           content.includes('data-') ||
                           content.length > 1000;
    
    if (hasReactContent) {
      console.log('✅ React content detected');
    } else {
      console.log('❌ React content NOT detected');
      
      // Check for errors
      if (content.includes('error') || content.includes('Error')) {
        console.log('❌ Error content detected');
      } else {
        console.log('⚠️  React content appears to be empty or minimal');
      }
    }
    
    // Test 2: Try to manually create a React element
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '<h1>Manual React Test</h1>';
    testDiv.style.color = 'blue';
    
    if (root.appendChild(testDiv)) {
      console.log('✅ Manual DOM manipulation works');
      
      // Remove it after 2 seconds
      setTimeout(() => {
        if (root.contains(testDiv)) {
          root.removeChild(testDiv);
          console.log('✅ Manual element removed');
        } else {
          console.log('❌ Manual element not found for removal');
        }
      }, 2000);
    } else {
      console.log('❌ Manual DOM manipulation failed');
    }
    
  } else {
    console.log('❌ Root element not found');
  }
}, 1000);

// Test 3: Check if JavaScript modules are loading
setTimeout(() => {
  console.log('🔍 Checking JavaScript modules...');
  
  // Check for common React patterns
  const scripts = document.querySelectorAll('script');
  console.log('📜 Scripts found:', scripts.length);
  
  scripts.forEach((script, index) => {
    if (script.src) {
      console.log(`📦 Script ${index}: ${script.src}`);
    }
  });
  
  // Check for React DevTools
  const hasReactDevTools = !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  console.log('🛠️ React DevTools:', hasReactDevTools);
  
  // Check for React errors
  if (window._reactInternalInstance) {
    console.log('✅ React internal instance found');
  } else {
    console.log('❌ React internal instance NOT found');
  }
}, 2000);

// Test 4: Check network requests
setTimeout(async () => {
  try {
    console.log('🌐 Testing network request...');
    
    const response = await fetch('https://kung-fu-frontend.vercel.app');
    console.log('📊 Network response status:', response.status);
    console.log('📊 Network response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const text = await response.text();
      console.log('📄 Response length:', text.length);
      console.log('📄 Response preview:', text.substring(0, 500));
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}, 3000);

console.log('✅ React loading diagnosis script loaded');
