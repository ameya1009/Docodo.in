import React from "react";

export const CONTACT = {
  whatsapp: "919284310604",
  email: "ameyakshirsagar@docodo.in",
  location: "Pune & Mumbai, Maharashtra, India",
  youtube: "https://youtube.com/@docodo",
  spotify: "https://spotify.com/docodo",
  medium: "https://medium.com/@ameyakshirsagar02",
  linkedin: "https://linkedin.com/company/docodo",
  twitter: "https://twitter.com/docodo_in",
};


export const WHATSAPP_LINK = (text: string) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAVIGATION = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Solutions", href: "/solutions" },
  { label: "Live Demo", href: "/demo" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const HERO_CONTENT = {
  eyebrow: "The All-in-One Operating System for Local Services",
  headline: {
    line1: "Turn enquiries into bookings",
    line2: "in 15 minutes.",
  },
  subheadline: "Docodo gives local service businesses a professional booking page, customer management, and simple automation—without complicated setup.",
  primaryCTA: "Start for Free",
  secondaryCTA: "See How It Works",
  pilotBadge: "Join Our Pilot Program (₹0 Setup)",
  trustTicker: [
    "15-Min Instant Onboarding",
    "Zero Setup Fees for Pilots",
    "DPDP India Data Compliant",
    "Self-Hosted Indian Server",
    "Zero Double-Booking Guarantee",
    "UPI & Cash on Delivery Ready",
  ],
};

export const PROBLEM_SECTION = {
  headline: "The Daily Struggle of Growing a Local Service Business",
  subheadline: "How revenue slips away every single day through scattered channels.",
  flow: [
    { title: "Instagram DM / Reel", desc: "Customer discovers you", icon: "Instagram" },
    { title: "WhatsApp Message", desc: "\"Are you available tomorrow?\"", icon: "MessageSquare" },
    { title: "Delayed Reply", desc: "You're busy serving another client", icon: "Clock" },
    { title: "Lost Customer", desc: "They booked your competitor instead", icon: "UserX" },
  ],
  painPoints: [
    {
      id: "missed-enquiries",
      title: "Missed WhatsApp Enquiries",
      desc: "40% of enquiries come while you are busy or closed. Delayed replies lead directly to lost bookings.",
      icon: "MessageSquareOff",
    },
    {
      id: "manual-management",
      title: "Manual Appointment Chaos",
      desc: "Juggling physical notebooks, calendar apps, and WhatsApp chats causes overlapping bookings and stress.",
      icon: "CalendarX",
    },
    {
      id: "repetitive-questions",
      title: "Repetitive Pricing Questions",
      desc: "Answering 'What are your rates?' and 'Where are you located?' 20 times a day drains your productive time.",
      icon: "HelpCircle",
    },
    {
      id: "unorganized-database",
      title: "No Organized Customer Database",
      desc: "Customer names, phone numbers, and past visit histories are scattered across chat threads without records.",
      icon: "Database",
    },
    {
      id: "forgotten-followups",
      title: "Forgetting Follow-Ups & Reminders",
      desc: "No-shows hurt margins. Without automated reminders, clients forget their slots and don't rebook.",
      icon: "BellOff",
    },
    {
      id: "no-booking-link",
      title: "No Simple Booking Link",
      desc: "Clients want to pick a slot and book in 30 seconds without waiting for 10 back-and-forth messages.",
      icon: "Link2Off",
    },
  ],
};

export const SETUP_STEPS = [
  {
    step: "01",
    title: "Tell us about your business",
    desc: "Enter your business name, industry (Salon, Clinic, Gym, Tutor), city, and WhatsApp number.",
    time: "2 mins",
  },
  {
    step: "02",
    title: "Add your services",
    desc: "List your core offerings, durations, and prices (e.g. Hair Spa ₹500, Consultation ₹800).",
    time: "4 mins",
  },
  {
    step: "03",
    title: "Set your availability",
    desc: "Configure working hours and break slots so customers can only book when you're open.",
    time: "3 mins",
  },
  {
    step: "04",
    title: "Publish your booking page",
    desc: "Get your personalized URL: docodo.in/book/your-business ready to share on Instagram & WhatsApp.",
    time: "1 min",
  },
  {
    step: "05",
    title: "Start accepting bookings",
    desc: "Receive instant notifications, manage your calendar, and track revenue from your dashboard.",
    time: "Live!",
  },
];

export const DEMO_WORKFLOW = {
  businessOwner: [
    { label: "1. Creates Business", detail: "Baner Luxury Hair Studio" },
    { label: "2. Adds Haircut & Spa", detail: "₹500 • 45 mins" },
    { label: "3. Sets Availability", detail: "10:00 AM – 08:00 PM" },
    { label: "4. Publishes Live Link", detail: "docodo.in/book/baner-studio" },
  ],
  customer: [
    { label: "1. Opens Shared Link", detail: "From Instagram Bio / WhatsApp" },
    { label: "2. Selects Haircut & Spa", detail: "Views clear pricing & duration" },
    { label: "3. Chooses Slot", detail: "Tomorrow at 03:30 PM" },
    { label: "4. Confirms with Phone", detail: "Instant SMS/WhatsApp receipt" },
  ],
  dashboard: [
    { label: "1. Real-Time Alert", detail: "New Booking: Rahul S. (₹500)" },
    { label: "2. Slot Auto-Blocked", detail: "03:30 PM slot marked busy" },
    { label: "3. CRM Profile Created", detail: "Customer history updated" },
    { label: "4. Auto-Reminder Scheduled", detail: "24h pre-appointment alert" },
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
    highlights: ["98% Show-up Rate", "Automated Rebooking Nudges", "Review Link Generator"],
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
    id: "salons",
    slug: "salons",
    name: "Salons & Hair Studios",
    icon: "Scissors",
    tagline: "Bookings + Services + Customer Management",
    desc: "Let clients choose stylists, pick haircut/spa packages, and receive automated WhatsApp reminders.",
    popularServices: ["Haircut & Styling", "Hair Spa & Keratin", "Beard Grooming", "Bridal Makeup"],
    stat: "40% fewer no-shows",
  },
  {
    id: "spas",
    slug: "spas",
    name: "Spas & Wellness Centers",
    icon: "Sparkles",
    tagline: "Appointments + Reminders + Repeat Clients",
    desc: "Manage massage rooms, therapy durations, package upselling, and post-session review collection.",
    popularServices: ["Swedish Massage", "Deep Tissue Therapy", "Aromatherapy", "Facials & Skin Detox"],
    stat: "2x Google 5-star reviews",
  },
  {
    id: "clinics",
    slug: "clinics",
    name: "Doctors & Specialty Clinics",
    icon: "Stethoscope",
    tagline: "Patient Appointments + Frictionless Booking",
    desc: "Provide patients with hassle-free consultation slot booking, clinic address directions, and SMS confirmations.",
    popularServices: ["General Consultation", "Dental Checkup", "Physiotherapy Session", "Follow-up Visit"],
    stat: "Zero waiting room crowding",
  },
  {
    id: "gyms",
    slug: "gyms",
    name: "Gyms & Fitness Studios",
    icon: "Dumbbell",
    tagline: "Class Bookings + Trial Enquiries + Lead CRM",
    desc: "Allow prospects to book free day passes, trial sessions, and personal training slots instantly.",
    popularServices: ["Free 1-Day Pass", "Personal Training Intro", "Zumba / Yoga Class", "Body Composition Analysis"],
    stat: "3x trial pass conversions",
  },
  {
    id: "trainers",
    slug: "trainers",
    name: "Personal Trainers & Coaches",
    icon: "Trophy",
    tagline: "1-on-1 Sessions + Schedule Management",
    desc: "Share your schedule link with clients, block out workout times, and collect session payments upfront.",
    popularServices: ["1-on-1 Workout", "Diet & Nutrition Consultation", "Online Form Check", "Monthly Coaching Package"],
    stat: "100% upfront payment collection",
  },
  {
    id: "tutors",
    slug: "tutors",
    name: "Tutors & Coaching Institutes",
    icon: "GraduationCap",
    tagline: "Demo Classes + Batch Schedules + Enquiries",
    desc: "Organize demo class bookings, batch schedule selection, and parent communication effortlessly.",
    popularServices: ["Free Demo Class", "Doubt Clearing Session", "Monthly Batch Enrollment", "Career Guidance"],
    stat: "Zero lost student leads",
  },
  {
    id: "beauty-businesses",
    slug: "beauty-businesses",
    name: "Beauty & Nail Studios",
    icon: "HeartHandshake",
    tagline: "Service Catalog + Photo Showcase + Booking",
    desc: "Showcase nail art, lash extensions, and makeup packages with clear time slots and pricing.",
    popularServices: ["Gel Nail Art", "Lash Extensions", "Party Makeup", "Manicure & Pedicure"],
    stat: "50+ hours saved monthly",
  },
  {
    id: "local-service-businesses",
    slug: "local-service-businesses",
    name: "Local Service Professionals",
    icon: "Wrench",
    tagline: "Appointments + Leads + Fast Coordination",
    desc: "For car detailing, pet groomers, photographers, and home service providers needing a simple booking link.",
    popularServices: ["Car Spa & Detailing", "Pet Grooming Package", "Portrait Photoshoot", "Home AC Service"],
    stat: "15-minute quick launch",
  },
];

export const PRICING_PLANS = [
  {
    id: "pilot",
    name: "Pilot / Community",
    badge: "Free for Pilots",
    price: "₹0",
    period: "forever",
    description: "For testing Docodo and getting your business online with zero upfront cost.",
    features: [
      "Custom booking page (docodo.in/book/your-business)",
      "Up to 50 bookings / month",
      "Full Service & Price catalog",
      "Working hours & availability management",
      "Customer database (CRM)",
      "Instant WhatsApp booking link CTA",
      "Self-hosted Indian data protection",
    ],
    cta: "Join Pilot Program",
    ctaHref: "/auth/signup",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    badge: "Most Popular for Solo Pros",
    price: "₹999",
    period: "per month",
    description: "Everything a growing local business needs to automate bookings and CRM.",
    features: [
      "Unlimited bookings & services",
      "Custom branded booking storefront",
      "Full Booking Management Dashboard",
      "Customer CRM with Lifetime Spend (LTV)",
      "Enquiry pipeline (New, Contacted, Booked)",
      "Automated WhatsApp & Email confirmations",
      "Razorpay UPI & Online payment gateway",
      "Priority WhatsApp support",
    ],
    cta: "Start 14-Day Free Trial",
    ctaHref: "/auth/signup",
    popular: true,
  },
  {
    id: "growth",
    name: "Growth",
    badge: "For Established Clinics & Salons",
    price: "₹2,499",
    period: "per month",
    description: "Advanced AI automation, multi-staff allocation, and automated review collection.",
    features: [
      "Everything in Starter plan",
      "Multi-staff schedule & room assignment",
      "Automated 24hr pre-visit reminders (reduces no-shows)",
      "Automated Google Review collection sequences",
      "AI Marketing Content Generator (Instagram & WhatsApp)",
      "Revenue analytics & booking conversion reports",
      "Multi-provider round-robin AI assistant",
      "Dedicated account manager on WhatsApp",
    ],
    cta: "Get Growth Plan",
    ctaHref: "/auth/signup",
    popular: false,
  },
  {
    id: "setup-service",
    name: "Done-For-You Setup",
    badge: "Concierge Onboarding",
    price: "₹4,999",
    period: "one-time",
    description: "We set up your entire business, upload your services, configure hours, and create your QR cards.",
    features: [
      "1-on-1 Onboarding Specialist assigned",
      "Complete menu / service catalogue upload",
      "Custom QR code printable counter stand design",
      "WhatsApp business profile optimization",
      "Staff training video call (30 mins)",
      "Includes 1 Month of Growth Plan for free",
    ],
    cta: "Request Setup Service",
    ctaHref: "/contact",
    popular: false,
  },
];

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
    a: "Docodo is an all-in-one booking, customer management, and simple automation platform built specifically for Indian local service businesses like salons, clinics, gyms, tutors, and spas.",
  },
  {
    q: "Who is Docodo for?",
    a: "Docodo is designed for appointment-based local business owners, service professionals, doctors, trainers, and freelancers who currently manage bookings through WhatsApp messages, phone calls, or physical notebooks.",
  },
  {
    q: "How long does setup take?",
    a: "Under 15 minutes! You simply sign up, enter your business name, add your services with prices, configure your open hours, and your live booking link (docodo.in/book/your-slug) is immediately ready to share.",
  },
  {
    q: "Do I need a separate website or domain?",
    a: "No! Docodo hosts your professional, mobile-responsive booking storefront on docodo.in/book/your-business. You can also embed it into an existing website if you already have one.",
  },
  {
    q: "Can customers book through WhatsApp?",
    a: "Yes! Every Docodo booking page includes an instant WhatsApp CTA. Plus, when clients book, they receive instant confirmation details on WhatsApp and SMS.",
  },
  {
    q: "Can I manage and reschedule bookings from my phone?",
    a: "Yes. Your merchant dashboard is 100% mobile-responsive. You can confirm appointments, mark clients as completed or no-show, reschedule slots, and block off break times on the fly.",
  },
  {
    q: "Can I see customer history and past visits?",
    a: "Yes. The built-in CRM automatically tracks every customer by phone number, displaying their total visits, past appointment dates, services received, and lifetime spend.",
  },
  {
    q: "Can I accept online payments like UPI and cards?",
    a: "Yes. Docodo natively integrates with Razorpay to accept Google Pay, PhonePe, Paytm, credit/debit cards, and NetBanking. You can also allow Cash on Delivery (Pay at Clinic/Salon).",
  },
  {
    q: "Does Docodo work well on mobile for my customers?",
    a: "Yes, 100%. The customer booking interface is mobile-first, lightweight, and requires no app downloads or password creation for your clients.",
  },
  {
    q: "Do customers need to download an app or create an account to book?",
    a: "No! Customers simply open your link, choose a service, pick a date/time, enter their name and phone number, and book. Zero friction.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel or switch plans at any time with no lock-in contracts or cancellation penalties.",
  },
  {
    q: "Is there a free plan to test the platform?",
    a: "Yes! Our Pilot / Community plan is 100% free with ₹0 setup fees so you can experience how easy it is to receive online bookings.",
  },
  {
    q: "How does the WhatsApp AI Assistant work?",
    a: "Our multi-provider AI assistant uses round-robin fallbacks (Groq, Gemini, Meta AI) to answer common FAQs in Hindi, Marathi, or English. You can pause the bot with 1 click anytime to speak directly to your client.",
  },
  {
    q: "Is my customer data secure?",
    a: "Yes. All data is isolated by multi-tenant business IDs, encrypted with TLS/SSL, and stored on Indian servers compliant with the Digital Personal Data Protection (DPDP) Act 2023.",
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
    { label: "For Salons", href: "/for/salons" },
    { label: "For Spas & Wellness", href: "/for/spas" },
    { label: "For Clinics & Doctors", href: "/for/clinics" },
    { label: "For Gyms & Fitness", href: "/for/gyms" },
    { label: "For Personal Trainers", href: "/for/trainers" },
    { label: "For Tutors & Academies", href: "/for/tutors" },
    { label: "For Beauty Businesses", href: "/for/beauty-businesses" },
    { label: "For Local Services", href: "/for/local-service-businesses" },
  ],
  company: [
    { label: "About Docodo", href: "/about" },
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
