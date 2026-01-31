import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Growth',
        price: '$2,999',
        period: '/month',
        features: [
            'Social Media Management (4 Platforms)',
            '8 SEO-Optimized Blog Posts',
            'Weekly Strategy Calls',
            'Basic Analytics Reporting'
        ],
        cta: 'Start Growing'
    },
    {
        name: 'AI Autopilot',
        price: '$5,999',
        period: '/month',
        popular: true,
        features: [
            'Fully Automated Social Posting (Daily)',
            'AI Email Marketing Agents (Nurture & Sales)',
            '24/7 AI Chatbot for Lead Capture',
            'Content Engine (Unlimited Short-form)',
            'Real-time ROI Dashboard'
        ],
        cta: 'Deploy Agents'
    },
    {
        name: 'Domination',
        price: '$9,999',
        period: '/month',
        features: [
            'Everything in AI Autopilot',
            'Dedicated Growth Engineer',
            'Custom LLM Model Training',
            'Multi-channel Ad Automation',
            'White-glove Onboarding'
        ],
        cta: 'Contact Sales'
    }
];

export default function ServicesPage() {
    return (
        <main className="bg-[#050510] min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 container">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Clear, Transparent Services
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        We don't hide behind complex enterprise tiers. Choose exactly what you need to grow your business.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Website Package */}
                    <Card className="flex flex-col border-white/10 bg-white/5 hover:border-cyan-500/30 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl text-white">Modern Website</CardTitle>
                            <div className="text-xl font-bold text-cyan-400 mt-2">
                                From ₹25,000
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 mt-4">
                            <p className="text-sm text-zinc-400 mb-6">Perfect for businesses needing a professional digital storefront.</p>
                            <ul className="space-y-3">
                                {['5-Page Responsive Design', 'Next.js Performance (Super Fast)', 'SEO Basics Included', 'Contact Form Integration', 'Hosting Setup'].map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-cyan-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Content Package */}
                    <Card className="flex flex-col border-white/10 bg-white/5 hover:border-purple-500/30 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl text-white">Social Growth</CardTitle>
                            <div className="text-xl font-bold text-purple-400 mt-2">
                                From ₹15,000<span className="text-sm font-normal text-zinc-500">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 mt-4">
                            <p className="text-sm text-zinc-400 mb-6">Consistent content to build trust and authority.</p>
                            <ul className="space-y-3">
                                {['12 Instagram Posts/Month', '4 Reels (Edited & Captioned)', 'Hashtag Strategy', 'Bio Optimization', 'Monthly Performance Report'].map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-purple-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Automation Package */}
                    <Card className="flex flex-col border-white/10 bg-white/5 hover:border-emerald-500/30 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl text-white">Automation System</CardTitle>
                            <div className="text-xl font-bold text-emerald-400 mt-2">
                                Custom Quote
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 mt-4">
                            <p className="text-sm text-zinc-400 mb-6">Remove manual tasks and lead leakage forever.</p>
                            <ul className="space-y-3">
                                {['WhatsApp Business API', 'Lead Capture Funnels', 'Auto-Reply Systems', 'CRM Integration', 'Email Nurture Sequences'].map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                        <Check className="w-5 h-5 text-emerald-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-6">Not sure what you need?</h3>
                    <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
                        Talk to the Founder
                    </Button>
                </div>
            </div>
            <Footer />
        </main>
    );
}
