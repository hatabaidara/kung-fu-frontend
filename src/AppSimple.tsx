import React from 'react';

export default function AppSimple() {
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
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '15px' }}>
          ✅ Application Status
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Frontend:</strong> React + TypeScript + Vite
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Backend:</strong> Node.js + Express + TiDB
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Deployment:</strong> Vercel + Render
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status:</strong> <span style={{ color: '#28a745' }}>✅ Working</span>
        </div>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <h3 style={{ color: '#495057', marginBottom: '10px' }}>
            🌐 API Connection Test
          </h3>
          
          <div id="api-test-result" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
            Testing API connectivity...
          </div>
          
          <button 
            onClick={() => testAPIConnection()}
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
            🔄 Test Backend Connection
          </button>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p><strong>📱 Open browser console</strong> to see detailed logs</p>
          <p><strong>🔍 Check Network tab</strong> for API requests</p>
          <p><strong>⚡ Current URL:</strong> https://kung-fu-frontend.vercel.app</p>
        </div>
      </div>
    </div>
  );
}

// Test API connection
async function testAPIConnection() {
  const resultDiv = document.getElementById('api-test-result');
  if (!resultDiv) return;  
  try {
    resultDiv.innerHTML = '🔄 Testing API connection...';
    
    const apiUrl = 'https://kung-fu-backend.onrender.com/api';
    console.log('🔗 Testing API URL:', apiUrl);
    
    const response = await fetch(`${apiUrl}/health`);
    
    if (response.ok) {
      const data = await response.json();
      resultDiv.innerHTML = `
        <div style="color: #28a745; font-weight: bold;">
          ✅ API Connection Successful!
        </div>
        <div style="margin-top: 10px; font-size: 12px;">
          <strong>Status:</strong> ${data.status}<br>
          <strong>Timestamp:</strong> ${data.timestamp}<br>
          <strong>Environment:</strong> ${data.environment}
        </div>
      `;
      console.log('✅ API Response:', data);
    } else {
      resultDiv.innerHTML = `
        <div style="color: #dc3545; font-weight: bold;">
          ❌ API Connection Failed
        </div>
        <div style="margin-top: 10px; font-size: 12px;">
          <strong>Status:</strong> ${response.status} ${response.statusText}<br>
          <strong>URL:</strong> ${apiUrl}
        </div>
      `;
      console.log('❌ API Error:', response.status, response.statusText);
    }
  } catch (error) {
    resultDiv.innerHTML = `
      <div style="color: #dc3545; font-weight: bold;">
        ❌ Connection Error
      </div>
      <div style="margin-top: 10px; font-size: 12px;">
        <strong>Error:</strong> ${(error as Error).message}<br>
        <strong>URL:</strong> ${apiUrl}
      </div>
    `;
    console.log('❌ Connection Error:', (error as Error).message);
  }
}
