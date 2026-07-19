import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgb(var(--color-card))',
            color: 'rgb(var(--color-text))',
            border: '1px solid rgb(var(--color-border))',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
