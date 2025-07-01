// components/GlobalToast.tsx
import React, { useEffect, useState } from 'react';
import { ToastService } from '@/utils/ToastService';

export const GlobalToast = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (msg: string) => {
      console.log('Toast handler triggered:', msg);
      setMessage(msg);
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    };
    ToastService.on(handler);
    return () => ToastService.off(handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 24,
        zIndex: 10000,
      }}
    >
      {message}
    </div>
  );
};
