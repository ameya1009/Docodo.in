import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-zinc-400">Manage your account preferences and billing.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Section */}
                <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">First Name</label>
                                <input type="text" defaultValue="Ameya" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Last Name</label>
                                <input type="text" defaultValue="Kshirsagar" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Email Address</label>
                            <input type="email" defaultValue="ameya@docodo.in" disabled className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-zinc-500 cursor-not-allowed" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button className="bg-white text-black hover:bg-zinc-200">Save Changes</Button>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                            <div>
                                <div className="font-medium text-white">Email Alerts</div>
                                <div className="text-sm text-zinc-500">Receive weekly performance reports.</div>
                            </div>
                            <div className="w-10 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="border border-red-900/20 bg-red-950/5 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
                    <p className="text-zinc-500 text-sm mb-4">Permanently delete your account and all of your content.</p>
                    <Button variant="outline" className="text-red-400 border-red-900/50 hover:bg-red-950/30 hover:text-red-300 hover:border-red-800">Delete Account</Button>
                </section>
            </div>
        </div>
    );
}
