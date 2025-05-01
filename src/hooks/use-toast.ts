import { useState } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props));
    }, 5000);
  };

  const dismiss = (toast: ToastProps) => {
    setToasts((prev) => prev.filter((t) => t !== toast));
  };

  return {
    toast,
    toasts,
    dismiss,
  };
} 