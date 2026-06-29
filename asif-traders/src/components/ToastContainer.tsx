'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, hideToast } = useToast();

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    info: <Info className="w-5 h-5 text-steel" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber" />,
  };

  const bgColors = {
    success: 'bg-success/10 border-success/30',
    error: 'bg-error/10 border-error/30',
    info: 'bg-steel/10 border-steel/30',
    warning: 'bg-amber/10 border-amber/30',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <span className="font-medium text-charcoal">{toast.message}</span>
          <button
            onClick={() => hideToast(toast.id)}
            className="ml-2 p-1 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      ))}
    </div>
  );
}
