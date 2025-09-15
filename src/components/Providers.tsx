'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
        }}
      />
    </SessionProvider>
  );
}