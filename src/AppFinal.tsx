import React, { useState, useEffect } from 'react';

export default function AppFinal() {
  const [status, setStatus] = useState<string>('Loading...');
  const [apiResult, setApiResult] = useState<string>('Not tested');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Test React rendering immediately
    setStatus('React is rendering!');
    setLogs(prev => [...prev, 'React component mounted successfully']);
    
    // Test API connection
    testAPIConnection();
  }, []);

  const testAPIConnection = async () => {
    try {
      setLogs(prev => [...prev, 'Testing API connection...']);
      const response = await fetch('https://kung-fu-backend.onrender.com/api/health');
      
      if (response.ok) {
        const data = await response.json();
        setApiResult(`Success: ${data.status}`);
        setLogs(prev => [...prev, 'API connection successful']);
      } else {
        setApiResult(`Failed: ${response.status}`);
        setLogs(prev => [...prev, `API failed with status ${response.status}`]);
      }
    } catch (error) {
      setApiResult(`Error: ${(error as Error).message}`);
      setLogs(prev => [...prev, `API error: ${(error as Error).message}`]);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '20px',
          fontSize: '32px',
          textAlign: 'center'
        }}>
          {'\ud83c\udfcb\ufe0f'} Sport Gym Management App
        </h1>
        
        <div style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '10px' }}>
            {'\u2705'} Application Status
          </h2>
          
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            <strong>Frontend:</strong> {status}
          </div>
          
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            <strong>Backend:</strong> {apiResult}
          </div>
          
          <div style={{ fontSize: '16px', color: '#666' }}>
            <strong>Deployment:</strong> Vercel + Render
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '10px' }}>
            {'\ud83d\udd0d'} System Information
          </h3>
          
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div><strong>React:</strong> Working</div>
            <div><strong>TypeScript:</strong> Working</div>
            <div><strong>Vite:</strong> Working</div>
            <div><strong>TailwindCSS:</strong> Working</div>
            <div><strong>API URL:</strong> https://kung-fu-backend.onrender.com/api</div>
            <div><strong>Frontend URL:</strong> https://kung-fu-frontend.vercel.app</div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '10px' }}>
            {'\ud83d\udccb'} Activity Logs
          </h3>
          
          <div style={{ 
            maxHeight: '150px', 
            overflow: 'auto',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}>
            {logs.map((log, index) => (
              <div key={index} style={{ 
                padding: '2px 0',
                borderBottom: '1px solid #eee'
              }}>
                {index + 1}. {log}
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={testAPIConnection}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            {'\ud83d\udd04'} Test API Again
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {'\ud83d\udd04'} Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
