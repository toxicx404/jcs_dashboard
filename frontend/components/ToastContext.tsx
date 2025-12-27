import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`
                flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border pointer-events-auto
                min-w-[300px] max-w-sm animate-slide-in-right transition-all duration-300 transform
                ${toast.type === 'success' ? 'bg-white border-green-200 dark:bg-slate-800 dark:border-green-900' : ''}
                ${toast.type === 'error' ? 'bg-white border-red-200 dark:bg-slate-800 dark:border-red-900' : ''}
                ${toast.type === 'info' ? 'bg-white border-blue-200 dark:bg-slate-800 dark:border-blue-900' : ''}
                ${toast.type === 'warning' ? 'bg-white border-yellow-200 dark:bg-slate-800 dark:border-yellow-900' : ''}
              `}
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                                {toast.type === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                                {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                                {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
                                {toast.type === 'warning' && <AlertTriangle size={20} className="text-yellow-500" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h4 className={`
                  text-sm font-bold capitalize mb-0.5
                  ${toast.type === 'success' ? 'text-green-700 dark:text-green-400' : ''}
                  ${toast.type === 'error' ? 'text-red-700 dark:text-red-400' : ''}
                  ${toast.type === 'info' ? 'text-blue-700 dark:text-blue-400' : ''}
                  ${toast.type === 'warning' ? 'text-yellow-700 dark:text-yellow-400' : ''}
                `}>
                                    {toast.type}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                                    {toast.message}
                                </p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
