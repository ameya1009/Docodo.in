"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Mail, Lock, Loader2, User } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-bg-deep relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-lime/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display font-black text-3xl tracking-tighter text-white inline-block mb-6">
            DOCODO<span className="text-lime">.</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-white">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">Start your 14-day free trial. No credit card required.</p>
        </div>

        <GlassCard className="p-8 md:p-10">
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Ameya Patangankar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-lime outline-none transition-all"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-lime outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="Min. 8 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-lime outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <NeonButton type="submit" disabled={loading} className="w-full py-4">
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Free Account →"}
            </NeonButton>
          </form>

          <p className="mt-8 text-[10px] text-gray-500 text-center uppercase tracking-widest leading-relaxed">
            By signing up, you agree to our <br />
            <Link href="/terms" className="text-white hover:underline">Terms</Link> & <Link href="/privacy" className="text-white hover:underline">Privacy Policy</Link>
          </p>
        </GlassCard>

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-lime font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
