import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Linkedin, Newspaper, Headphones } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="bg-[#050510] min-h-screen text-zinc-100 selection:bg-cyan-500/30">
            <Navbar />

            <div className="container max-w-4xl mx-auto px-6 pt-32 pb-20">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-zinc-400 mb-6 tracking-tight">
                        Built by Engineers.<br />Designed for Growth.
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Docodo is an early-stage digital growth studio helping small businesses adopt practical AI and automation. No fluff, just systems that work.
                    </p>
                </div>

                {/* Founder Section */}
                <div className="grid md:grid-cols-12 gap-12 items-start mb-20 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="md:col-span-4 flex flex-col items-center text-center md:items-start md:text-left">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-4">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                {/* Placeholder for Headshot */}
                                <span className="text-2xl font-bold text-white">AK</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white">Ameya Kshirsagar</h2>
                        <p className="text-cyan-400 text-sm font-medium uppercase tracking-wide mb-4">Founder & Lead Engineer</p>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Based in Pune, India.<br />
                            Electronics & Telecommunication Engineer.<br />
                            Builder of digital systems.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://www.linkedin.com/in/ameya-kshirsagar-1002" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://medium.com/@ameyakshirsagar02" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                <Newspaper size={20} />
                            </a>
                            <a href="https://open.spotify.com/episode/1ycc6RT0WXrw8yGM6yzcJk" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                                <Headphones size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-6 text-zinc-300">
                        <p className="text-lg font-medium text-white">
                            "Hi, I’m Ameya."
                        </p>
                        <p>
                            I’m an engineer building practical AI and automation systems to help small businesses grow smarter with limited resources.
                        </p>
                        <p>
                            I don't believe in "inflated claims" or "enterprise jargon." I believe in clarity, honesty, and direction. My background in Electronics & Telecommunication Engineering taught me that systems should be reliable, not just flashy.
                        </p>
                        <div className="bg-black/30 p-6 rounded-xl border border-white/5">
                            <h3 className="text-white font-semibold mb-2">The Founder-Led Advantage</h3>
                            <p className="text-sm text-zinc-400">
                                Docodo is founder-led, which means every early client works directly with me. No layers, no hiring managers, and no handoffs to junior interns. Just focused execution on your project from day one.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How We Work Section */}
                <div id="how-we-work" className="space-y-16 mb-20 scroll-mt-32">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">How We Work</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            No black boxes. Here&apos;s exactly how we operate.
                            We move fast because there&apos;s no bureaucracy.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Discovery", desc: "30-min audit call to identify 2-3 high-impact growth opportunities." },
                            { step: "02", title: "Strategy", desc: "Custom proposal within 48 hours with clear scope and pricing." },
                            { step: "03", title: "Build", desc: "Weekly Loom video updates so you see progress in real-time." },
                            { step: "04", title: "Optimize", desc: "Launch and continuous refinement based on real data." }
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/5">
                                <span className="text-4xl font-bold text-cyan-500/20 absolute top-4 right-6">{item.step}</span>
                                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-cyan-500/5 border border-cyan-500/10">
                            <h3 className="text-xl font-bold text-white mb-6">What You Own</h3>
                            <ul className="space-y-4">
                                {[
                                    "100% of the Source Code",
                                    "All Design Files (Figma)",
                                    "Your Data & Integrations",
                                    "Complete Documentation"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                            <h3 className="text-xl font-bold text-white mb-6">What We Don&apos;t Do</h3>
                            <ul className="space-y-4">
                                {[
                                    "We don't outsource to junior interns",
                                    "We don't lock you into proprietary tools",
                                    "We don't take on 10+ clients at once",
                                    "We don't promise overnight results"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="space-y-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-xl text-zinc-300 font-light max-w-2xl mx-auto">
                            &quot;To help small businesses adopt simple, practical AI and automation without complexity.&quot;
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Truth + Intent", desc: "We don't promise magic. We promise clarity and engineered growth." },
                            { title: "Hands-on Speed", desc: "We ship fast because we don't have bureaucratic layers." },
                            { title: "Modern Stack", desc: "We use the latest AI & Web tools to give you an unfair advantage." }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-zinc-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </main>
    );
}
