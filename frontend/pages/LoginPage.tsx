import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJCS } from '../services/JCSContext';
import { Lock, ShieldCheck, Building2, Globe, AlertCircle, X, Loader2, Mail } from 'lucide-react';
import { api } from '../services/api';

const LoginPage = () => {
    console.log('🏠 LoginPage component rendering...');
    const { login: contextLogin, isLoading, currentUser } = useJCS();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    // Login Logic
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        // Simulate network delay for animation
        setTimeout(async () => {
            try {
                const user = await api.login({ email, password });
                contextLogin(user);
            } catch (err: any) {
                console.error("Login failed", err);
                setError(err.message || 'Invalid credentials. Please try again.');
                setIsLoggingIn(false);
            }
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 font-sans selection:bg-brand-500/30">
            {/* Login Loading Overlay */}
            {isLoggingIn && (
                <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in text-white">
                    <Loader2 size={64} className="text-brand-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold animate-pulse">Logging In...</h2>
                    <p className="text-slate-400 mt-2">Connecting to dashboard</p>
                </div>
            )}


            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 animate-fade-in relative">

                {/* Left Side: Brand & Visuals */}
                <div className="md:w-1/2 bg-slate-900 relative flex flex-col justify-between p-8 md:p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/20 mb-6">
                            J
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                            JCS Sustainability <br /> <span className="text-brand-400">Dashboard</span>
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
                            Tracking, evaluating, and celebrating sustainability initiatives across the university.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 space-y-4">
                        <div className="flex items-center space-x-3 text-sm text-slate-300">
                            <div className="p-2 bg-slate-800 rounded-lg"><ShieldCheck size={18} className="text-brand-400" /></div>
                            <span>Secure Admin Portal</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-slate-300">
                            <div className="p-2 bg-slate-800 rounded-lg"><Building2 size={18} className="text-blue-400" /></div>
                            <span>Department Events Management</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-slate-300">
                            <div className="p-2 bg-slate-800 rounded-lg"><Globe size={18} className="text-green-400" /></div>
                            <span>Public Transparency</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center relative">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                            <p className="text-slate-500 mt-1">Please login to access your account.</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                            title="Cancel and return to Main Page"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* LOGIN FORM */}
                    <form onSubmit={handleLogin} className="space-y-5 animate-slide-in-right">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-black group-focus-within:text-brand-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-black placeholder-black"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-semibold text-slate-900">Password</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm animate-scale-in">
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
                                'Login to Dashboard'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="fixed bottom-4 right-4 text-xs text-slate-400 font-medium">
                JCS Sustainability Portal v1.0
            </div>
        </div>
    );
};

export default LoginPage;
