/**
 * Docodo Autonomous Revenue OS — Product/Service Catalogue Brain
 * Central catalogue of all Docodo solutions, capabilities, pricing, objection handling, and cross-sell rules.
 */

export interface DocodoProduct {
  id: string;
  name: string;
  category:
    | "Website solutions"
    | "Booking system"
    | "CRM"
    | "Lead management"
    | "WhatsApp automation"
    | "AI WhatsApp assistant"
    | "Local SEO"
    | "Marketing automation"
    | "AI content generation"
    | "Review automation"
    | "Analytics"
    | "Payments"
    | "Customer retention"
    | "Done-for-you onboarding/setup"
    | "Custom business automation"
    | "Custom AI solutions";
  description: string;
  capabilities: string[];
  targetIndustries: string[];
  targetBusinessSize: ("solo" | "small_team" | "multi_branch" | "enterprise")[];
  problemsSolved: string[];
  features: string[];
  dependencies?: string[];
  pricing: {
    monthlyINR: number;
    annualINR: number;
    setupFeeINR: number;
    maxDiscountPercent: number;
  };
  implementationTimeDays: number;
  eligibility: string[];
  upsellRelationships: string[];
  crossSellRelationships: string[];
  proofPoints: string[];
  caseStudies: Array<{ businessType: string; result: string; metric: string }>;
  faqs: Array<{ question: string; answer: string }>;
  salesArguments: string[];
  objections: Array<{ objection: string; rebuttal: string }>;
  limitations: string[];
}

export class ProductCatalogAgent {
  private products: Map<string, DocodoProduct> = new Map();

  constructor() {
    this.seedDefaultCatalog();
  }

