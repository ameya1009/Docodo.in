import { Card } from '@/components/ui/Card';
import { ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 mb-2">Welcome back, Ameya</h1>
                    <p className="text-zinc-400">Here's what's happening with your projects today.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Current Cycle</p>
                    <p className="text-xl font-medium text-white">Oct 24 - Nov 24</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-all hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                    <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]"><Clock size={24} /></div>
                            <span className="text-sm font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">+12% <ArrowUpRight size={14} /></span>
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Active Projects</h3>
                        <p className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">3</p>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all hover:bg-white/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"><CheckCircle size={24} /></div>
                            <span className="text-xs font-medium text-zinc-400 bg-white/5 px-2 py-1 rounded-md border border-white/10">Last 30 days</span>
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Tasks Completed</h3>
                        <p className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">24</p>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all hover:bg-white/10 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-bold">AI</div>
                            <span className="text-sm font-medium text-cyan-300 flex items-center gap-1 border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(34,211,238,0.2)]">Pro Plan</span>
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Credits Remaining</h3>
                        <p className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">850</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    Recent Activity
                    <span className="text-xs font-medium px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">Live</span>
                </h2>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex justify-between items-center group cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:border-cyan-500/50 group-hover:text-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all">LOG</div>
                                <div>
                                    <p className="font-medium text-zinc-200 group-hover:text-white transition-colors">SEO Audit Report Generated</p>
                                    <p className="text-sm text-zinc-500 mt-0.5 group-hover:text-zinc-400 transition-colors">Automated Task • 2 hours ago</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-zinc-300 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                                View Details
                            </button>
                        </div>
                    ))}
                    <div className="p-4 bg-black/20 text-center border-t border-white/5">
                        <button className="text-sm text-zinc-400 hover:text-white transition-colors font-medium hover:tracking-wide duration-300">View All Activity</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
