// Basic test to check if React is loading at all
console.log('=== BASIC REACT TEST ===');

// Test 1: Check if React is defined
console.log('React defined:', typeof React !== 'undefined');
console.log('ReactDOM defined:', typeof ReactDOM !== 'undefined');

// Test 2: Try to render something simple
const testElement = document.createElement('div');
testElement.innerHTML = 'React Test Content';
testElement.style.cssText = 'color: red; font-size: 20px; padding: 10px;';

// Test 3: Check if we can access the root
const root = document.getElementById('root');
if (root) {
  console.log('✅ Root element found');
  
  // Add test content
  root.appendChild(testElement);
  console.log('✅ Test content added to root');
  
  // Check if it stays there
  setTimeout(() => {
    const content = root.innerHTML;
    console.log('📊 Root content length:', content.length);
    console.log('📄 Content preview:', content.substring(0, 100));
    
    if (content.includes('React Test Content')) {
      console.log('✅ Basic DOM manipulation works');
    } else {
      console.log('❌ Basic DOM manipulation failed');
    }
  }, 1000);
  
} else {
  console.log('❌ Root element not found');
}

// Test 4: Check API
setTimeout(async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('🔗 API URL from env:', apiUrl);
    
    const response = await fetch(`${apiUrl}/health`);
    if (response.ok) {
      console.log('✅ API connectivity working');
      const data = await response.json();
      console.log('📊 API health response:', data);
    } else {
      console.log('❌ API failed:', response.status);
    }
  } catch (error) {
    console.log('❌ API error:', error.message);
  }
}, 2000);

console.log('✅ Basic test script loaded');
