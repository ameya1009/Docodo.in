import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatDemo } from '@/components/demos/ChatDemo';

export default function AIToolsPage() {
    return (
        <main>
            <Navbar />
            <div className="pt-32 pb-20 container">
                <h1 className="text-center mb-4">AI Tools Suite</h1>
                <p className="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
                    Experience the power of autonomous agents. Try our demo below.
                </p>

                <ChatDemo />

                <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="mb-4">Beyond Chatbots</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Docodo agents don't just talk; they execute. From scheduling posts to analyzing market trends,
                            our proprietary models work 24/7 to grow your business.
                        </p>
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-white/10 flex items-center justify-center p-8 text-center">
                        <span className="text-zinc-500 italic">Workflow Visualization Placeholder</span>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
