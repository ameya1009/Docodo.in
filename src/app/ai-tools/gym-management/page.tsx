'use client';

import { useState } from 'react';
import { AIToolsLayout } from '@/components/layout/AIToolsLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import { Search, Plus, User, Activity, Users, AlertCircle, ArrowUpRight, Filter, MoreHorizontal } from 'lucide-react';

interface Member {
    id: string;
    name: string;
    plan: 'Basic' | 'Pro' | 'Elite';
    status: 'Active' | 'Expiring' | 'Inactive';
    joinDate: string;
    expiryDate: string;
    lastCheckIn: string;
}

const MOCK_MEMBERS: Member[] = [
    {
        id: '1',
        name: 'Dwayne Johnson',
        plan: 'Elite',
        status: 'Active',
        joinDate: '2023-01-15',
        expiryDate: '2025-01-15',
        lastCheckIn: 'Today, 6:00 AM'
    },
    {
        id: '2',
        name: 'Chris Evans',
        plan: 'Pro',
        status: 'Expiring',
        joinDate: '2023-06-01',
        expiryDate: '2024-06-01',
        lastCheckIn: 'Yesterday, 5:30 PM'
    },
    {
        id: '3',
        name: 'Tom Holland',
        plan: 'Basic',
        status: 'Inactive',
        joinDate: '2023-03-10',
        expiryDate: '2023-09-10',
        lastCheckIn: '2023-08-20'
    }
];

export default function GymManagementPage() {
    const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', plan: 'Basic', duration: '1' });

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        active: members.filter(m => m.status === 'Active').length,
        expiring: members.filter(m => m.status === 'Expiring').length,
        total: members.length
    };

    const handleAddMember = () => {
        if (!newMember.name) return;

        const joinDate = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(newMember.duration));

        const member: Member = {
            id: Date.now().toString(),
            name: newMember.name,
            plan: newMember.plan as any,
            status: 'Active',
            joinDate: joinDate.toISOString().split('T')[0],
            expiryDate: expiryDate.toISOString().split('T')[0],
            lastCheckIn: 'Just now'
        };

        setMembers([member, ...members]);
        setNewMember({ name: '', plan: 'Basic', duration: '1' });
        setIsAddMemberOpen(false);
    };

    const toggleStatus = (id: string) => {
        setMembers(members.map(m => {
            if (m.id === id) {
                return {
                    ...m,
                    status: m.status === 'Active' ? 'Inactive' : 'Active'
                };
            }
            return m;
        }));
    };

    return (
        <AIToolsLayout title="FitFlow Manager">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">FitFlow Manager</h1>
                        <p className="text-zinc-500 text-sm">Automate facility operations and member growth with agents assistance.</p>
                    </div>

                    <Button className="rounded-xl h-10 shadow-lg shadow-primary/10" onClick={() => setIsAddMemberOpen(true)}>
                        <Plus size={18} className="mr-2" /> Register Member
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                <Activity size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.active}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Active Members</div>
                            </div>
                        </div>
                        <ArrowUpRight size={20} className="text-zinc-700 group-hover:text-green-500 transition-colors" />
                    </Card>

                    <Card className="p-6 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.expiring}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Expiring Soon</div>
                            </div>
                        </div>
                        <ArrowUpRight size={20} className="text-zinc-700 group-hover:text-yellow-500 transition-colors" />
                    </Card>

                    <Card className="p-6 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stats.total}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Database</div>
                            </div>
                        </div>
                        <ArrowUpRight size={20} className="text-zinc-700 group-hover:text-primary transition-colors" />
                    </Card>
                </div>

                {/* Search & Navigation */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find members by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 text-sm hover:text-white transition-all">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                <div className="grid gap-3">
                    {filteredMembers.map((member) => (
                        <Card key={member.id} className="p-4 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all flex flex-col md:flex-row items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${member.plan === 'Elite' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                    member.plan === 'Pro' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                    }`}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{member.name}</h3>
                                    <div className="flex items-center gap-2 text-[10px] mt-1">
                                        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${member.plan === 'Elite' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                                            member.plan === 'Pro' ? 'border-blue-500/30 text-blue-500 bg-blue-500/5' : 'border-zinc-700 text-zinc-500 bg-zinc-800'
                                            }`}>{member.plan} Plan</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-zinc-500 font-medium lowercase">Renews: {member.expiryDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5 font-bold">Latest Check-in</div>
                                    <div className="text-xs font-semibold text-zinc-400 flex items-center justify-end gap-1.5 lowercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        {member.lastCheckIn}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleStatus(member.id)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${member.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20' :
                                        member.status === 'Expiring' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                            'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20'
                                        }`}
                                >
                                    {member.status}
                                </button>

                                <button className="p-2.5 rounded-xl bg-zinc-800 text-zinc-500 hover:text-white transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                title="Register New Member"
            >
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Member Name</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="e.g. Dwayne Johnson"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Membership Tier</label>
                            <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                                value={newMember.plan}
                                onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
                            >
                                <option value="Basic">Basic Access</option>
                                <option value="Pro">Pro Access</option>
                                <option value="Elite">Elite Access</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Contract Period</label>
                            <select
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all"
                                value={newMember.duration}
                                onChange={(e) => setNewMember({ ...newMember, duration: e.target.value })}
                            >
                                <option value="1">1 Month</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">Full Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subscription Total</span>
                            <span className="text-2xl font-bold text-primary">
                                ${(
                                    (newMember.plan === 'Basic' ? 29 : newMember.plan === 'Pro' ? 59 : 99) *
                                    parseInt(newMember.duration)
                                )}
                            </span>
                        </div>
                        <div className="text-[10px] text-zinc-600 font-medium text-right lowercase italic">
                            all taxes & processing fees included
                        </div>
                    </div>

                    <Button className="w-full h-12 rounded-xl mt-2 shadow-lg shadow-primary/20" onClick={handleAddMember}>
                        Analyze & Confirm Registration
                    </Button>
                </div>
            </Modal>
        </AIToolsLayout>
    );
}
