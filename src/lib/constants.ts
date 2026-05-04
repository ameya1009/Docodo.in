export const CONTACT = {
  whatsapp: "91XXXXXXXXXX",
  email: "hello@docodo.in",
  location: "Pune, Maharashtra, India",
  youtube: "https://youtube.com/@docodo",
  spotify: "https://spotify.com/docodo",
  medium: "https://medium.com/@ameyakshirsagar02",
  linkedin: "https://linkedin.com/company/docodo",
  twitter: "https://twitter.com/docodo_in",
};

export const WHATSAPP_LINK = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Care Plans", href: "/care-plans" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "https://medium.com/@ameyakshirsagar02" },
];

export const HERO_CONTENT = {
  eyebrow: "AI Growth OS · Pune, India · Now Live Globally",
  headline: {
    line1: "Turn Your Business",
    line2: "Into an AI Machine",
  },
  subheadline: "WhatsApp AI that replies at 3am. Content that writes itself. Reports that auto-send. Care Plans from ₹2,499/mo. No lock-in.",
  trustTicker: [
    "47 Pune Businesses",
    "₹23L+ Revenue Generated",
    "98% Bot Reply Rate",
    "40% Fewer Missed Leads",
    "Self-Hosted India Data",
    "DPDP Compliant",
  ],
};

export const PAIN_POINTS = [
  {
    id: "missed-lead",
    title: "The Missed Lead",
    headline: "40% of WhatsApp leads are lost because nobody replied in time.",
    sub: "Your competitor replied in 60 seconds. You replied the next morning.",
    messages: [
      { text: "Hi, is appointment available tomorrow?", type: "in" },
      { text: "Anyone there?", type: "in" },
      { text: "Never mind, going to XYZ clinic", type: "in" },
    ],
  },
  {
    id: "excel-chaos",
    title: "The Excel Chaos",
    headline: "Manual CRM = forgotten follow-ups = ₹20,000+ lost every month.",
    sub: "A scattered spreadsheet is not a growth system. It's a risk.",
  },
  {
    id: "burnout",
    title: "The 4-Job Burnout",
    headline: "You're doing 4 jobs. You should be doing 1.",
    sub: "Automation isn't a luxury. It's the only way to grow without burning out.",
  },
];

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

export const WHATSAPP_DEMO = {
  responses: [
    { trigger: "price", response: "Our Care Plans start from ₹2,499/mo. Would you like to see the full list?" },
    { trigger: "time", response: "We have slots available tomorrow at 11am and 4pm. Which one works for you?" },
    { trigger: "slot", response: "I can check the schedule for you. Are you a new or returning client?" },
    { trigger: "appointment", response: "Sure! I can help you book that. Which service are you interested in?" },
    { trigger: "location", response: "We are located in Viman Nagar, Pune. Would you like the Google Maps link?" },
    { trigger: "address", response: "Our main office is in Pune. I can send you the exact location on WhatsApp!" },
  ],
  fallback: "Thanks! Let me connect you with our team. Can I get your name?",
};

export const CARE_PLANS = [
  {
    id: "starter",
    tier: "Starter",
    name: "WhatsApp Bot",
    description: "For salons, clinics & cafes just getting started with automation.",
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
    industry: "Healthcare",
    metric: "40% fewer missed leads",
    quote: "Before Docodo, we were losing leads at night constantly. Now our WhatsApp replies 24/7 and every lead is logged.",
    before: "~15 missed leads/week",
    after: "~2 missed leads/week",
    plan: "Growth Care Plan",
  },
  {
    id: "patangankar-clinic",
    company: "Dr. Patangankar Clinic",
    industry: "Dental Clinic",
    metric: "30% fewer no-shows",
    quote: "The automated appointment reminder reduced no-shows dramatically. Patients love the WhatsApp confirmation.",
    before: "6–8 no-shows/week",
    after: "3–4 no-shows/week",
    plan: "Starter Care Plan",
  },
  {
    id: "viman-nagar-cafe",
    company: "Viman Nagar Cafe",
    industry: "F&B",
    metric: "60 bookings in one day",
    quote: "One WhatsApp broadcast for our Diwali offer. 60 table bookings in 24 hours. Zero ad spend.",
    before: "Manual calls for every reservation",
    after: "WhatsApp bot handles all bookings",
    plan: "Growth Care Plan",
  },
  {
    id: "baner-salon",
    company: "Baner Salon",
    industry: "Beauty & Wellness",
    metric: "2× review count",
    quote: "The auto review requester was the best feature. Our Google rating jumped from 3.8 to 4.6 in 30 days.",
    before: "3.8 ★ (22 reviews)",
    after: "4.6 ★ (51 reviews)",
    plan: "Starter + Review Add-on",
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
