import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error:", message, source, lineno, colno, error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: #e11d48; font-family: sans-serif;">
      <h2 style="font-weight: bold;">Critical Error</h2>
      <p>${message}</p>
      <pre style="background: #f1f5f9; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto;">${error?.stack || 'No stack trace available'}</pre>
    </div>`;
  }
  return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
