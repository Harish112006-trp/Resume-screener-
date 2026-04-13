export default function TestApp() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>G8 AI Screener Test</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f3f4f6', borderRadius: '8px' }}>
        Environment Check: {process.env.GEMINI_API_KEY ? '✅ API Key Found' : '❌ API Key Missing'}
      </div>
    </div>
  );
}
