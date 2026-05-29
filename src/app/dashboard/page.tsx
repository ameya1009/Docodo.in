'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Zap, Play, Filter, RefreshCw, Layers, Sparkles, MessageSquare, TrendingUp, Users, Search, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock data representing Pune-focused analytics based on filters
const ANALYTICS_DATA = {
    all: {
        revenue: 68400,
        convRate: 78.5,
        totalLeads: 312,
        seoTraffic: 1420,
        weeklyRevenue: [12000, 18000, 15000, 23400],
        channels: { whatsapp: 65, seo: 20, other: 15 }
    },
    regions: {
        'Baner': {
            revenue: 24500,
            convRate: 82.1,
            totalLeads: 98,
            seoTraffic: 480,
            weeklyRevenue: [4000, 7000, 5500, 8000],
            channels: { whatsapp: 70, seo: 18, other: 12 }
        },
        'Viman Nagar': {
            revenue: 19800,
            convRate: 74.3,
            totalLeads: 84,
            seoTraffic: 390,
            weeklyRevenue: [3500, 5000, 4800, 6500],
            channels: { whatsapp: 60, seo: 22, other: 18 }
        },
        'Hinjewadi': {
            revenue: 12100,
            convRate: 71.8,
            totalLeads: 52,
            seoTraffic: 290,
            weeklyRevenue: [2000, 3000, 3100, 4000],
            channels: { whatsapp: 58, seo: 25, other: 17 }
        },
        'Koregaon Park': {
            revenue: 31000,
            convRate: 84.6,
            totalLeads: 128,
            seoTraffic: 610,
            weeklyRevenue: [5000, 8500, 7500, 10000],
            channels: { whatsapp: 75, seo: 15, other: 10 }
        },
        'FC Road': {
            revenue: 15900,
            convRate: 79.2,
            totalLeads: 78,
            seoTraffic: 320,
            weeklyRevenue: [2500, 4500, 3900, 5000],
            channels: { whatsapp: 62, seo: 23, other: 15 }
        }
    },
    industries: {
        'Salon': {
            revenue: 28900,
            convRate: 83.2,
            totalLeads: 134,
            seoTraffic: 510,
            weeklyRevenue: [5000, 8000, 6900, 9000]
        },
        'Clinic': {
            revenue: 34200,
            convRate: 76.8,
            totalLeads: 110,
            seoTraffic: 650,
            weeklyRevenue: [6000, 9500, 8200, 10500]
        },
        'Cafe': {
            revenue: 18400,
            convRate: 81.5,
            totalLeads: 92,
            seoTraffic: 420,
            weeklyRevenue: [3000, 5200, 4200, 6000]
        },
        'Gym': {
            revenue: 14500,
            convRate: 71.2,
            totalLeads: 62,
            seoTraffic: 280,
            weeklyRevenue: [2500, 4000, 3500, 4500]
        }
    }
};

const LIVE_LOGS = [
    { text: "WhatsApp Bot booked hair spa slot for Priya S. (Baner)", time: "Just now", type: "success" },
    { text: "AI Growth Grader completed for 'Hinjewadi Skin Clinic'", time: "2m ago", type: "info" },
    { text: "SEO Schema crawled successfully by Googlebot Desktop", time: "8m ago", type: "success" },
    { text: "Outreach Agent triggered 48 WhatsApp messages via n8n", time: "15m ago", type: "info" },
    { text: "WhatsApp Bot qualified high-ticket lead: Amit R. (Koregaon Park)", time: "24m ago", type: "success" },
    { text: "Weekly PowerBI report exported for Ameya Kshirsagar", time: "1h ago", type: "system" }
];

