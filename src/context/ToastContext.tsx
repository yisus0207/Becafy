'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        zIndex: 9999, pointerEvents: 'none'
      }}>
        {toasts.map((t) => (
          <div key={t.id} className="glass-v2-heavy animate-slide-up" style={{
            padding: '1rem 1.5rem', borderRadius: '12px',
            minWidth: '300px', display: 'flex', alignItems: 'center', gap: '1rem',
            borderLeft: `4px solid ${t.type === 'error' ? 'var(--diff-hard)' : t.type === 'success' ? 'var(--diff-easy)' : 'var(--accent-primary)'}`,
            pointerEvents: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ color: t.type === 'error' ? 'var(--diff-hard)' : t.type === 'success' ? 'var(--diff-easy)' : 'var(--accent-primary)' }}>
              {t.type === 'error' && <AlertCircle size={20} />}
              {t.type === 'success' && <CheckCircle size={20} />}
              {t.type === 'info' && <Info size={20} />}
              {t.type === 'warning' && <Zap size={20} />}
            </div>
            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{t.message}</div>
            <button onClick={() => removeToast(t.id)} style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
