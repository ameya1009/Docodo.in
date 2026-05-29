'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Copy, Check, MessageSquare, RefreshCw, Code, ArrowRight, Zap, Play, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ----------------------------------------------------
// HELPER: COPY TO CLIPBOARD
// ----------------------------------------------------
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text', err);
        }
    };
    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-400 transition-all active:scale-95"
            title="Copy to Clipboard"
        >
            {copied ? (
                <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                </>
            ) : (
                <>
                    <Copy size={12} />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
}

// ----------------------------------------------------
// 1. ECG CONTENT GENERATOR
// ----------------------------------------------------
export function ECGGeneratorDemo() {
    const [topic, setTopic] = useState('');
    const [industry, setIndustry] = useState('Salon');
    const [language, setLanguage] = useState('Hinglish');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ evergreen: string; controversial: string; growth: string } | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/ecg-generator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: topic, industry, language })
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Target Topic / Content Idea</label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Stop hair fall, opening a new bakery, summer skincare routine..."
                        rows={3}
                        className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-600 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Industry Category</label>
                        <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        >
                            <option value="Salon">Beauty & Hair Salon</option>
                            <option value="Clinic">Skin & Laser Clinic</option>
                            <option value="Cafe">Cafe & Restaurant</option>
                            <option value="Spa">Luxury Spa & Wellness</option>
                            <option value="Gym">Fitness Gym & Coach</option>
                            <option value="General">General Business</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Tone & Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        >
                            <option value="Hinglish">Hinglish (Hybrid Hindi-English)</option>
                            <option value="English">Pure English (Global Tone)</option>
                            <option value="Hindi">Pure Hindi (Devenagari)</option>
                        </select>
                    </div>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[11px] h-12 rounded-xl flex items-center justify-center gap-2 group transition-all"
                >
                    {loading ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            Analyzing Formula & Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} />
                            Generate ECG Campaign
                        </>
                    )}
                </Button>
            </div>

            {result && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold border-b border-white/5 pb-2">
                        <Zap size={14} className="text-emerald-400" />
                        <span>ECG STRATEGY GENERATED (50:30:20 RATIO)</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Evergreen */}
                        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                            <div className="flex justify-between items-center mb-3 pl-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded border border-emerald-500/20">E</span>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Evergreen (50% Authority Builder)</h4>
                                </div>
                                <CopyButton text={result.evergreen} />
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line pl-2">{result.evergreen}</p>
                        </div>

                        {/* Controversial */}
                        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-sapphire-500" />
                            <div className="flex justify-between items-center mb-3 pl-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-sapphire-500/10 text-sapphire-400 text-[9px] font-black rounded border border-sapphire-500/20">C</span>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Controversial (30% Hook & Engagement)</h4>
                                </div>
                                <CopyButton text={result.controversial} />
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line pl-2">{result.controversial}</p>
                        </div>

                        {/* Growth */}
                        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                            <div className="flex justify-between items-center mb-3 pl-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[9px] font-black rounded border border-cyan-500/20">G</span>
                                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Growth (20% Direct Offer/CTA)</h4>
                                </div>
                                <CopyButton text={result.growth} />
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line pl-2">{result.growth}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 2. WHATSAPP HINGLISH CHATBOT SIMULATOR
// ----------------------------------------------------
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function WhatsAppSimulatorDemo() {
    const [businessName, setBusinessName] = useState('Koregaon Park Salon');
    const [template, setTemplate] = useState('Salon');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial greeting load
    useEffect(() => {
        resetChat();
    }, [template, businessName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const resetChat = () => {
        const welcome = template === 'Cafe'
            ? `Namaste! ☕ Welcome to ${businessName}. Aaj local wood-fired pizzas par BOGO offer hai. Order place karu ya table reservation slot check karu aapke liye?`
            : template === 'Clinic'
            ? `Hello! 🩺 Dr. Patil's Skin Clinic (Viman Nagar) me aapka swagat hai. Skin analysis appointment book karni hai ya customized hair treatment inquire karna hai?`
            : `Hi there! 💇‍♀️ Welcome to ${businessName} (Baner). Humare advanced styling slots and VIP treatment combos standard price se 20% off par available hain. Booking slot lock karu aapka?`;
        setMessages([{ role: 'assistant', content: welcome }]);
    };

    const handleSend = async (textToSend: string = input) => {
        const cleaned = textToSend.trim();
        if (!cleaned || isLoading) return;

        const newMsg: Message = { role: 'user', content: cleaned };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/whatsapp-simulator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, newMsg],
                    template,
                    businessName
                })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection lag ho gaya. Please network check karein aur wapas try karein! 🙏' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[580px]">
            {/* Left Column: Config */}
            <div className="lg:col-span-4 flex flex-col gap-4 p-5 bg-black/40 border border-white/5 rounded-2xl h-full justify-between">
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Simulator Config</span>
                        <h4 className="text-sm font-bold text-white">Customize Agent Persona</h4>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Industry Flow</label>
                        <select
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        >
                            <option value="Salon">Salon Booking Flow</option>
                            <option value="Clinic">Clinic Qualification Flow</option>
                            <option value="Cafe">Cafe Discount/Order Flow</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Quick Simulation Prompts:</span>
                    <button
                        onClick={() => handleSend("Do you have slot open today at 4 PM in Baner?")}
                        className="w-full text-left p-2.5 bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-xl text-xs text-zinc-300 transition-all font-semibold"
                    >
                        ⚡ Ask for Baner Slot at 4 PM
                    </button>
                    <button
                        onClick={() => handleSend("Pricing batao hair treatment ka")}
                        className="w-full text-left p-2.5 bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-xl text-xs text-zinc-300 transition-all font-semibold"
                    >
                        💰 Ask for service pricing
                    </button>
                    <button
                        onClick={() => handleSend("Ameya, +91 9876543210")}
                        className="w-full text-left p-2.5 bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-xl text-xs text-zinc-300 transition-all font-semibold"
                    >
                        📞 Send Contact Info to Book
                    </button>
                </div>
            </div>

            {/* Right Column: WhatsApp UI */}
            <div className="lg:col-span-8 flex flex-col h-full bg-[#0b141a] border border-[#202c33] rounded-[2rem] overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-[#202c33] px-6 py-4 flex items-center justify-between border-b border-[#3b4a54]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-black text-white text-sm relative">
                            {businessName[0]?.toUpperCase()}
                            <div className="w-2.5 h-2.5 bg-emerald-400 border border-[#202c33] rounded-full absolute bottom-0 right-0 animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white leading-tight">{businessName}</h4>
                            <span className="text-[10px] text-emerald-400 font-bold block">Docodo AI Assistant</span>
                        </div>
                    </div>
                    <button
                        onClick={resetChat}
                        className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                        title="Reset Chat"
                    >
                        <RefreshCw size={15} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-cover bg-center" style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, opacity: 0.95 }}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3.5 rounded-xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-[#005c4b] text-white rounded-tr-none'
                                : 'bg-[#202c33] text-zinc-100 rounded-tl-none border border-[#3b4a54]'
                                }`}>
                                <p className="whitespace-pre-line">{msg.content}</p>
                                <span className="text-[8px] text-zinc-400/70 block text-right mt-1.5 font-bold">12:34 PM</span>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="p-3.5 rounded-xl bg-[#202c33] border border-[#3b4a54] text-zinc-500 text-sm flex gap-1 rounded-tl-none items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-100" />
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Tray */}
                <div className="bg-[#202c33] p-4 flex items-center gap-3 border-t border-[#3b4a54]">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type standard Hinglish message..."
                        className="flex-1 bg-[#2a3942] border border-transparent rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-[#00a884] placeholder:text-zinc-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="w-11 h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-md shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// 3. SEO SCHEMA GENERATOR
// ----------------------------------------------------
export function SEOSchemaDemo() {
    const [businessName, setBusinessName] = useState('Balewadi Hair Clinic');
    const [category, setCategory] = useState('HairSalon');
    const [address, setAddress] = useState('Shop 12, Balewadi High Street, Baner, Pune - 411045');
    const [phone, setPhone] = useState('+91 98811 77777');
    const [url, setUrl] = useState('https://balewadihairclinic.in');
    const [openingHours, setOpeningHours] = useState('Mo-Su 10:00-21:00');
    const [services, setServices] = useState('Laser Therapy, Hair Transplantation, Custom Styling');
    const [loading, setLoading] = useState(false);
    const [schema, setSchema] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!businessName) return;
        setLoading(true);
        try {
            const res = await fetch('/api/seo-schema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName,
                    category,
                    address,
                    phone,
                    url,
                    openingHours,
                    services
                })
            });
            const data = await res.json();
            setSchema(data.schema);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Business Name</label>
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g. Balewadi Hair Clinic"
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Schema Type</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        >
                            <option value="HairSalon">HairSalon</option>
                            <option value="SkinClinic">MedicalClinic (Skin Clinic)</option>
                            <option value="FoodEstablishment">FoodEstablishment (Cafe/Resto)</option>
                            <option value="HealthClub">HealthClub (Gym/Spa)</option>
                            <option value="LocalBusiness">Generic LocalBusiness</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Street Address (Pune Code)</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Shop 12, Balewadi High Street, Baner, Pune - 411045"
                        className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Phone Number</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +91 98811 77777"
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Website URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://yourbrand.in"
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Opening Hours</label>
                        <input
                            type="text"
                            value={openingHours}
                            onChange={(e) => setOpeningHours(e.target.value)}
                            placeholder="Mo-Su 10:00-21:00"
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Top Services (Comma Separated)</label>
                    <input
                        type="text"
                        value={services}
                        onChange={(e) => setServices(e.target.value)}
                        placeholder="e.g. Haircut, Global Coloring, Scalp Bio-Wash"
                        className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !businessName}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[11px] h-12 rounded-xl flex items-center justify-center gap-2 group transition-all"
                >
                    {loading ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            Formatting Graph Schema...
                        </>
                    ) : (
                        <>
                            <Code size={14} />
                            Generate Structured JSON-LD
                        </>
                    )}
                </Button>
            </div>

            {schema && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                            <Globe size={14} className="text-emerald-400" />
                            <span>STRUCTURED JSON-LD FOR LOCAL & SOFTWARE AGENT (READY FOR HEAD)</span>
                        </div>
                        <CopyButton text={schema} />
                    </div>

                    <pre className="p-5 bg-zinc-950 border border-white/5 rounded-2xl text-xs text-emerald-400 font-mono overflow-x-auto max-h-[350px] leading-relaxed custom-scrollbar">
                        <code>{schema}</code>
                    </pre>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            LocalBusiness Coordinates validated
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Product Catalog Linked
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Docodo aggregateRating injected
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Schema.org standard compliant
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// 4. COLD OUTREACH COPYWRITER
// ----------------------------------------------------
export function ColdOutreachDemo() {
    const [targetProspect, setTargetProspect] = useState('Cafe Owner in Koregaon Park');
    const [offer, setOffer] = useState('Free automated slot booking system that adds ₹30k/mo revenue');
    const [channel, setChannel] = useState('WhatsApp');
    const [language, setLanguage] = useState('Hinglish');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

    const handleGenerate = async () => {
        if (!targetProspect || !offer) return;
        setLoading(true);
        try {
            const res = await fetch('/api/outreach-writer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetProspect,
                    offer,
                    channel,
                    language
                })
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Target Prospect Profile</label>
                        <input
                            type="text"
                            value={targetProspect}
                            onChange={(e) => setTargetProspect(e.target.value)}
                            placeholder="e.g. Cafe Owner in Koregaon Park"
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Outreach Channel</label>
                        <select
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        >
                            <option value="WhatsApp">WhatsApp Chat (Casual/Emojis)</option>
                            <option value="Cold Email">Cold Email (AIDA/Subject Line)</option>
                            <option value="Instagram DM">Instagram DM (Hook/Short)</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Value Proposition / Core Offer</label>
                    <input
                        type="text"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        placeholder="e.g. Free automated slot booking system that adds ₹30k/mo revenue"
                        className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Language</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 w-full"
                    >
                        <option value="Hinglish">Hinglish (Conversational/Highly Relatable)</option>
                        <option value="English">English (Formal & Authority Driven)</option>
                    </select>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !targetProspect || !offer}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[11px] h-12 rounded-xl flex items-center justify-center gap-2 group transition-all"
                >
                    {loading ? (
                        <>
                            <RefreshCw size={14} className="animate-spin" />
                            Formulating Outreach Psychology...
                        </>
                    ) : (
                        <>
                            <FileText size={14} />
                            Generate High-Converting Outreach
                        </>
                    )}
                </Button>
            </div>

            {result && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                            <Sparkles size={14} className="text-emerald-400" />
                            <span>GENERATED OUTREACH CAMPAIGN FOR {channel.toUpperCase()}</span>
                        </div>
                        <CopyButton text={result.body} />
                    </div>

                    {result.subject && (
                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Subject Line:</span>
                            <div className="text-sm font-bold text-white">{result.subject}</div>
                        </div>
                    )}

                    <div className="p-5 bg-zinc-950 border border-white/5 rounded-2xl text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
                        {result.body}
                    </div>
                </div>
            )}
        </div>
    );
}
