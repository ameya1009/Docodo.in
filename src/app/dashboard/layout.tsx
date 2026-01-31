'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const nav = [
        { icon: <LayoutDashboard size={22} />, label: 'Overview', href: '/dashboard' },
        { icon: <FileText size={22} />, label: 'Projects', href: '/dashboard/projects' },
        { icon: <Users size={22} />, label: 'Team', href: '/dashboard/team' },
        { icon: <Settings size={22} />, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="flex h-screen bg-[#050510] text-zinc-100 overflow-hidden relative">

            {/* Sidebar */}
            <aside
                className={`relative z-20 font-medium transition-all duration-300 ease-in-out border-r border-white/10 backdrop-blur-md bg-black/20 flex flex-col ${isSidebarOpen ? 'w-72' : 'w-20'}`}
            >
                <div className="h-24 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(34,211,238,0.5)]">D</div>
                        {isSidebarOpen && <span className="font-bold text-2xl tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Docodo.</span>}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {nav.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative mb-1 overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-300 font-medium border border-cyan-500/20'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5 hover:pl-5 hover:border hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />}
                                <span className={`${isActive ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'group-hover:text-white transition-colors duration-300'}`}>{item.icon}</span>
                                {isSidebarOpen && <span className="text-sm tracking-wide">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button variant="ghost" className="w-full justify-start gap-4 text-red-400 hover:text-red-300 hover:bg-red-950/30 h-12 rounded-xl hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all">
                        <LogOut size={22} />
                        {isSidebarOpen && "Sign Out"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                <header className="h-24 px-8 flex items-center justify-between border-b border-white/10 bg-transparent backdrop-blur-sm">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-white drop-shadow-md">Ameya Kshirsagar</p>
                            <p className="text-xs text-cyan-400 font-medium tracking-wide drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">PREMIUM PLAN</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 p-[2px] shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-bold text-white">AK</div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 lg:p-12 scrollbar-thin scrollbar-thumb-zinc-800">
                    {children}
                </main>
            </div>
        </div>
    );
}
