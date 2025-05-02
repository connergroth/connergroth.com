import { useToast } from '../../hooks/use-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-3 w-full max-w-sm">
      {toasts.map((toast, index) => (
        <div 
          key={index}
          className={`
            p-4 rounded-xl shadow-lg backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 
            animate-slide-up hover:translate-y-0 hover:shadow-xl
            ${toast.variant === 'destructive' ? 'bg-red-500/90 text-white border border-red-600/30' : 
              toast.variant === 'success' ? 'bg-green-500/90 text-white border border-green-600/30' : 
              'bg-card/90 border border-[hsl(var(--border))]'}
          `}
        >
          <div className="mt-0.5">
            {toast.variant === 'destructive' ? (
              <AlertCircle className="w-5 h-5" />
            ) : toast.variant === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-[15px] leading-tight mb-1">{toast.title}</h3>
            {toast.description && (
              <p className="text-sm opacity-90 leading-snug">{toast.description}</p>
            )}
          </div>
          <button 
            onClick={() => dismiss(toast)}
            className="opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
} 