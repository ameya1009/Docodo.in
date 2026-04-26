"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Zap,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

const stats = [
  { name: 'Total Credits', value: '50', change: 'Free Tier', icon: Zap, color: 'text-lime' },
  { name: 'Bot Sessions', value: '12', change: '+3 today', icon: MessageSquare, color: 'text-blue-400' },
  { name: 'New Leads', value: '4', change: '+1 today', icon: Users, color: 'text-purple-400' },
  { name: 'ROI Estimate', value: '₹2,500', change: 'Potential', icon: TrendingUp, color: 'text-green-400' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-white">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Track your growth and manage your AI engines.</p>
        </div>
        <NeonButton variant="primary" className="flex items-center gap-2">
          <Plus size={18} /> New Tool Session
        </NeonButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">{stat.value}</h3>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            Recent Tool Activity
          </h2>
          <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest font-black text-gray-500">
                    <th className="px-6 py-4">Tool</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { tool: 'WhatsApp Simulator', date: 'Today, 2:45 PM', status: 'Completed', credits: '1' },
                    { tool: 'Content Repurposer', date: 'Yesterday, 11:20 AM', status: 'Completed', credits: '10' },
                    { tool: 'Growth Audit', date: 'April 24, 6:30 PM', status: 'Pending', credits: '25' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{row.tool}</td>
                      <td className="px-6 py-4 text-gray-500">{row.date}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                          row.status === 'Completed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">-{row.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center">
              <button className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 mx-auto">
                View All History <ArrowUpRight size={14} />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Upgrade Card */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold text-white">Recommended for You</h2>
          <GlassCard className="p-8 bg-lime/5 border-lime/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-lime text-bg-deep flex items-center justify-center mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2">Growth Plan</h3>
              <p className="text-gray-400 text-sm mb-8">
                Unlock unlimited AI messages and 4 social media posts per month.
              </p>
              <NeonButton variant="primary" className="w-full">
                Upgrade Now
              </NeonButton>
            </div>
            <Crown className="absolute -bottom-4 -right-4 text-lime/10 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </GlassCard>
          
          <GlassCard className="p-6 border-dashed border-white/10">
            <h4 className="text-sm font-bold text-white mb-2">Need Help?</h4>
            <p className="text-xs text-gray-500 mb-4">Our experts are available on WhatsApp to help you set up your bot.</p>
            <button className="text-xs text-lime font-bold hover:underline">Chat with Support →</button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
