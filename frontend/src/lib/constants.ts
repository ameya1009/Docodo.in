import React from "react";

export const CONTACT = {
  whatsapp: "919284310604",
  email: "ameyakshirsagar@docodo.in",
  location: "Pune & Mumbai, Maharashtra, India",
  youtube: "https://www.youtube.com/channel/UCAgiu7bzl3QvGLNKhXcXsxw/",
  youtubeSecondary: "https://www.youtube.com/channel/UCOxuYbcj1vUjItVTKXd8xgQ/",
  instagram: "https://www.instagram.com/ameyakshirsagar10/",
  spotify: "https://spotify.com/docodo",
  medium: "https://medium.com/@ameyakshirsagar02",
  linkedin: "https://linkedin.com/company/docodo",
  twitter: "https://twitter.com/docodo_in",
};


export const WHATSAPP_LINK = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAVIGATION = [
  { label: "Features", href: "/features" },
  { label: "Automations", href: "/automations" },
  { label: "Integrations", href: "/integrations" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
];

export const HERO_CONTENT = {
  eyebrow: "The Anti-Aggregator Practice OS · 0% Commission · DPDP Act 2023 Compliant",
  headline: {
    line1: "Stop Losing ₹90,000/Month to Empty Chairs.",
    line2: "The All-in-One Practice OS Built for Doctors & Clinics.",
  },
  subheadline:
    "Docodo replaces chaotic paper registers with an intelligent patient CRM, automated WhatsApp appointment workflows, rapid 10-second OPD walk-in entry, and direct UPI bank settlement with 0% platform cuts.",
  primaryCTA: "Launch Doctor Workspace (15 Mins)",
  secondaryCTA: "Test 10-Sec OPD Simulator",
  pilotBadge: "Founder Cohort: Free Setup + 0% Commission Guaranteed",
  trustTicker: [
    "#1 Healthcare CRM & Dashboard",
    "Automated WhatsApp Token Reminders",
    "0% Aggregator Take-Rate",
    "DPDP Act 2023 Compliant",
    "UPI Advance to End No-Shows",
    "10-Second Front-Desk Walk-in Entry",
  ],
};

export const PROBLEM_SECTION = {
  headline: "The Empty Consultation Chair: How Clinics Lose Revenue Daily",
  subheadline: "Third-party aggregators bid against your own clinic, while unconfirmed phone calls lead to high rates of missed patient appointments.",
  flow: [
    { title: "Patient Searches Your Clinic", desc: "Searches on Google / WhatsApp", icon: "Instagram" },
    { title: "Aggregator Shows Rivals", desc: "Practo displays rival doctors", icon: "MessageSquare" },
    { title: "Delayed Clinic Reply", desc: "Receptionist is busy at OPD counter", icon: "Clock" },
    { title: "Empty Chair & Lost Fee", desc: "Patient books elsewhere or no-shows", icon: "UserX" },
  ],
  painPoints: [
    {
      id: "aggregator-poaching",
      title: "Aggregator Lead Poaching & Rival Ads",
      desc: "Aggregator platforms list rival doctors and sponsored clinics right under your profile, charging you for your own loyal patients.",
      icon: "Link2Off",
    },
    {
      id: "no-shows",
      title: "Frequent Patient No-Show Rates",
      desc: "Patients book over phone and forget. Without UPI token deposits or automated WhatsApp reminders, consultation slots sit empty.",
      icon: "BellOff",
    },
    {
      id: "reception-chaos",
      title: "Receptionist Phone Call Chaos",
      desc: "Front desk staff spend 3+ hours daily answering 'Is doctor available?' and manually managing paper appointment registers.",
      icon: "CalendarX",
    },
    {
      id: "uncollected-fees",
      title: "Uncollected Consultation Tokens",
      desc: "No easy way to collect advance consultation fees or token deposits before the patient visits the clinic.",
      icon: "HelpCircle",
    },
    {
      id: "scattered-records",
      title: "Scattered Patient Contact History",
      desc: "Patient phone numbers, past consultation dates, and follow-up schedules are lost in disjointed WhatsApp chats and diaries.",
      icon: "Database",
    },
    {
      id: "missed-enquiries",
      title: "After-Hours Patient Enquiries Lost",
      desc: "Over 40% of patients seek doctors in the evening when the clinic is shut. Delayed replies cause them to visit emergency or rivals.",
      icon: "MessageSquareOff",
    },
  ],
};

export const SETUP_STEPS = [
  {
    step: "01",
    title: "Tell us about your clinic",
    desc: "Enter doctor or clinic name, specialty (Dental, Derma, Physio, GP), city, and WhatsApp number.",
    time: "2 mins",
  },
  {
    step: "02",
    title: "Add your consultation types",
    desc: "Set consultation types, durations, and fees (e.g. First Consultation ₹600, Procedure ₹1,500).",
    time: "4 mins",
  },
  {
    step: "03",
    title: "Set your OPD timings",
    desc: "Configure morning and evening OPD hours and appointment buffers so patients book only open slots.",
    time: "3 mins",
  },
  {
    step: "04",
    title: "Publish private clinic page",
    desc: "Get your dedicated URL: docodo.in/book/dr-name ready for Google Maps & WhatsApp bio.",
    time: "1 min",
  },
  {
    step: "05",
    title: "Start accepting confirmed patients",
    desc: "Receive instant WhatsApp notifications, track OPD schedule, and collect advance tokens.",
    time: "Live!",
  },
];

export const DEMO_WORKFLOW = {
  businessOwner: [
    { label: "1. Creates Clinic Profile", detail: "Dr. Sharma Dental & Implant Clinic" },
    { label: "2. Adds Consultation Types", detail: "OPD Checkup • ₹500 (30 mins)" },
    { label: "3. Sets OPD Schedule", detail: "10:00 AM – 01:00 PM & 05:00 PM – 08:30 PM" },
    { label: "4. Publishes Private Link", detail: "docodo.in/book/dr-sharma-dental" },
  ],
  customer: [
    { label: "1. Opens Clinic Link", detail: "From Google Maps / WhatsApp / Bio" },
    { label: "2. Selects Consultation", detail: "Views doctor timings & transparent fee" },
    { label: "3. Chooses Available Slot", detail: "Tomorrow at 11:30 AM" },
    { label: "4. Confirms with UPI / Pay-at-Clinic", detail: "Instant WhatsApp receipt & directions" },
  ],
  dashboard: [
    { label: "1. Real-Time OPD Alert", detail: "New Patient: Rahul S. (Confirmed)" },
    { label: "2. Slot Auto-Blocked", detail: "11:30 AM slot marked busy" },
    { label: "3. Patient Profile Created", detail: "Contact & visit history recorded" },
    { label: "4. WhatsApp Reminder Scheduled", detail: "24h & 2h pre-appointment alerts" },
  ],
};

export const FEATURES = [
  {
    id: "booking-page",
    category: "A. Professional Booking Page",
    title: "Your High-Converting Booking Storefront",
    desc: "Custom booking portal with your branding, services, prices, durations, working hours, and real-time date/time slot picker.",
    urlExample: "docodo.in/book/your-business",
    highlights: ["Mobile Responsive", "Instant WhatsApp CTA", "No Customer App Install Needed", "15-Min Slot Lock Protection"],
    badge: "Core Feature",
  },
  {
    id: "service-catalogue",
    category: "B. Service Catalogue",
    title: "Dynamic Service & Price Management",
    desc: "Add, edit, reorder, price, and toggle active/inactive status for any service in 2 clicks.",
    highlights: ["Custom Durations", "Flexible Pricing (Free / Paid)", "Categories & Tags", "Instant Live Sync"],
    badge: "Essential",
  },
  {
    id: "booking-management",
    category: "C. Booking Management",
    title: "One Central Calendar for All Bookings",
    desc: "Live operational dashboard tracking today's appointments, upcoming reservations, completed visits, and cancellations.",
    highlights: ["1-Click Status: Confirm / Complete / Cancel", "No-Show Flagging", "Calendar & Daily List Views", "Staff Slot Assignment"],
    badge: "Productivity",
  },
  {
    id: "crm-database",
    category: "D. Customer Database / CRM",
    title: "Organized Client Profiles & Lifetime Value",
    desc: "Keep complete customer history: phone numbers, total visits, last appointment date, and lifetime revenue contribution.",
    highlights: ["VIP / Regular Customer Tiers", "Private Staff Notes", "Search by Name or Phone", "Exportable Client Lists"],
    badge: "Growth",
  },
  {
    id: "enquiry-pipeline",
    category: "E. Enquiry Management Pipeline",
    title: "Track Leads from First Message to Paid Client",
    desc: "Turn passive website and WhatsApp queries into a structured lead funnel.",
    pipeline: ["NEW", "CONTACTED", "BOOKED", "LOST"],
    highlights: ["Quick Follow-Up Buttons", "Zero Dropped Leads", "Conversion Rate Tracking"],
    badge: "Sales Pipeline",
  },
  {
    id: "whatsapp-engine",
    category: "F. WhatsApp Contact & Assistant",
    title: "Turn WhatsApp Conversations into Bookings",
    desc: "Direct 1-tap WhatsApp booking links with smart AI auto-replies, FAQ knowledge bases, and 1-click staff takeover.",
    highlights: ["24/7 Instant Responses", "Hinglish & Local Language Support", "1-Click Bot Pause for Staff Takeover", "Free 24h Meta Window"],
    badge: "AI Powered",
  },
  {
    id: "followup-automation",
    category: "G. Follow-up Automation",
    title: "Automated Reminders & Review Requests",
    desc: "Send automated 24-hour pre-appointment reminders and post-service Google review requests to double positive ratings.",
    highlights: ["Virtually Zero No-Shows", "Automated Rebooking Nudges", "Review Link Generator"],
    badge: "Automation",
  },
  {
    id: "payments-cod",
    category: "H. Payments & Reconciliation",
    title: "Accept UPI, Cards, NetBanking & Cash",
    desc: "Seamless Razorpay payment gateway integration with timing-safe HMAC validation plus Cash on Delivery tracking.",
    highlights: ["Direct UPI Intent (GPay, PhonePe, Paytm)", "Zero Payment Drop-Offs", "Automated Invoicing & Receipts"],
    badge: "Finance Ready",
  },
  {
    id: "growth-analytics",
    category: "I. Real Actionable Analytics",
    title: "Clear Business Metrics, Zero Vanity Stats",
    desc: "Monitor your gross booked revenue, completed appointments, repeat client retention rate, and peak booking days.",
    highlights: ["Weekly Trajectory Chart", "Average Customer Spend (LTV)", "Booking Form Conversion %"],
    badge: "Intelligence",
  },
];

export const BEFORE_AFTER = {
  before: [
    { title: "Instagram DMs & Scrambled Messages", desc: "Losing track of who wanted which time slot" },
    { title: "WhatsApp Chaos & Delayed Replies", desc: "Clients waiting hours for confirmation" },
    { title: "Phone Calls During Services", desc: "Interrupting current clients to take future bookings" },
    { title: "Paper Notebooks & Sticky Notes", desc: "Double bookings and illegible contact details" },
    { title: "Manual Unrecorded Follow-ups", desc: "No-shows and lost repeat business" },
    { title: "Missed Customers", desc: "Clients choosing competitors with instant booking links" },
  ],
  after: [
    { title: "One Professional Booking Link", desc: "Share on Instagram bio, WhatsApp, and Google Maps" },
    { title: "Services & Rates Online 24/7", desc: "Clients self-select services with transparent pricing" },
    { title: "Organized Customer Database", desc: "Auto-saved names, phone numbers, and visit history" },
    { title: "All Bookings in One Place", desc: "Live calendar with instant confirmation and status toggles" },
    { title: "Automated Reminders & Follow-ups", desc: "Fewer no-shows and higher rebooking retention" },
    { title: "Higher Revenue & Less Stress", desc: "Save 10+ hours every week on scheduling coordination" },
  ],
};

export const VERTICALS = [
  {
    id: "dental-clinics",
    slug: "clinics",
    name: "Dental Clinics & Dentists",
    icon: "Stethoscope",
    tagline: "OPD Appointments + Advance Tokens + Zero No-Shows",
    desc: "Let patients book teeth cleaning, root canal consultations, and emergency dental visits without rival ads.",
    popularServices: ["Dental Consultation", "Scaling & Polishing", "Root Canal Evaluation", "Teeth Whitening"],
    stat: "90% reduction in empty chairs",
  },
  {
    id: "dermatology",
    slug: "dermatology",
    name: "Dermatology & Skin Clinics",
    icon: "Sparkles",
    tagline: "Consultations + Laser Sessions + WhatsApp Reminders",
    desc: "Seamless appointment scheduling for acne treatments, skin consultations, and cosmetic dermatology.",
    popularServices: ["Skin & Hair Consultation", "Acne Therapy Review", "Laser Treatment Session", "Chemical Peel"],
    stat: "2x repeat patient retention",
  },
  {
    id: "general-physicians",
    slug: "general-physicians",
    name: "General Physicians & OPD",
    icon: "Stethoscope",
    tagline: "Queue-Free OPD + Slot Booking + Follow-Ups",
    desc: "Eliminate crowded waiting rooms. Patients book designated 15-minute consultation slots with ease.",
    popularServices: ["General Health Checkup", "Fever & Infection Review", "Chronic Care Follow-Up", "Second Opinion"],
    stat: "Zero waiting room crowding",
  },
  {
    id: "physiotherapy",
    slug: "physiotherapy",
    name: "Physiotherapy & Rehab Centers",
    icon: "HeartHandshake",
    tagline: "1-on-1 Rehab Slots + Treatment Packages",
    desc: "Organize patient rehab schedules, post-op recovery sessions, and pain management appointments.",
    popularServices: ["Initial Physio Assessment", "Back & Neck Pain Session", "Post-Op Rehabilitation", "Sports Injury Therapy"],
    stat: "100% upfront slot confirmation",
  },
  {
    id: "pediatrics",
    slug: "pediatrics",
    name: "Pediatrics & Child Care Clinics",
    icon: "HeartHandshake",
    tagline: "Child OPD + Vaccination Slot Management",
    desc: "Enable parents to book vaccination slots and pediatric consultations without waiting in line with sick children.",
    popularServices: ["Pediatric OPD Visit", "Vaccination Appointment", "Growth Milestone Checkup", "Infant Wellness Review"],
    stat: "50+ hours saved by reception",
  },
  {
    id: "ayurveda",
    slug: "ayurveda",
    name: "Ayurveda & Holistic Clinics",
    icon: "Sparkles",
    tagline: "Nadi Parikshan + Panchakarma Schedules",
    desc: "Manage doctor consultation slots, panchakarma therapy durations, and herbal lifestyle follow-ups.",
    popularServices: ["Nadi Parikshan", "Panchakarma Consultation", "Ayurvedic Diet & Lifestyle", "Stress Relief Therapy"],
    stat: "3x follow-up booking rate",
  },
  {
    id: "orthopedics",
    slug: "orthopedics",
    name: "Orthopedics & Joint Care",
    icon: "Stethoscope",
    tagline: "Specialist Consultations + X-Ray Reviews",
    desc: "Coordinate specialist joint consultations, arthritis management, and post-fracture review visits.",
    popularServices: ["Joint & Knee Consultation", "Fracture Follow-Up", "Spine Assessment", "Arthritis Care Review"],
    stat: "Zero double-booked doctor slots",
  },
  {
    id: "polyclinics",
    slug: "polyclinics",
    name: "Specialty Polyclinics & Centers",
    icon: "Stethoscope",
    tagline: "Multi-Doctor Schedules + Shared Reception",
    desc: "Unified booking system for polyclinics hosting multiple visiting consultants across specialties.",
    popularServices: ["Multi-Specialist Consultation", "Diagnostic Review", "Day-Care Procedure Slot", "Executive Health Check"],
    stat: "15-minute instant clinic launch",
  },
];
import { PRICING_PLANS as SOURCE_PRICING_PLANS } from "./plans-config";

export const PRICING_PLANS = SOURCE_PRICING_PLANS;

export const SOCIAL_PROOF = {
  badge: "Real Local Growth",
  headline: "Built for Real Indian Businesses, Not Silicon Valley Silicon-ware",
  disclaimer: "We are currently partnering with our first cohort of pilot businesses across Pune & Mumbai. No fake bot reviews or fabricated statistics.",
  pilotBenefits: [
    "Direct founder access & customized workflow setup",
    "Lifetime grandfathered pilot pricing",
    "Early access to automated WhatsApp voice & broadcast features",
  ],
};

export const FAQ_LIST = [
  {
    q: "What is Docodo?",
    a: "Docodo is an all-in-one patient appointment booking, customer management, and automated WhatsApp communication platform built specifically for Indian outpatient clinics, dental centers, and healthcare practitioners.",
  },
  {
    q: "Who is Docodo for?",
    a: "Docodo is designed for doctors, outpatient clinics, polyclinics, and healthcare specialists who currently manage appointments through WhatsApp messages, phone calls, or physical paper registers.",
  },
  {
    q: "Do our front-desk receptionists need technical skills?",
    a: "No, 10-second walk-in booking and WhatsApp alerts require zero training.",
  },
  {
    q: "Do WhatsApp messages come from our clinic's own number?",
    a: "Yes, official WhatsApp Cloud API integration links directly to your clinic's business number.",
  },
  {
    q: "How long does setup take?",
    a: "Under 15 minutes! You simply sign up, enter your clinic name, add consultation types with fees, configure OPD hours, and your live booking link (docodo.in/book/your-slug) is immediately ready to share.",
  },
  {
    q: "Do I need a separate website or domain?",
    a: "No! Docodo hosts your professional, mobile-responsive booking storefront on docodo.in/book/your-clinic. You can also embed it into an existing website or Google Business Profile.",
  },
  {
    q: "Can patients book through WhatsApp?",
    a: "Yes! Every Docodo clinic booking page includes an instant WhatsApp CTA. Plus, when patients book, they receive instant confirmation tokens, clinic directions, and reminders on WhatsApp.",
  },
  {
    q: "Can I manage and reschedule appointments from my phone?",
    a: "Yes. Your doctor dashboard is 100% mobile-responsive. You can confirm appointments, mark patients as completed or no-show, reschedule slots, and block off break times on the fly.",
  },
  {
    q: "Can I see patient history and past visits?",
    a: "Yes. The built-in CRM automatically tracks every patient by phone number, displaying their total visits, past appointment dates, consultation history, and lifetime visit records.",
  },
  {
    q: "Can I accept online consultation fees like UPI and cards?",
    a: "Yes. Docodo natively integrates with Razorpay to accept Google Pay, PhonePe, Paytm, credit/debit cards, and NetBanking. You can also allow Pay at Clinic (Cash / UPI at OPD counter).",
  },
  {
    q: "Does Docodo work well on mobile for my patients?",
    a: "Yes, 100%. The patient booking interface is mobile-first, lightweight, and requires no app downloads or password creation for your patients.",
  },
  {
    q: "Do patients need to download an app or create an account to book?",
    a: "No! Patients simply open your link, choose a consultation type, pick an available slot, enter their name and phone number, and confirm. Zero friction.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel or switch plans at any time with no lock-in contracts or cancellation penalties.",
  },
  {
    q: "Is there a free plan to test the platform?",
    a: "Yes! Our Clinic Pilot plan is 100% free with ₹0 setup fees so you can experience how easy it is to receive online bookings.",
  },
  {
    q: "How does the WhatsApp AI Assistant work?",
    a: "Our multi-provider AI assistant uses round-robin fallbacks (Groq, Gemini, Meta AI) to answer common clinic FAQs in Hindi, Marathi, or English. You or your receptionist can pause the bot with 1 click anytime to speak directly to your patient.",
  },
  {
    q: "Is patient data secure?",
    a: "Yes. All data is isolated by multi-tenant clinic IDs, encrypted with TLS/SSL, and stored on Indian servers compliant with the Digital Personal Data Protection (DPDP) Act 2023.",
  },
];

export const TRUST_SECURITY = [
  {
    title: "Isolated Multi-Tenant Security",
    desc: "Strict database-level row and tenant isolation ensures your customer records and financials can never be seen by other businesses.",
    icon: "ShieldCheck",
  },
  {
    title: "DPDP Act 2023 India Compliant",
    desc: "Customer personal data is stored securely on Indian servers with strict encryption at rest and in transit.",
    icon: "Server",
  },
  {
    title: "Timing-Safe Payment Security",
    desc: "Razorpay webhooks and payment captures are verified using constant-time cryptographic HMAC SHA-256 signatures.",
    icon: "Lock",
  },
  {
    title: "Double-Booking Prevention",
    desc: "Serializable database transactions and 15-minute slot ghost-locks guarantee no two customers can ever reserve the same slot.",
    icon: "CheckCircle2",
  },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Live Demo", href: "/demo" },
    { label: "Growth Tools", href: "/tools" },
  ],
  solutions: [
    { label: "For Dental Clinics", href: "/for/clinics" },
    { label: "For Dermatology & Skin", href: "/for/dermatology" },
    { label: "For General Physicians & OPD", href: "/for/general-physicians" },
    { label: "For Physiotherapy Centers", href: "/for/physiotherapy" },
    { label: "For Pediatrics & Child Care", href: "/for/pediatrics" },
    { label: "For Ayurveda & Wellness", href: "/for/ayurveda" },
    { label: "For Orthopedics & Joint Care", href: "/for/orthopedics" },
    { label: "For Specialty Polyclinics", href: "/for/polyclinics" },
  ],
  company: [
    { label: "About Docodo", href: "/about" },
    { label: "Partner Program", href: "/partners" },
    { label: "Contact Us", href: "/contact" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Care Plans", href: "/care-plans" },
    { label: "Engineering Blog", href: "https://medium.com/@ameyakshirsagar02" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "DPDP Data Compliance", href: "/privacy" },
  ],
  account: [
    { label: "Merchant Login", href: "/auth/login" },
    { label: "Create Account", href: "/auth/signup" },
    { label: "15-Min Onboarding", href: "/onboarding" },
    { label: "Forgot Password", href: "/auth/forgot" },
  ],
};

// ─── LEGACY COMPATIBILITY EXPORTS ─────────────────────────────────────────────

export const TOOLS = [
  {
    id: "whatsapp-nurturer",
    name: "WhatsApp AI Nurturer",
    badge: "Free to Start",
    description: "Replies to every lead in 60 seconds. 24/7. In Hinglish if needed.",
    stat: "40% fewer missed leads",
    cta: "Try Free",
    href: "/tools/whatsapp-nurturer",
  },
  {
    id: "content-repurposer",
    name: "Content Repurposer",
    badge: "Free to Start",
    description: "One YouTube video becomes a blog post, 5 reels, a carousel, and a newsletter.",
    stat: "Saves 12 hrs/week",
    cta: "Try Free",
    href: "/tools/content-repurposer",
  },
  {
    id: "review-requester",
    name: "Auto Review Requester",
    badge: "From ₹499/mo",
    description: "14 days after service → auto-WhatsApp → one-tap Google review link.",
    stat: "2x review count in 30 days",
    cta: "Learn More",
    href: "/care-plans",
  },
  {
    id: "roi-reporter",
    name: "Weekly ROI Reporter",
    badge: "From ₹999/mo",
    description: "Every Monday, clients get a branded PDF: leads, replies, top source.",
    stat: "95% client retention",
    cta: "Learn More",
    href: "/care-plans",
  },
  {
    id: "proposal-generator",
    name: "AI Proposal Generator",
    badge: "From ₹799/mo",
    description: "Paste your meeting notes. Get a full proposal in 30 seconds.",
    stat: "3 hrs → 30 seconds",
    cta: "Learn More",
    href: "/tools",
  },
  {
    id: "care-plans",
    name: "Docodo Care Plans",
    badge: "Most Popular",
    badgeVariant: "lime",
    description: "The complete AI growth stack. Done-for-you. Monthly subscription.",
    stat: "From ₹2,499/mo",
    cta: "See Plans →",
    href: "/care-plans",
    featured: true,
  },
];

export const CARE_PLANS = [
  {
    id: "starter",
    tier: "Starter",
    name: "WhatsApp Bot",
    description: "For outpatient clinics and doctor practices just getting started with automated appointment management.",
    monthlyPrice: 2499,
    annualPrice: 1999,
    accent: "#6C9FFF",
    features: [
      "WhatsApp bot — leads, FAQs, booking",
      "1,000 conversations/mo on WhatsApp API",
      "Lead capture form on website",
      "Monthly report — leads, replies, traffic",
      "48-hr setup & onboarding call",
      "Bot tweaks & updates included",
    ],
    cta: "Get Started →",
  },
  {
    id: "growth",
    tier: "Growth",
    name: "Full Growth OS",
    description: "The complete stack — bots, SEO, social & monthly AI content.",
    monthlyPrice: 4999,
    annualPrice: 3999,
    accent: "#C8F135",
    popular: true,
    features: [
      "WhatsApp + Instagram DM automation",
      "Google Business Profile weekly auto-posts",
      "Local SEO report — rankings & competitors",
      "4 AI-written social posts/mo + Canva creatives",
      "Email nurture sequence — 5 auto-emails",
      "Razorpay auto-billing setup",
      "CRM dashboard — all leads in one view",
      "Priority WhatsApp support",
    ],
    cta: "Start Growing →",
  },
  {
    id: "pro",
    tier: "Pro",
    name: "AI Content Engine",
    description: "Full AI content output. Dominate Pune search & social.",
    monthlyPrice: 9999,
    annualPrice: 7999,
    accent: "#FF8C5A",
    features: [
      "12 AI blog posts/mo — SEO optimised",
      "8 reel scripts + Canva creatives/mo",
      "Google Ads setup & monthly optimisation",
      "Full CRM automation — lead routing, alerts",
      "Competitor tracking — weekly alert digest",
      "Quarterly strategy call with founder",
      "Custom AI chatbot trained on your business",
      "Dedicated Docodo account manager",
    ],
    cta: "Go Pro →",
  },
];

export const CASE_STUDIES = [
  {
    id: "biogram-health",
    company: "BIOgram Health",
    industry: "Healthcare OPD",
    metric: "40% fewer missed patient leads",
    quote: "Before Docodo, we were losing patient leads at night constantly. Now our WhatsApp replies 24/7 and every lead is logged in our OPD queue.",
    before: "~15 missed patient leads/week",
    after: "~2 missed patient leads/week",
    plan: "Growth Care Plan",
  },
  {
    id: "patangankar-clinic",
    company: "Dr. Patangankar Clinic",
    industry: "Dental Clinic",
    metric: "30% fewer appointment no-shows",
    quote: "The automated appointment reminders reduced no-shows significantly. Patients appreciate the clear WhatsApp token and directions.",
    before: "6–8 no-shows/week",
    after: "3–4 no-shows/week",
    plan: "Starter Care Plan",
  },
];

export const WHY_DOCODO = [
  {
    title: "Data Stays in India",
    description: "Self-hosted on Indian VPS. Your client data never leaves India. DPDP Act 2023 compliant — something cloud BSPs can't say.",
    icon: "Globe",
  },
  {
    title: "Claude AI (Not Rule-Based)",
    description: "We use Anthropic Claude — the same AI that powers ₹10k+/mo enterprise tools. Your bot actually understands context, not just keywords.",
    icon: "Brain",
  },
  {
    title: "Founder Eats His Own Dogfood",
    description: "Docodo.in runs on the exact same WhatsApp bot and automations we sell. Every case study starts from our own results.",
    icon: "Wrench",
  },
  {
    title: "48-Hour Setup, Not 2 Weeks",
    description: "Most agencies ask for a 'kickoff call next Thursday.' We're live on your WhatsApp within 48 hours of payment.",
    icon: "Zap",
  },
  {
    title: "WhatsApp-First Support",
    description: "Your account manager is on WhatsApp. Not Zendesk. Not a 3-business-day email response. Real replies.",
    icon: "MessageSquare",
  },
  {
    title: "Transparent ROI Reports",
    description: "Every Monday you get a plain-English report: leads handled, replies sent, top source, estimated revenue impact.",
    icon: "BarChart3",
  },
];

export const CONTENT_HUB = {
  youtube: [
    { title: "AI Automation for Pune SMBs", duration: "12:45", thumbnail: "/images/yt-1.jpg", href: "#" },
    { title: "How to setup a WhatsApp Bot", duration: "08:20", thumbnail: "/images/yt-2.jpg", href: "#" },
    { title: "2026 AI Growth Strategy", duration: "15:10", thumbnail: "/images/yt-3.jpg", href: "#" },
  ],
  podcast: [
    { title: "EP 42: Scaling with AI", duration: "45m", href: "#" },
    { title: "EP 41: Local SEO in 2026", duration: "38m", href: "#" },
    { title: "EP 40: The ROI of Automation", duration: "52m", href: "#" },
  ],
  blog: [
    { title: "DPDP Act 2023 for Small Businesses", readTime: "5 min", href: "#" },
    { title: "Why your business needs a WhatsApp bot", readTime: "4 min", href: "#" },
    { title: "Pune AI Market Trends", readTime: "7 min", href: "#" },
  ],
};
