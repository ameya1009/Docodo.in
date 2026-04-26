"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Bell, Search, User as UserIcon } from 'lucide-react';

export const DashboardHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="h-20 border-b border-white/5 bg-bg-deep flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tools or data..."
            className="w-full bg-white/5 border border-white/5 rounded-full pl-12 pr-4 py-2 text-sm text-white focus:border-lime outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-deep" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none mb-1">
              {user?.displayName || 'User'}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
              Free Plan
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center text-lime">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full rounded-full" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
