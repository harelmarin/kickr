import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/app';
import './index.css';
import { ToastProvider } from './components/ui/toastprovider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
