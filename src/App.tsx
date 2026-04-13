import React, { useState, useEffect } from 'react';

export default function App() {
  console.log("App rendering...");
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
        maxWidth: '450px', 
        width: '100%', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          backgroundColor: '#2563eb', 
          width: '60px', 
          height: '60px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 24px' 
        }}>
          <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
          G8 AI Resume Screener
        </h1>
        
        <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: '1.5' }}>
          The application is initializing. If you see this screen, the core rendering engine is working correctly.
        </p>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
          <div className="pulse-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1.5s infinite' }}></div>
          <div className="pulse-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1.5s infinite 0.2s' }}></div>
          <div className="pulse-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb', animation: 'pulse 1.5s infinite 0.4s' }}></div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Refresh Application
        </button>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
