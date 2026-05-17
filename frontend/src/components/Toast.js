import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const success = toast.type === 'success';
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div className="fixed right-4 top-20 z-[60] w-[calc(100vw-2rem)] max-w-sm animate-toastIn">
      <div className={`rounded-lg border bg-white p-4 shadow-2xl shadow-slate-950/20 ${
        success ? 'border-[#f0b6bf]' : 'border-red-200'
      }`}>
        <div className="flex gap-3">
          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
            success ? 'bg-[#fbecee] text-[#B22234]' : 'bg-red-50 text-red-600'
          }`}>
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-950">{toast.title}</p>
            {toast.message && <p className="mt-1 text-sm leading-5 text-slate-500">{toast.message}</p>}
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close notification">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
