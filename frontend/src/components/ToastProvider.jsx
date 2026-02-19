import { Toaster } from 'react-hot-toast';

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#ffffff',
            border: '2px solid #FF6B00',
            borderRadius: '0.75rem',
            padding: '16px',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#1a1a2e',
            },
            style: {
              border: '2px solid #00ff88',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff006e',
              secondary: '#1a1a2e',
            },
            style: {
              border: '2px solid #ff006e',
            },
          },
          loading: {
            iconTheme: {
              primary: '#FF6B00',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
    </>
  );
}
