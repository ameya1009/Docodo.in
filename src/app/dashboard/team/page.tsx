import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function TeamPage() {
    const team = [
        { name: 'Ameya K.', role: 'Admin', email: 'ameya@docodo.in', status: 'Active' },
        { name: 'Sarah J.', role: 'Editor', email: 'sarah@docodo.in', status: 'Active' },
        { name: 'Mike T.', role: 'Viewer', email: 'mike@docodo.in', status: 'Invited' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
                    <p className="text-zinc-400">Manage access and roles for your workspace.</p>
                </div>
                <Button className="bg-white text-black hover:bg-zinc-200">
                    <Plus size={18} className="mr-2" /> Invite Member
                </Button>
            </div>

            <div className="bg-[#0A0A12] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-zinc-400">
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {team.map((member, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400 border border-white/5">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{member.name}</div>
                                            <div className="text-zinc-500 text-xs">{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-zinc-300">{member.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${member.status === 'Active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                        }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-zinc-500 hover:text-white transition-colors">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
