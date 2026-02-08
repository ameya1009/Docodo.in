'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';
import { Search, Plus, User, Calendar, CreditCard, Activity, TrendingUp, Users, AlertCircle } from 'lucide-react';

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
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <section className="pt-32 pb-20 container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                            Facility Management
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            FitFlow <span className="text-primary">Manager</span>
                        </h1>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <Button onClick={() => setIsAddMemberOpen(true)}>
                            <Plus size={18} className="mr-2" /> New Member
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="p-6 border-zinc-800 bg-zinc-900/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.active}</div>
                            <div className="text-sm text-zinc-400">Active Members</div>
                        </div>
                    </Card>
                    <Card className="p-6 border-zinc-800 bg-zinc-900/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.expiring}</div>
                            <div className="text-sm text-zinc-400">Expiring Soon</div>
                        </div>
                    </Card>
                    <Card className="p-6 border-zinc-800 bg-zinc-900/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-sm text-zinc-400">Total Members</div>
                        </div>
                    </Card>
                </div>

                {/* Search & List */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                <div className="grid gap-4">
                    {filteredMembers.map((member) => (
                        <Card key={member.id} className="p-4 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${member.plan === 'Elite' ? 'bg-amber-500/10 text-amber-500' :
                                        member.plan === 'Pro' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-400'
                                    }`}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${member.plan === 'Elite' ? 'border-amber-500/30 text-amber-500' :
                                                member.plan === 'Pro' ? 'border-blue-500/30 text-blue-500' : 'border-zinc-700 text-zinc-400'
                                            }`}>{member.plan} Plan</span>
                                        <span>•</span>
                                        <span>Expires: {member.expiryDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-zinc-500 mb-1">Last Check-in</div>
                                    <div className="text-sm font-medium flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                                        {member.lastCheckIn}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleStatus(member.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${member.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20' :
                                            member.status === 'Expiring' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-green-500/10 hover:text-green-500'
                                        }`}
                                >
                                    {member.status}
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <Footer />

            <Modal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                title="Register New Member"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Member Name</label>
                        <input
                            type="text"
                            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">Membership Plan</label>
                            <select
                                className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                                value={newMember.plan}
                                onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
                            >
                                <option value="Basic">Basic</option>
                                <option value="Pro">Pro</option>
                                <option value="Elite">Elite</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-400 mb-1">Duration (Months)</label>
                            <select
                                className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-white focus:border-primary focus:outline-none"
                                value={newMember.duration}
                                onChange={(e) => setNewMember({ ...newMember, duration: e.target.value })}
                            >
                                <option value="1">1 Month</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">1 Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-zinc-400">Total Due</span>
                            <span className="text-xl font-bold text-primary">
                                ${(
                                    (newMember.plan === 'Basic' ? 29 : newMember.plan === 'Pro' ? 59 : 99) *
                                    parseInt(newMember.duration)
                                )}
                            </span>
                        </div>
                        <div className="text-xs text-zinc-500 text-right">
                            Includes taxes & fees
                        </div>
                    </div>

                    <Button className="w-full mt-2" onClick={handleAddMember}>
                        Confirm Registration
                    </Button>
                </div>
            </Modal>
        </main>
    );
}
