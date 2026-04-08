// Console debugging script to identify React rendering issues
console.log('=== CONSOLE DEBUGGING ===');

// Override console methods to capture all logs
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
  originalLog.apply(console, ['🔍', ...args]);
};

console.error = function(...args) {
  originalError.apply(console, ['❌', ...args]);
};

console.warn = function(...args) {
  originalWarn.apply(console, ['⚠️', ...args]);
};

// Monitor DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          console.log('🆕 New element added:', node.tagName, node.className);
        }
      });
    }
  });
});

// Start observing the root element
setTimeout(() => {
  const root = document.getElementById('root');
  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true
    });
    console.log('👀 Started observing DOM changes');
  }
}, 1000);

// Check for React DevTools
setTimeout(() => {
  const hasReactDevTools = !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  console.log('🛠️ React DevTools available:', hasReactDevTools);
  
  // Check for React app
  const reactRoot = document.querySelector('[data-reactroot]');
  if (reactRoot) {
    console.log('✅ React root detected');
  } else {
    console.log('❌ React root not detected');
  }
}, 2000);

console.log('✅ Console debugging script loaded');