export default function DashboardPage() {
    const [region, setRegion] = useState<string>('All');
    const [industry, setIndustry] = useState<string>('All');
    const [data, setData] = useState(ANALYTICS_DATA.all);
    const [activeLogs, setActiveLogs] = useState(LIVE_LOGS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Compute metrics based on filters
    useEffect(() => {
        let base = { ...ANALYTICS_DATA.all };

        if (region !== 'All' && industry === 'All') {
            base = { ...base, ...ANALYTICS_DATA.regions[region as keyof typeof ANALYTICS_DATA.regions] };
        } else if (region === 'All' && industry !== 'All') {
            const indData = ANALYTICS_DATA.industries[industry as keyof typeof ANALYTICS_DATA.industries];
            base = {
                ...base,
                revenue: indData.revenue,
                convRate: indData.convRate,
                totalLeads: indData.totalLeads,
                seoTraffic: indData.seoTraffic,
                weeklyRevenue: indData.weeklyRevenue
            };
        } else if (region !== 'All' && industry !== 'All') {
            // Both selected, blend data
            const regData = ANALYTICS_DATA.regions[region as keyof typeof ANALYTICS_DATA.regions];
            const indData = ANALYTICS_DATA.industries[industry as keyof typeof ANALYTICS_DATA.industries];
            
            // Average of the two filters to simulate cross-filtering
            base = {
                ...base,
                revenue: Math.round((regData.revenue + indData.revenue) / 2),
                convRate: parseFloat(((regData.convRate + indData.convRate) / 2).toFixed(1)),
                totalLeads: Math.round((regData.totalLeads + indData.totalLeads) / 2),
                seoTraffic: Math.round((regData.seoTraffic + indData.seoTraffic) / 2),
                weeklyRevenue: regData.weeklyRevenue.map((val, i) => Math.round((val + indData.weeklyRevenue[i]) / 2))
            };
        }

        setData(base);
    }, [region, industry]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            // Append a random new event log to show live data
            const locs = ['Baner', 'Viman Nagar', 'Koregaon Park', 'FC Road'];
            const names = ['Kunal K.', 'Rohan M.', 'Neha S.', 'Aditi P.'];
            const industriesList = ['Salon', 'Clinic', 'Cafe', 'Gym'];
            const randomLoc = locs[Math.floor(Math.random() * locs.length)];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomInd = industriesList[Math.floor(Math.random() * industriesList.length)];
            
            const newLog = {
                text: `WhatsApp Bot qualified customer: ${randomName} (${randomInd} - ${randomLoc})`,
                time: "Just now",
                type: "success"
            };
            setActiveLogs(prev => [newLog, ...prev.slice(0, 5)]);
        }, 800);
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Growth Engine Active</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                        Growth OS <span className="text-gradient">PowerBI Dashboard</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Consolidated analytics of your WhatsApp responders, Local SEO schemas, and booking funnels.
                    </p>
                </div>

                {/* Filters Panel */}
                <div className="flex flex-wrap items-center gap-3 bg-zinc-900/60 p-2 border border-white/5 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 px-3 text-zinc-400 text-xs font-bold">
                        <Filter size={13} className="text-emerald-400" />
                        <span>FILTERS:</span>
                    </div>

                    {/* Region Filter */}
                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                        <option value="All">All Pune Regions</option>
                        <option value="Baner">Baner Branch</option>
                        <option value="Viman Nagar">Viman Nagar Branch</option>
                        <option value="Hinjewadi">Hinjewadi Hub</option>
                        <option value="Koregaon Park">Koregaon Park Studio</option>
                        <option value="FC Road">FC Road Cafe</option>
                    </select>

                    {/* Industry Filter */}
                    <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                    >
                        <option value="All">All Industries</option>
                        <option value="Salon">Salons & Spas</option>
                        <option value="Clinic">Skin Clinics</option>
                        <option value="Cafe">Cafes & Dining</option>
                        <option value="Gym">Gyms & Wellness</option>
                    </select>

                    <button
                        onClick={handleRefresh}
                        className="p-2 hover:bg-white/5 rounded-xl border border-white/5 text-zinc-400 hover:text-white transition-colors active:scale-95 flex items-center justify-center"
                        title="Refresh Analytics"
                    >
                        <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-emerald-400' : ''} />
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-[2rem] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-emerald-500/10 blur-[30px] rounded-full" />
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Extra Revenue</span>
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white">₹{data.revenue.toLocaleString()}</span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                            <ArrowUpRight size={10} className="mr-0.5" /> +28.4%
                        </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-2">Added value this month from Growth OS</p>
                </div>

                {/* Conversion Rate Card */}
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-[2rem] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-sapphire-500/10 blur-[30px] rounded-full" />
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Conv. Rate</span>
                        <div className="p-2 bg-sapphire-500/10 text-sapphire-400 rounded-xl border border-sapphire-500/20">
                            <Activity size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white">{data.convRate}%</span>
                        <span className="text-[10px] text-sapphire-400 font-bold flex items-center">
                            <ArrowUpRight size={10} className="mr-0.5" /> +5.2%
                        </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-2">WhatsApp Chatbot lead qualification</p>
                </div>

                {/* Total Qualified Leads */}
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-[2rem] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-emerald-500/10 blur-[30px] rounded-full" />
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Qualified Leads</span>
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white">{data.totalLeads}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">Leads</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-2">Ready-to-buy bookings verified</p>
                </div>

                {/* Organic Search SEO traffic */}
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-[2rem] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-sapphire-500/10 blur-[30px] rounded-full" />
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Organic Leads</span>
                        <div className="p-2 bg-sapphire-500/10 text-sapphire-400 rounded-xl border border-sapphire-500/20">
                            <Search size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white">+{data.seoTraffic}</span>
                        <span className="text-[10px] text-sapphire-400 font-bold flex items-center">
                            <ArrowUpRight size={10} className="mr-0.5" /> +142%
                        </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-2">Visits driven via automated schema SEO</p>
                </div>
            </div>

            {/* Main Graphs Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Weekly Trend Line (SVG Area Chart) */}
                <div className="lg:col-span-8 bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between h-[360px]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Weekly Revenue Stream</h3>
                            <p className="text-zinc-500 text-xs">Projected vs actual billing from AI channels</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/20">
                            Realtime Data Feed
                        </span>
                    </div>

                    {/* Chart Frame */}
                    <div className="flex-1 w-full h-[200px] relative mt-4">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                            <div className="w-full h-[1px] bg-white" />
                            <div className="w-full h-[1px] bg-white" />
                            <div className="w-full h-[1px] bg-white" />
                            <div className="w-full h-[1px] bg-white" />
                        </div>

                        {/* Interactive SVG Chart */}
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>
                            {/* Area under curve */}
                            <path
                                d={`M 0 200 L 0 ${200 - (data.weeklyRevenue[0] / 25000) * 160} Q 166 ${200 - (data.weeklyRevenue[1] / 25000) * 160} 166 ${200 - (data.weeklyRevenue[1] / 25000) * 160} T 333 ${200 - (data.weeklyRevenue[2] / 25000) * 160} T 500 ${200 - (data.weeklyRevenue[3] / 25000) * 160} L 500 200 Z`}
                                fill="url(#chartGradient)"
                                className="transition-all duration-700 ease-in-out"
                            />
                            {/* Curved trend line */}
                            <path
                                d={`M 0 ${200 - (data.weeklyRevenue[0] / 25000) * 160} Q 166 ${200 - (data.weeklyRevenue[1] / 25000) * 160} 166 ${200 - (data.weeklyRevenue[1] / 25000) * 160} T 333 ${200 - (data.weeklyRevenue[2] / 25000) * 160} T 500 ${200 - (data.weeklyRevenue[3] / 25000) * 160}`}
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="3"
                                className="transition-all duration-700 ease-in-out"
                            />
                            {/* Data points */}
                            <circle cx="0" cy={200 - (data.weeklyRevenue[0] / 25000) * 160} r="5" fill="#10B981" />
                            <circle cx="166" cy={200 - (data.weeklyRevenue[1] / 25000) * 160} r="5" fill="#10B981" />
                            <circle cx="333" cy={200 - (data.weeklyRevenue[2] / 25000) * 160} r="5" fill="#10B981" />
                            <circle cx="500" cy={200 - (data.weeklyRevenue[3] / 25000) * 160} r="5" fill="#10B981" />
                        </svg>
                    </div>

                    {/* Chart Labels */}
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-4">
                        <span>Week 1 (₹{(data.weeklyRevenue[0]).toLocaleString()})</span>
                        <span>Week 2 (₹{(data.weeklyRevenue[1]).toLocaleString()})</span>
                        <span>Week 3 (₹{(data.weeklyRevenue[2]).toLocaleString()})</span>
                        <span>Week 4 (₹{(data.weeklyRevenue[3]).toLocaleString()})</span>
                    </div>
                </div>

                {/* Conversion Funnel Details */}
                <div className="lg:col-span-4 bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between h-[360px]">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">Conversion Funnel</h3>
                        <p className="text-zinc-500 text-xs">WhatsApp bot stateful pipeline performance</p>
                    </div>

                    <div className="space-y-4 my-auto">
                        {/* Step 1 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-zinc-400">1. Leads Captured</span>
                                <span className="text-white">100% ({data.totalLeads})</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full w-full" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-zinc-400">2. Automated Responses</span>
                                <span className="text-white">94%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500/80 rounded-full w-[94%]" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-zinc-400">3. Booking Link Click</span>
                                <span className="text-white">82%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-sapphire-500/80 rounded-full w-[82%]" />
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-zinc-400">4. Final Booking Confirmed</span>
                                <span className="text-white">{data.convRate}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-sapphire-500 rounded-full" style={{ width: `${data.convRate}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-bold border-t border-white/5 pt-3">
                        ⚡ Industry benchmark for standard forms is only 15%
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Agents Status */}
                <div className="lg:col-span-6 bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] space-y-6">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Active AI Agents</h3>
                        <p className="text-zinc-500 text-xs">Autonomous workflows running on your domain</p>
                    </div>

                    <div className="space-y-4">
                        {/* Agent 1 */}
                        <div className="p-4 bg-white/5 border border-white/5 hover:border-emerald-500/20 rounded-2xl flex justify-between items-center transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">WhatsApp Booking Assistant</h4>
                                    <p className="text-[10px] text-zinc-500">Qualifies leads and books slots in Pune Hinglish</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg border border-emerald-500/30">
                                ONLINE
                            </span>
                        </div>

                        {/* Agent 2 */}
                        <div className="p-4 bg-white/5 border border-white/5 hover:border-sapphire-500/20 rounded-2xl flex justify-between items-center transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sapphire-500/10 border border-sapphire-500/20 rounded-xl flex items-center justify-center text-sapphire-400">
                                    <Search size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Local Schema Google Booster</h4>
                                    <p className="text-[10px] text-zinc-500">Updates structured JSON-LD graphs nightly</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg border border-emerald-500/30">
                                ONLINE
                            </span>
                        </div>

                        {/* Agent 3 */}
                        <div className="p-4 bg-white/5 border border-white/5 hover:border-emerald-500/20 rounded-2xl flex justify-between items-center transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">n8n Lead Generator Pipeline</h4>
                                    <p className="text-[10px] text-zinc-500">Scrapes cold maps listings and initiates outreach</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-black rounded-lg border border-white/5">
                                STANDBY
                            </span>
                        </div>
                    </div>
                </div>

                {/* Live Event Log */}
                <div className="lg:col-span-6 bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Live Agent Activity Log</h3>
                        <div className="space-y-4">
                            {activeLogs.map((log, i) => (
                                <div key={i} className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                                    <div className="flex items-start gap-2.5 pr-4">
                                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                            log.type === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 
                                            log.type === 'info' ? 'bg-sapphire-400 shadow-[0_0_8px_#3b82f6]' : 
                                            'bg-zinc-500'
                                        }`} />
                                        <p className="text-zinc-300 font-medium leading-relaxed">{log.text}</p>
                                    </div>
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase shrink-0 whitespace-nowrap">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="w-full mt-6 border-white/10 hover:border-emerald-500/30 text-zinc-400 hover:text-white bg-white/5 hover:bg-emerald-500/5 text-[10px] font-black uppercase tracking-widest h-12 rounded-xl"
                    >
                        Poll Live Activity Stream
                    </Button>
                </div>
            </div>
        </div>
    );
}
