"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, Shield, ArrowRight, CornerDownLeft } from "lucide-react";
import { FAQ_LIST, PRICING_PLANS } from "@/lib/constants";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const INITIAL_GREETING = "Namaste! 🙏 I am the Docodo AI Assistant. I can help you with anything related to Docodo — 15-minute clinic onboarding, OPD slot booking, WhatsApp automation, 0% commission pricing, or DPDP compliance. How can I help you today?";

const OFF_TOPIC_RESPONSE = "I am the dedicated Docodo Assistant AI. I can only answer questions related to Docodo's clinic booking platform, patient appointment systems, WhatsApp automations, pricing, and integrations. How can I assist your clinic or practice?";

export const DocodoQABot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: INITIAL_GREETING,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickChips = [
    "How does 15-min setup work?",
    "What are your pricing plans?",
    "Do you charge booking commission?",
    "Can patients book on WhatsApp?",
    "Is patient data secure (DPDP)?",
    "Can I accept UPI & Pay at Clinic?",
  ];

  // Docodo-only knowledge matcher
  const matchDocodoAnswer = (query: string): string => {
    const q = query.toLowerCase().trim();

    // Check FAQ list for close match
    for (const faq of FAQ_LIST) {
      const qWords = faq.q.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matchCount = qWords.filter((w) => q.includes(w)).length;
      if (matchCount >= 2 || q.includes(faq.q.toLowerCase().slice(0, 15))) {
        return faq.a;
      }
    }

    // Specific Intent Matching
    if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("plan") || q.includes("rate") || q.includes("fee")) {
      return "Docodo offers 3 simple transparent tiers with 0% commission on your patient appointments:\n\n• Pilot Plan: ₹0 (14-day free pilot, up to 20 bookings)\n• Starter Plan: ₹999/month (unlimited appointments, live booking link, automated WhatsApp confirmations)\n• Growth Plan: ₹2,499/month (custom domain, AI WhatsApp receptionist, 24-hr reminder sequences, revenue analytics).\n\nYou can switch or cancel anytime with no lock-in.";
    }

    if (q.includes("setup") || q.includes("15 min") || q.includes("how to start") || q.includes("onboarding") || q.includes("register")) {
      return "Setting up your clinic takes under 15 minutes! Simply visit docodo.in/onboarding, select your medical specialty (Dental, Dermatology, OPD, Physio, etc.), configure your consultation fees and clinic working hours, and your live booking link (docodo.in/book/your-clinic) is published immediately.";
    }

    if (q.includes("commission") || q.includes("practo") || q.includes("cut") || q.includes("percentage") || q.includes("per booking")) {
      return "Docodo charges ZERO PERCENT (0%) commission on your appointments. Unlike aggregator directories that poach your patients and charge 15-20% per lead, Docodo gives you a dedicated direct booking link where 100% of patient consultation fees go straight into your bank account.";
    }

    if (q.includes("payment") || q.includes("upi") || q.includes("gpay") || q.includes("phonepe") || q.includes("cash") || q.includes("cod")) {
      return "Yes! Docodo integrates natively with Razorpay to accept instant UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and NetBanking. You can also enable 'Pay at Clinic / Cash on Delivery' so patients can confirm their time slot upfront and pay at your reception desk.";
    }

    if (q.includes("whatsapp") || q.includes("reminder") || q.includes("no show") || q.includes("bot") || q.includes("message")) {
      return "Docodo includes an automated WhatsApp engine that sends instant booking confirmations, 24-hour advance pre-appointment reminder nudges (cutting no-shows by up to 90%), and post-consultation Google review links. You can also pause the bot with 1 click anytime for staff takeover.";
    }

    if (q.includes("security") || q.includes("dpdp") || q.includes("privacy") || q.includes("data") || q.includes("safe") || q.includes("encrypt")) {
      return "Your patient records and clinic financials are 100% secure. Docodo enforces strict database-level multi-tenant isolation (Tenant A cannot see Tenant B), SSL/TLS in-transit encryption, HMAC SHA-256 webhook signatures, and data residency compliance under the Indian Digital Personal Data Protection (DPDP) Act 2023.";
    }

    if (q.includes("app") || q.includes("download") || q.includes("install") || q.includes("client app") || q.includes("patient app")) {
      return "Patients NEVER need to download an app or create a password to book. They simply tap your link (docodo.in/book/your-clinic) on any smartphone, pick an available slot, enter their name and phone number, and book in 30 seconds.";
    }

    if (q.includes("doctor") || q.includes("clinic") || q.includes("dentist") || q.includes("opd") || q.includes("physio") || q.includes("specialty")) {
      return "Docodo is specially optimized for independent healthcare providers: General Physicians, Dental Clinics, Dermatologists, Pediatricians, Physiotherapy Centers, and Polyclinics. It eliminates crowded waiting rooms by scheduling exact appointment slots and token confirmations.";
    }

    if (q.includes("subdomain") || q.includes("domain") || q.includes("website") || q.includes("slug") || q.includes("url")) {
      return "Every clinic gets a clean, instant booking storefront at docodo.in/book/[your-clinic-name]. Growth tier clinics can also link their custom domain (e.g. appointments.drsharma.com) with automatic SSL certificates.";
    }

    if (q.includes("contact") || q.includes("support") || q.includes("founder") || q.includes("ameya") || q.includes("phone")) {
      return "You can reach the Docodo team directly on WhatsApp or phone at +91 9284310604 or email hello@docodo.in. Our team is based in Pune & Mumbai and provides 48-hour hands-on onboarding.";
    }

    // Filter out off-topic questions
    const docodoKeywords = [
      "docodo", "booking", "appointment", "clinic", "doctor", "opd", "patient", "token", 
      "slot", "salon", "service", "schedule", "calendar", "crm", "dashboard", "upi", 
      "razorpay", "whatsapp", "reminder", "no-show", "fees", "reception", "hospital"
    ];

    const isDocodoRelated = docodoKeywords.some((k) => q.includes(k));
    if (!isDocodoRelated) {
      return OFF_TOPIC_RESPONSE;
    }

    return "Docodo is an all-in-one clinic operating system that turns enquiries into confirmed patient appointments in 15 minutes. It combines direct booking links, zero-commission payments, WhatsApp reminders, and a patient CRM. Would you like to know more about our 15-minute setup, pricing plans, or WhatsApp features?";
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botAnswer = matchDocodoAnswer(text);
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Docodo AI Assistant"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-black text-white border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] hover:border-white/50 transition-all duration-300 group cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-6 h-6">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping" />
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold tracking-wide">Docodo AI</div>
            <div className="text-[10px] text-zinc-400 font-mono">Ask about setup & pricing</div>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          data-testid="docodo-qa-modal"
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-2xl bg-black border border-white/20 shadow-[0_12px_50px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-zinc-950 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  Docodo AI Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">Official Q&A • Strictly Docodo</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-white text-black font-medium rounded-br-none"
                      : "bg-zinc-900 text-zinc-200 border border-white/10 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-zinc-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-400 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-zinc-950/80 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-white/10 transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Docodo..."
              className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              aria-label="Send message"
              className="p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:hover:bg-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
