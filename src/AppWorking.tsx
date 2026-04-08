import React, { useState, useEffect } from 'react';

export default function AppWorking() {
  const [logs, setLogs] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('Testing...');

  useEffect(() => {
    // Test basic React rendering
    const testElement = document.createElement('div');
    testElement.innerHTML = '✅ React Working!';
    testElement.style.color = 'green';
    testElement.style.padding = '10px';
    
    const root = document.getElementById('root');
    if (root) {
      root.appendChild(testElement);
      
      setTimeout(() => {
        const content = root.innerHTML;
        if (content.includes('React Working')) {
          setLogs(prev => [...prev, '✅ React rendering working']);
          setApiStatus('✅ React is rendering');
        } else {
          setLogs(prev => [...prev, '❌ React rendering failed']);
          setApiStatus('❌ React not rendering');
        }
      }, 1000);
    }
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🏋 Sport Gym Management App
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '15px' }}>
          ✅ Application Status
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>🎯 React Status:</strong> {apiStatus}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>📊 Rendering Logs:</strong>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{ 
              fontSize: '12px', 
              color: '#666',
              marginBottom: '5px',
              padding: '5px',
              backgroundColor: '#fff',
              borderRadius: '3px'
            }}>
              {log}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 Reload Application
          </button>
        </div>
      </div>
    </div>
  );
}
