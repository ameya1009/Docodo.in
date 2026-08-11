"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { discoverBusinessAction, confirmDiscoveredBusinessAction } from "@/lib/actions/discovery";

const STAGES = ["launch", "profile", "generate", "dashboard"] as const;
type Stage = (typeof STAGES)[number];

const TYPE_META: Record<string, { icon: string; label: string; sub: string }> = {
  Salon: { icon: "💇", label: "Salon", sub: "Haircut, spa, styling" },
  Clinic: { icon: "🩺", label: "Clinic", sub: "Doctor, dental, physio" },
  Gym: { icon: "🏋️", label: "Gym", sub: "Fitness, yoga, classes" },
  "Yoga Studio": { icon: "🧘", label: "Yoga Studio", sub: "Meditation, mindfulness" },
  Spa: { icon: "💆", label: "Spa", sub: "Massage, holistic therapy" },
  Dentist: { icon: "🦷", label: "Dentist", sub: "Oral care, cosmetic" },
};

interface BizState {
  type: string;
  name: string;
  phone: string;
  city: string;
  hours: string;
  slug: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const [biz, setBiz] = useState<BizState>({
    type: "",
    name: "",
    phone: "",
    city: "",
    hours: "9–8, daily",
    slug: "",
  });

  const [discoveredProfile, setDiscoveredProfile] = useState<any>(null);

  const handleDiscover = () => {
    const finalName = biz.name || (biz.type === "Salon" ? "Glow Studio" : biz.type === "Clinic" ? "Wellness Clinic" : "Iron Fit Gym");
    const finalPhone = biz.phone || "+91 90000 00000";
    const finalCity = biz.city || "Pune";

    setBiz((prev) => ({ ...prev, name: finalName, phone: finalPhone, city: finalCity }));
    setStageIndex(2); // Jump to generate stage
    setError("");

    startTransition(async () => {
      const res = await discoverBusinessAction({
        name: finalName,
        city: finalCity,
        businessType: biz.type,
      });

      if (res.success && res.profile) {
        setDiscoveredProfile(res.profile);
        const confirmRes = await confirmDiscoveredBusinessAction({
          ...res.profile,
          phone: finalPhone,
        });

        if (confirmRes.success && confirmRes.slug) {
          setBiz((prev) => ({ ...prev, slug: confirmRes.slug! }));
        } else {
          setError(confirmRes.error || "Failed to finalize activation.");
        }
      } else {
        setError(res.error || "Failed to discover business.");
      }
    });
  };

  const currentStage = STAGES[stageIndex];

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#12151c] font-sans">
      <div className="max-w-[880px] mx-auto px-5 pt-7 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-lg bg-[#1c2a4a] text-[#e8963a] font-serif font-bold text-lg flex items-center justify-center">
              D
            </div>
            <div className="font-serif text-xl tracking-[0.01em] text-[#1c2a4a]">docodo</div>
          </div>
          <div className="font-mono text-[11px] tracking-[0.08em] text-[#6b7280] uppercase">
            Step {stageIndex + 1} of {STAGES.length}
          </div>
        </div>

