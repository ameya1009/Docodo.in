import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Search, Filter, MoreHorizontal, Calendar, ArrowUpRight } from 'lucide-react';

export default function ProjectsPage() {
    const projects = [
        { name: 'Neon Fintech Rebrand', client: 'Neon Inc.', status: 'In Progress', progress: 65, due: 'Oct 30', type: 'Design' },
        { name: 'Aura Website', client: 'Aura Wellness', status: 'Review', progress: 90, due: 'Oct 25', type: 'Development' },
        { name: 'Nexus AI Campaign', client: 'Nexus Tech', status: 'Planning', progress: 15, due: 'Nov 12', type: 'Marketing' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-zinc-400">Manage and track your active campaigns.</p>
                </div>
                <Button className="bg-white text-black hover:bg-zinc-200">
                    <Plus size={18} className="mr-2" /> New Project
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-[#0A0A12] p-2 rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full bg-transparent border-none focus:ring-0 pl-10 text-white placeholder:text-zinc-600 h-10"
                    />
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            <div className="grid gap-4">
                {projects.map((project, i) => (
                    <div key={i} className="group bg-[#0A0A12] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold
                  ${project.type === 'Design' ? 'bg-purple-500/10 text-purple-400' :
                                        project.type === 'Development' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {project.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{project.name}</h3>
                                    <p className="text-sm text-zinc-500">{project.client}</p>
                                </div>
                            </div>
                            <button className="text-zinc-500 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm text-zinc-400 mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${project.status === 'In Progress' ? 'bg-blue-500' : project.status === 'Review' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
                                    {project.status}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={14} /> {project.due}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium">{project.progress}%</span>
                                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full" style={{ width: `${project.progress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
