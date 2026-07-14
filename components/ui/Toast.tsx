'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      {message}
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  return { message, showToast };
}
