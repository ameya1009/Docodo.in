"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wrench, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'My Tools', icon: Wrench, href: '/dashboard/tools' },
  { name: 'Credits', icon: Zap, href: '/dashboard/credits' },
  { name: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
];

const secondaryItems = [
  { name: 'Support', icon: HelpCircle, href: '/dashboard/support' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <aside className="w-64 bg-bg-surface border-r border-white/5 flex flex-col h-full">
      {/* Logo */}
      <div className="p-8">
        <Link href="/" className="font-display font-black text-2xl tracking-tighter text-white">
          DOCODO<span className="text-lime">.</span>
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              pathname === item.href
                ? "bg-lime text-bg-deep"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Secondary Menu */}
      <div className="px-4 py-4 space-y-1 border-t border-white/5">
        {secondaryItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5",
              pathname === item.href && "text-white bg-white/5"
            )}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Credits Glance */}
      <div className="p-4">
        <div className="bg-bg-elevated rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
            <span>Credits</span>
            <span className="text-white">38/50</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="w-[76%] h-full bg-lime" />
          </div>
          <button className="w-full mt-3 text-[10px] font-black uppercase tracking-widest text-lime hover:text-lime-glow transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
};
