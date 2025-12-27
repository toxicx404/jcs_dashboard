import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useJCS } from '../services/JCSContext';
import { api } from '../services/api';

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const { login: contextLogin } = useJCS();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const user = await api.login({ email, password });
            contextLogin(user);
            onClose();
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 px-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
            <div className="relative z-10 bg-white dark:bg-card rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Login to access your account.
                    </p>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-900 dark:text-slate-200 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-scale-in">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 flex items-center justify-center"
                    >
                        {isLoggingIn ? (
                            <span className="flex items-center"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Logging in...</span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

            </div>
        </div>,
        document.body
    );
};

export default LoginModal;