  private seedDefaultCatalog(): void {
    const defaultCatalog: DocodoProduct[] = [
      {
        id: "prod_whatsapp_ai",
        name: "WhatsApp AI Receptionist",
        category: "AI WhatsApp assistant",
        description: "24/7 intelligent conversational AI receptionist that qualifies leads, answers questions, and confirms bookings instantly via WhatsApp.",
        capabilities: ["Instant reply in < 3s", "Multi-lingual Hindi/English/Hinglish", "Calendar slot sync", "Payment link dispatch", "Staff handoff alert"],
        targetIndustries: ["Salons & Spas", "Aesthetic Clinics", "Fitness & Gyms", "Pet Grooming", "Home Services", "Dental Clinics"],
        targetBusinessSize: ["solo", "small_team", "multi_branch"],
        problemsSolved: [
          "Manual DM/WhatsApp reply delays causing lost customers",
          "After-hours inquiries going unanswered (40%+ of demand)",
          "Double-booking and scheduling confusion",
        ],
        features: ["Smart slot suggestions", "Automatic reminder triggers", "1-click human takeover", "Custom service menu integration"],
        pricing: { monthlyINR: 2499, annualINR: 23990, setupFeeINR: 1999, maxDiscountPercent: 15 },
        implementationTimeDays: 1,
        eligibility: ["Active WhatsApp Business number", "Defined service menu with prices"],
        upsellRelationships: ["prod_review_seo", "prod_growth_bundle"],
        crossSellRelationships: ["prod_crm_nurture"],
        proofPoints: ["Average 18% lift in confirmed bookings within 14 days", "Response time reduced from 4.2 hours to 4 seconds"],
        caseStudies: [
          { businessType: "Baner Hair Salon", result: "38 extra bookings in month 1 from night-time inquiries", metric: "+₹76,000 revenue" },
        ],
        faqs: [
          { question: "Can our staff take over when needed?", answer: "Yes! Staff can reply anytime in the WhatsApp chat; the AI detects human messages and pauses automatically." },
        ],
        salesArguments: [
          "42% of customer inquiries arrive after 7 PM when staff is offline. Docodo ensures zero revenue leaks.",
        ],
        objections: [
          { objection: "Our customers prefer talking to real people.", rebuttal: "Docodo handles the repetitive slot checks instantly so your staff can focus 100% on providing great customer service in person." },
        ],
        limitations: ["Requires Meta Cloud API or QR connected WhatsApp session."],
      },
      {
        id: "prod_booking_engine",
        name: "Docodo Instant Booking & Calendar Sync",
        category: "Booking system",
        description: "Ultra-fast, mobile-optimized online booking storefront that allows clients to choose staff, service, and time slot with zero friction.",
        capabilities: ["Google Calendar 2-way sync", "Staff shift management", "Deposit / full payment capture", "SMS/WhatsApp confirmations"],
        targetIndustries: ["Salons & Spas", "Clinics", "Consultants", "Tattoo Studios", "Photography Studios"],
        targetBusinessSize: ["solo", "small_team", "multi_branch"],
        problemsSolved: [
          "No online booking portal on website/Instagram",
          "Client no-shows and last-minute cancellations",
          "Back-and-forth messaging to find open slots",
        ],
        features: ["Custom branding", "Service add-on selector", "Automated cancellation policy enforcement", "Customer self-reschedule portal"],
        pricing: { monthlyINR: 1999, annualINR: 19990, setupFeeINR: 999, maxDiscountPercent: 10 },
        implementationTimeDays: 1,
        eligibility: ["List of services, durations, and pricing"],
        upsellRelationships: ["prod_whatsapp_ai"],
        crossSellRelationships: ["prod_review_seo"],
        proofPoints: ["Reduces scheduling admin time by 10+ hours per week per staff member"],
        caseStudies: [
          { businessType: "Kothrud Dental Care", result: "No-show rate dropped from 22% to under 4%", metric: "18% no-show drop" },
        ],
        faqs: [
          { question: "Does it sync with our personal Google Calendars?", answer: "Yes, 2-way real-time sync prevents any conflicting personal or work appointments." },
        ],
        salesArguments: ["Clients booking at midnight expect instant slot confirmation, not 'we will check tomorrow'."],
        objections: [
          { objection: "We use a paper diary and it works fine.", rebuttal: "A paper diary cannot take bookings while you sleep or send automated reminder messages to stop no-shows." },
        ],
        limitations: ["Requires internet connectivity for live sync."],
      },
      {
        id: "prod_review_seo",
        name: "Google Review & Local SEO Engine",
        category: "Review automation",
        description: "Automated post-appointment review engine that boosts Google Maps ranking by collecting verified 5-star reviews via WhatsApp.",
        capabilities: ["Automated review request trigger", "Private feedback trap for < 4 stars", "Google Business Profile sync", "Review response AI"],
        targetIndustries: ["Local Service Businesses", "Salons", "Clinics", "Restaurants", "Automotive"],
        targetBusinessSize: ["solo", "small_team", "multi_branch"],
        problemsSolved: [
          "Low review count on Google Maps",
          "Competitors ranking higher in local search",
          "Unhappy customers posting public negative reviews",
        ],
        features: ["Direct 1-tap Google Review link", "Smart timing (2h post-service)", "Negative sentiment alerting"],
        pricing: { monthlyINR: 1499, annualINR: 14990, setupFeeINR: 499, maxDiscountPercent: 10 },
        implementationTimeDays: 1,
        eligibility: ["Active Google Business Profile"],
        upsellRelationships: ["prod_growth_bundle"],
        crossSellRelationships: ["prod_whatsapp_ai", "prod_booking_engine"],
        proofPoints: ["Average 35+ verified 5-star reviews generated in first 30 days"],
        caseStudies: [
          { businessType: "Viman Nagar Spa", result: "Rose from #7 to #1 on Google Maps in 45 days", metric: "+120 reviews" },
        ],
        faqs: [
          { question: "Is this compliant with Google's review policy?", answer: "100% compliant. We simply prompt satisfied real customers with an easy direct link." },
        ],
        salesArguments: ["88% of local consumers choose the top-3 ranked businesses with 50+ recent reviews."],
        objections: [
          { objection: "We ask customers verbally already.", rebuttal: "Verbal requests convert at under 5%. A WhatsApp prompt while satisfaction is high converts at over 32%." },
        ],
        limitations: ["Requires customer phone number collected at checkout."],
      },
      {
        id: "prod_growth_bundle",
        name: "Docodo Complete Local Growth OS",
        category: "Marketing automation",
        description: "The complete all-in-one revenue operating system: Website Storefront + 24/7 WhatsApp AI + Instant Booking + Review SEO + CRM.",
        capabilities: ["Full omnichannel sync", "Automated lead re-engagement", "Customer LTV analytics", "Multi-channel attribution"],
        targetIndustries: ["High-intent SMBs", "Salons", "Aesthetic Clinics", "Fitness Centers"],
        targetBusinessSize: ["small_team", "multi_branch", "enterprise"],
        problemsSolved: [
          "Fragmented software tools causing lost leads and high monthly costs",
          "Low repeat customer rate and zero systematic follow-ups",
          "Inability to track return on marketing spend",
        ],
        features: ["All Docodo modules included", "Dedicated account manager", "Done-for-you catalog setup", "Custom WhatsApp branding"],
        pricing: { monthlyINR: 4999, annualINR: 47990, setupFeeINR: 2999, maxDiscountPercent: 20 },
        implementationTimeDays: 2,
        eligibility: ["Active business with staff and customer base"],
        upsellRelationships: ["prod_custom_automation"],
        crossSellRelationships: [],
        proofPoints: ["Saves 60% compared to paying for separate booking, CRM, WhatsApp bot, and review tools."],
        caseStudies: [
          { businessType: "Luxury Wellness Brand Pune", result: "Unified 3 branches into 1 dashboard with ₹3.4L monthly booking revenue", metric: "+240% ROI" },
        ],
        faqs: [
          { question: "Do you migrate our existing customer data?", answer: "Yes, our team imports your existing customer list, history, and service catalog during onboarding." },
        ],
        salesArguments: ["Consolidate 4 different subscriptions into one seamless operating system that pays for itself in week 1."],
        objections: [
          { objection: "Too many features for our small team.", rebuttal: "We handle 100% of the setup done-for-you. Your staff only needs to look at one clean calendar." },
        ],
        limitations: ["Limited to 10 staff accounts on standard tier."],
      },
    ];

    for (const prod of defaultCatalog) {
      this.products.set(prod.id, prod);
    }
  }

  public getAllProducts(): DocodoProduct[] {
    return Array.from(this.products.values());
  }

  public getProduct(id: string): DocodoProduct | undefined {
    return this.products.get(id);
  }

  public findProductsByNeed(problemKeywords: string[]): DocodoProduct[] {
    const matches: { product: DocodoProduct; score: number }[] = [];
    const keywords = problemKeywords.map((k) => k.toLowerCase());

    for (const prod of this.products.values()) {
      let score = 0;
      for (const kw of keywords) {
        for (const prob of prod.problemsSolved) {
          if (prob.toLowerCase().includes(kw)) score += 3;
        }
        for (const feat of prod.features) {
          if (feat.toLowerCase().includes(kw)) score += 1;
        }
      }
      if (score > 0) {
        matches.push({ product: prod, score });
      }
    }

    return matches.sort((a, b) => b.score - a.score).map((m) => m.product);
  }

  public addOrUpdateProduct(product: DocodoProduct): void {
    this.products.set(product.id, product);
  }
}

export const productCatalogAgent = new ProductCatalogAgent();