        {/* Progress Rail */}
        <div className="flex gap-1 mb-8">
          {STAGES.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] bg-[#dcd6c8] rounded-[2px] overflow-hidden relative">
              <motion.div
                className="h-full bg-[#e8963a]"
                initial={{ width: "0%" }}
                animate={{
                  width: i < stageIndex ? "100%" : i === stageIndex ? "40%" : "0%",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
        </div>

        {/* Panel Container */}
        <div className="bg-white border border-[#dcd6c8] rounded-[14px] p-6 sm:p-8 min-h-[420px] relative overflow-hidden shadow-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {currentStage === "launch" && (
              <LaunchStage
                key="launch"
                bizType={biz.type}
                setBizType={(t: string) => setBiz({ ...biz, type: t })}
                onNext={() => setStageIndex(1)}
              />
            )}
            {currentStage === "profile" && (
              <ProfileStage
                key="profile"
                biz={biz}
                setBiz={setBiz}
                onBack={() => setStageIndex(0)}
                onNext={handleDiscover}
              />
            )}
            {currentStage === "generate" && (
              <GenerateStage
                key="generate"
                bizName={biz.name}
                isError={!!error}
                onComplete={() => {
                  if (!error) setStageIndex(3);
                }}
              />
            )}
            {currentStage === "dashboard" && (
              <DashboardStage
                key="dashboard"
                biz={biz}
                onRestart={() => {
                  setBiz({ type: "", name: "", phone: "", city: "", hours: "9–8, daily", slug: "" });
                  setStageIndex(0);
                }}
                onDone={() => router.push("/dashboard")}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Stages ---

interface LaunchStageProps {
  bizType: string;
  setBizType: (type: string) => void;
  onNext: () => void;
}

function LaunchStage({ bizType, setBizType, onNext }: LaunchStageProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#c9761f] mb-2">
        Welcome to Docodo
      </div>
      <h1 className="font-serif text-[30px] leading-[1.15] text-[#1c2a4a] mb-2.5">Launch My Business</h1>
      <div className="text-[#6b7280] text-[15px] leading-relaxed mb-6 max-w-[52ch]">
        Pick what best describes your business. Docodo tailors your website, booking system, and dashboard to it automatically.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
        {Object.entries(TYPE_META).map(([key, meta]) => {
          const isSel = bizType === key;
          return (
            <div
              key={key}
              onClick={() => setBizType(key)}
              className={`border-[1.5px] rounded-[10px] p-[18px] px-3.5 text-center cursor-pointer transition-all duration-150
                ${isSel ? "border-[#1c2a4a] bg-[#f4f2ea]" : "border-[#dcd6c8] bg-white hover:border-[#e8963a] hover:-translate-y-[1px]"}
              `}
            >
              <div className="text-[26px] mb-2">{meta.icon}</div>
              <div className="font-semibold text-[14px] text-[#12151c]">{meta.label}</div>
              <div className="text-[12px] text-[#6b7280] mt-0.5">{meta.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-7">
        <span />
        <button
          onClick={onNext}
          disabled={!bizType}
          className="font-sans font-semibold text-[14.5px] rounded-lg px-5 py-2.5 transition-all
            bg-[#1c2a4a] text-white disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#2d3f68]"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}

interface ProfileStageProps {
  biz: BizState;
  setBiz: (biz: BizState) => void;
  onBack: () => void;
  onNext: () => void;
}

function ProfileStage({ biz, setBiz, onBack, onNext }: ProfileStageProps) {
  const meta = TYPE_META[biz.type] || { label: "Business" };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#c9761f] mb-2">
        {meta.label} setup
      </div>
      <h1 className="font-serif text-[30px] leading-[1.15] text-[#1c2a4a] mb-2.5">Tell us the essentials</h1>
      <div className="text-[#6b7280] text-[15px] leading-relaxed mb-6 max-w-[52ch]">
        Just enough to generate your storefront. You can refine everything later from your dashboard.
      </div>

      <div className="mb-4">
        <label className="block text-[12.5px] font-semibold text-[#1c2a4a] mb-1.5 tracking-[0.01em]">
          Business name
        </label>
        <input
          type="text"
          value={biz.name}
          onChange={(e) => setBiz({ ...biz, name: e.target.value })}
          placeholder={`e.g. ${biz.type === "Salon" ? "Glow Studio" : biz.type === "Clinic" ? "Wellness Clinic" : "Iron Fit Gym"}`}
          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#dcd6c8] rounded-lg text-[14.5px] bg-white text-[#12151c] focus:outline-none focus:border-[#e8963a] focus:ring-1 focus:ring-[#e8963a]/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        <div>
          <label className="block text-[12.5px] font-semibold text-[#1c2a4a] mb-1.5 tracking-[0.01em]">
            WhatsApp / contact number
          </label>
          <input
            type="tel"
            value={biz.phone}
            onChange={(e) => setBiz({ ...biz, phone: e.target.value })}
            placeholder="+91 9xxxxxxxxx"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-[#dcd6c8] rounded-lg text-[14.5px] bg-white text-[#12151c] focus:outline-none focus:border-[#e8963a] focus:ring-1 focus:ring-[#e8963a]/20"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-[#1c2a4a] mb-1.5 tracking-[0.01em]">
            City
          </label>
          <input
            type="text"
            value={biz.city}
            onChange={(e) => setBiz({ ...biz, city: e.target.value })}
            placeholder="e.g. Pune"
            className="w-full px-3.5 py-2.5 border-[1.5px] border-[#dcd6c8] rounded-lg text-[14.5px] bg-white text-[#12151c] focus:outline-none focus:border-[#e8963a] focus:ring-1 focus:ring-[#e8963a]/20"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[12.5px] font-semibold text-[#1c2a4a] mb-1.5 tracking-[0.01em]">
          Operating hours
        </label>
        <select
          value={biz.hours}
          onChange={(e) => setBiz({ ...biz, hours: e.target.value })}
          className="w-full px-3.5 py-2.5 border-[1.5px] border-[#dcd6c8] rounded-lg text-[14.5px] bg-white text-[#12151c] focus:outline-none focus:border-[#e8963a] focus:ring-1 focus:ring-[#e8963a]/20"
        >
          <option>9–8, daily</option>
          <option>10–7, closed Mondays</option>
          <option>6am–10pm, daily</option>
          <option>Custom — set later</option>
        </select>
      </div>

      <div className="flex justify-between items-center mt-7">
        <button
          onClick={onBack}
          className="font-sans font-semibold text-[14.5px] rounded-lg px-5 py-2.5 transition-all text-[#6b7280] hover:text-[#12151c] bg-transparent"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="font-sans font-semibold text-[14.5px] rounded-lg px-5 py-2.5 transition-all bg-[#1c2a4a] text-white hover:bg-[#2d3f68]"
        >
          Generate my business
        </button>
      </div>
    </motion.div>
  );
}

interface GenerateStageProps {
  bizName: string;
  onComplete: () => void;
  isError: boolean;
}

function GenerateStage({ bizName, onComplete, isError }: GenerateStageProps) {
  const items = [
    "Business profile generated",
    "Website generated",
    "Booking system generated",
    "CRM generated",
    "Dashboard activated",
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  React.useEffect(() => {
    if (isError) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i <= items.length) {
        setActiveIndex(i);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 650);
    return () => clearInterval(interval);
  }, [isError, onComplete, items.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#c9761f] mb-2">
        Setting things up
      </div>
      <h1 className="font-serif text-[30px] leading-[1.15] text-[#1c2a4a] mb-2.5">
        Building {bizName}&apos;s storefront
      </h1>
      <div className="text-[#6b7280] text-[15px] leading-relaxed mb-6 max-w-[52ch]">
        This normally takes a few seconds. Everything below runs automatically — no manual setup required.
      </div>
      <ul className="m-0 p-0 mb-2">
        {items.map((text, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;
          return (
            <li
              key={i}
              className={`flex items-center gap-3 py-3.5 border-b border-[#dcd6c8] last:border-b-0 text-[14.5px] transition-colors duration-300
                ${isDone || isActive ? "text-[#12151c]" : "text-[#6b7280]"}`}
            >
              <div
                className={`w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-300 relative
                  ${isDone ? "border-[#2f7a4f] bg-[#2f7a4f] text-white" : isActive ? "border-[#e8963a] bg-[#e8963a]" : "border-[#dcd6c8] bg-transparent"}`}
              >
                {isDone && <span className="text-[12px] font-bold">✓</span>}
                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    className="absolute w-[9px] h-[9px] rounded-full border-2 border-white border-t-transparent"
                  />
                )}
              </div>
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

interface DashboardStageProps {
  biz: BizState;
  onRestart: () => void;
  onDone: () => void;
}

function DashboardStage({ biz, onRestart, onDone }: DashboardStageProps) {
  const [copied, setCopied] = useState(false);
  const meta = TYPE_META[biz.type] || { label: "Business" };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="bg-[#1c2a4a] text-white rounded-[10px] p-5 sm:px-[22px] mb-5 flex justify-between items-center">
        <div className="font-serif text-xl">{biz.name}</div>
        <div className="font-mono text-[11px] tracking-[0.06em] bg-[#e8963a] text-[#1c2a4a] px-2.5 py-1 rounded-full font-bold uppercase">
          Live & ready
        </div>
      </div>

      <div className="text-[#6b7280] text-[15px] leading-relaxed mb-4">
        {meta.label} in {biz.city} · {biz.hours}. Your storefront, booking system, and dashboard are ready to accept customers.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="border border-[#dcd6c8] rounded-[10px] p-4">
          <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">Website</div>
          <div className="text-[15px] font-semibold text-[#1c2a4a] break-words">docodo.in/{biz.slug}</div>
        </div>
        <div className="border border-[#dcd6c8] rounded-[10px] p-4">
          <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">Booking system</div>
          <div className="text-[15px] font-semibold text-[#1c2a4a]">Active — 0 bookings so far</div>
        </div>
        <div className="border border-[#dcd6c8] rounded-[10px] p-4">
          <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">CRM</div>
          <div className="text-[15px] font-semibold text-[#1c2a4a]">0 customers, ready to sync</div>
        </div>
        <div className="border border-[#dcd6c8] rounded-[10px] p-4">
          <div className="font-mono text-[11px] text-[#6b7280] uppercase tracking-[0.06em] mb-1.5">Contact</div>
          <div className="text-[15px] font-semibold text-[#1c2a4a]">{biz.phone}</div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#f4f2ea] border border-dashed border-[#c9761f] rounded-lg p-3 px-3.5 mt-4 font-mono text-[13px]">
        <span>docodo.in/{biz.slug}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`https://docodo.in/${biz.slug}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="bg-transparent border border-[#1c2a4a] text-[#1c2a4a] px-2.5 py-1 text-[11px] rounded-md transition-colors hover:bg-[#1c2a4a] hover:text-white"
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onRestart}
          className="font-sans font-semibold text-[14.5px] rounded-lg px-4 py-2 text-[#6b7280] hover:text-[#12151c]"
        >
          Start over
        </button>
        <button
          onClick={onDone}
          className="font-sans font-semibold text-[14.5px] rounded-lg px-5 py-2.5 transition-all bg-[#1c2a4a] text-white hover:bg-[#2d3f68]"
        >
          Go to full dashboard →
        </button>
      </div>
    </motion.div>
  );
}
