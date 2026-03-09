'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastCtx = createContext(null);

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={add}>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-3 bg-ink-700 border border-ink-500 px-4 py-3 shadow-xl animate-fade-up min-w-[260px]">
            {t.type === 'success' ? <CheckCircle size={16} className="text-gold-400 shrink-0" /> : <XCircle size={16} className="text-red-400 shrink-0" />}
            <span className="text-sm text-ink-50 flex-1">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
