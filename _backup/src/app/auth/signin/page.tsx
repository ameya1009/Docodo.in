'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, LogIn, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: true,
                email,
                password,
                callbackUrl: '/dashboard'
            });

            if (res?.error) {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-zinc-900/50 backdrop-blur-3xl border border-zinc-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    {/* Glowing Accent */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-cyan-400 to-blue-600 mx-auto mb-6 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
                            <Brain size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
                        <p className="text-zinc-500 font-medium">Access your AI growth OS</p>
                    </div>

                    <div className="space-y-6">
                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl font-bold tracking-tight text-base shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                        >
                            <Chrome className="w-5 h-5" />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-zinc-900/50 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center text-[12px]">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="founder@startup.com"
                                        className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-zinc-700"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-zinc-700"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-14 rounded-2xl font-bold tracking-tight shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-xs text-zinc-600 font-medium">
                        By continuing, you agree to Docodo's Terms of Service and Privacy Policy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
