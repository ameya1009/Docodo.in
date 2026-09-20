import { ContentThesis, MultiPlatformContentPlan } from "./types";

export const DOCODO_CONTENT_PILLARS = [
  "AI for local business",
  "Local SEO",
  "Website conversion",
  "Lead generation",
  "WhatsApp automation",
  "CRM",
  "Customer retention",
  "Reviews",
  "Bookings",
  "Salon marketing",
  "Gym marketing",
  "Spa marketing",
  "Clinic marketing",
  "Restaurant marketing",
  "Small-business automation",
  "Business growth",
  "AI agents",
  "Founder education",
  "Docodo product education",
  "Case studies",
  "Customer results",
] as const;

export type DocodoPillar = (typeof DOCODO_CONTENT_PILLARS)[number];

export class ContentStrategyAgent {
  public generateMonthlyCalendar(industry: string = "Salon & Spa"): ContentThesis[] {
    const calendar: ContentThesis[] = [];
    const seedIdeas = [
      {
        sourceIdea: "Why local businesses lose leads after getting Instagram inquiries",
        pillar: "WhatsApp automation",
        targetAudience: "Salon and Clinic Owners",
        coreAngle: "Manual DM responses take 4+ hours, by which time 78% of customers book elsewhere.",
      },
      {
        sourceIdea: "How to rank #1 on Google Maps in your locality in 30 days without paid ads",
        pillar: "Local SEO",
        targetAudience: "Local Service Founders",
        coreAngle: "Automated review triggers post-service increase GBP authority by 300%.",
      },
      {
        sourceIdea: "The 3-click booking funnel that doubles local appointment volume",
        pillar: "Bookings",
        targetAudience: "Aesthetic Clinics & Spas",
        coreAngle: "Replacing PDF menus and call-me buttons with instant WhatsApp calendar selection.",
      },
      {
        sourceIdea: "How 24/7 AI receptionists prevent after-hours revenue leaks",
        pillar: "AI agents",
        targetAudience: "SMB Owners",
        coreAngle: "Over 42% of customer inquiries arrive after 7 PM when staff is offline.",
      },
      {
        sourceIdea: "Why traditional websites fail local businesses (and what to build instead)",
        pillar: "Website conversion",
        targetAudience: "Independent Business Owners",
        coreAngle: "Static websites lack instant conversion triggers; conversational storefronts convert at 18%.",
      },
    ];

    for (let day = 1; day <= 30; day++) {
      const template = seedIdeas[(day - 1) % seedIdeas.length];
      const pillar = DOCODO_CONTENT_PILLARS[(day - 1) % DOCODO_CONTENT_PILLARS.length];
      calendar.push({
        sourceIdea: `${template.sourceIdea} (Day ${day}: Focus on ${industry})`,
        pillar,
        targetAudience: template.targetAudience,
        coreAngle: template.coreAngle,
      });
    }

    return calendar;
  }
}

export class CreativeAgent {
  public generateImageBrief(pillar: string, topic: string): string {
    return `High-contrast modern editorial aesthetic with neon lime accents (#C8F135) and deep obsidian backdrop. Topic: ${topic}. Clear bold sans-serif text overlay with data graph element.`;
  }

  public generateVideoBrief(topic: string): { visualOutline: string; sceneCount: number; targetDurationSec: number } {
    return {
      visualOutline: `0-3s: Hook scenario on mobile phone screen showing missed DM. 4-15s: Docodo AI instantly confirming appointment slot with customer. 16-25s: Full calendar view and revenue impact graph. 26-30s: Clear CTA to test live demo.`,
      sceneCount: 4,
      targetDurationSec: 30,
    };
  }

  public generateThumbnailConcept(headline: string): string {
    return `Split screen thumbnail: Left side red alert "LOST $3,400" with unread badge vs Right side lime green "BOOKED 24/7" with calendar alert. Headline: "${headline}"`;
  }
}

export class PlatformAdaptationAgent {
  private creativeAgent = new CreativeAgent();

  public adaptThesis(thesis: ContentThesis): MultiPlatformContentPlan {
    const id = `content_plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const topic = thesis.sourceIdea;
    const imageBrief = this.creativeAgent.generateImageBrief(thesis.pillar, topic);
    const videoBrief = this.creativeAgent.generateVideoBrief(topic);

    return {
      id,
      sourceIdea: thesis.sourceIdea,
      pillar: thesis.pillar,
      createdAt: new Date().toISOString(),
      platforms: {
        linkedinPost: {
          hook: `Stop losing high-intent customers to delayed responses. Here is the math:`,
          copy: `Most local businesses assume marketing is their bottleneck.\n\nIn reality, it is lead response velocity.\n\n${thesis.coreAngle}\n\nWhen a prospective client reaches out:\n1. 5-minute response: 80% conversion chance\n2. 30-minute response: 30% conversion chance\n3. 4-hour response: 4% conversion chance\n\nDocodo automates the entire customer journey from discovery to confirmed booking.\n\n#BusinessGrowth #Automation #AI #LocalBusiness #Docodo`,
          hashtags: ["#BusinessGrowth", "#AI", "#LocalBusiness", "#Docodo", "#CustomerAcquisition"],
        },
        instagramCarousel: {
          slides: [
            { title: "Swipe ➡️", body: `Why 78% of your inquiries never book: ${topic}` },
            { title: "1. The 5-Minute Rule", body: "Speed to lead determines 80% of booking success." },
            { title: "2. The Manual DM Trap", body: "Replying manually to 'price please' burns time and loses leads." },
            { title: "3. Automated Booking", body: "Direct WhatsApp calendar links let clients book while excitement is high." },
            { title: "The Solution", body: "Deploy Docodo Growth OS to handle inquiries 24/7." },
          ],
          caption: `Are you answering inquiries fast enough? Comment 'GROW' to see how top businesses automate bookings with Docodo. 🚀`,
          imageBrief,
        },
        instagramReel: {
          script: `POV: It's 10 PM and 3 potential clients just messaged your salon. Are you losing them or is your AI receptionist booking them right now? Here is how Docodo keeps your calendar full while you sleep.`,
          visualBrief: videoBrief.visualOutline,
          audioTrackSuggestion: "Upbeat electronic ambient lofi beat",
          caption: `Never miss another after-hours client inquiry. Link in bio to activate Docodo. #SalonOwner #ClinicGrowth #AIReceptionist`,
        },
        facebookPost: {
          copy: `Attention business owners in Pune: If you are relying on phone calls and manual WhatsApp replies, you might be losing 40% of your potential bookings.\n\nDiscover how automated instant scheduling helps salons, spas, and clinics generate 2.4x more appointments without extra staff.`,
          cta: "Click here to see a 2-minute live demo of Docodo Growth OS.",
        },
        facebookReel: {
          hook: "3 signs your business is leaking high-value leads every single week.",
          script: "Sign 1: Inquiries sit in your DM inbox for hours. Sign 2: No automated appointment confirmations. Sign 3: Zero follow-up for repeat bookings.",
          cta: "Upgrade to Docodo Growth OS today.",
        },
        xThread: {
          tweets: [
            `1/5 Why most local service businesses struggle with customer acquisition (and how to fix it with AI) 🧵👇`,
            `2/5 The biggest leak is speed-to-lead. If a client DMs 'How much for haircut?' and waits 3 hours, they've already booked with someone else.`,
            `3/5 Automated WhatsApp receptionists answer instantly, show service menus, and confirm calendar slots in 30 seconds.`,
            `4/5 Combine this with automated Google review collection, and your organic Google Maps ranking jumps automatically.`,
            `5/5 That is Docodo Growth OS in action. Read full breakdown at docodo.in`,
          ],
          hashtags: ["#BuildInPublic", "#AI", "#GrowthHacking"],
        },
        youtubeShort: {
          hook: "Watch this AI book 14 appointments for a salon in one afternoon.",
          visualNotes: "Screen recording of WhatsApp conversation smoothly selecting 4:00 PM slot and confirming payment.",
          script: "No phone tag, no double bookings, zero friction. This is why smart local businesses are replacing static forms with Docodo.",
          caption: "How AI is changing local business growth forever. Subscribe for daily growth breakdowns!",
        },
        youtubeLongScript: {
          title: `How to Build an Autonomous Customer Acquisition Engine for Local Businesses in 2026`,
          outline: [
            "Introduction: The Death of the Static Website",
            "The Omnichannel Discovery Matrix (Google, Instagram, Meta, LinkedIn)",
            "The 24/7 AI Receptionist & WhatsApp Conversion Funnel",
            "Automated Review Gathering & Organic Local SEO Dominance",
            "Live Case Study & Step-by-Step Implementation",
          ],
          scriptSections: [
            {
              heading: "Section 1: The Core Bottleneck",
              body: "Welcome back everyone. Today we are looking at why traditional customer acquisition is broken for local establishments...",
            },
            {
              heading: "Section 2: The Docodo Architecture",
              body: "By connecting omnichannel discovery with instant entity resolution, we turn cold inquiries into verified booked clients...",
            },
          ],
        },
        pinterestPin: {
          title: "The Ultimate Local Business Growth Funnel (Infographic)",
          visualPrompt: "Vertical 2:3 sleek tech diagram showing Traffic -> WhatsApp AI -> Booking Calendar -> Automated Review.",
          description: "Discover how local salons, clinics, and wellness centers double bookings using Docodo Growth OS.",
          linkDestination: "https://docodo.in/growth-os",
        },
        blogArticle: {
          title: `The Omnichannel Customer Acquisition Playbook for Modern Local Businesses`,
          metaDescription: `Learn how omnichannel discovery, AI receptionists, and automated booking systems help businesses scale predictably.`,
          markdownBody: `## Why Omnichannel Acquisition Matters\n\nLocal businesses can no longer rely solely on foot traffic or single-channel search. Modern consumers discover services on Instagram, verify them on Google Maps, and expect immediate WhatsApp booking...\n\n### The 3 Pillars of Omnichannel Conversion\n1. **Unified Identity Resolution**\n2. **Zero-Latency Inbound Response**\n3. **Continuous Review & Retention Loops**\n\nDocodo Growth OS brings these three pillars into one turnkey operating system.`,
        },
        newsletterEmail: {
          subject: `How top local businesses are filling empty calendar slots with AI`,
          preheader: `The 5-minute fix for missed client inquiries.`,
          htmlBody: `<p>Hi there,</p><p>Did you know that 42% of customer inquiries arrive outside standard business hours?</p><p>When an inquiry goes unanswered for even 30 minutes, booking likelihood drops by over 70%.</p><p>With <strong>Docodo Growth OS</strong>, your business never sleeps. Inquiries are automatically greeted, qualified, and booked into your calendar 24/7.</p><p><a href="https://docodo.in">Explore Docodo Growth OS &rarr;</a></p>`,
        },
        websiteContent: {
          heroHeadline: `Turn Cold Social & Search Traffic Into Confirmed Bookings Automatically`,
          subheadline: `Docodo Growth OS unifies multi-channel customer acquisition with a 24/7 WhatsApp AI receptionist that converts inquiries in seconds.`,
          featureBullets: [
            "Instant WhatsApp interactive booking calendar with zero manual typing",
            "Automated post-appointment 5-star Google review collection engine",
            "Omnichannel discovery and CRM nurturing across Instagram, Maps, and Web",
            "Seamless live sync with your staff calendar and automated payment reminders",
          ],
          comparisonMatrix: [
            { feature: "Inquiry Response Time", manualWay: "4+ hours (Manual DM/WhatsApp)", docodoWay: "Under 5 seconds (24/7 AI)" },
            { feature: "Booking Conversion Rate", manualWay: "4% - 8% (PDF menu friction)", docodoWay: "18% - 24% (Interactive WhatsApp flow)" },
            { feature: "Google Review Growth", manualWay: "1-2 reviews per month", docodoWay: "30-50 verified 5-star reviews per month" },
          ],
          ctaText: "Launch Your Free 14-Day Growth Trial",
        },
        adVariation: {
          headline: `Double Your Salon or Clinic Bookings with AI`,
          primaryText: `Stop losing inquiries to delayed replies. Let Docodo WhatsApp AI Receptionist qualify leads and fill your appointment calendar 24/7.`,
          callToAction: `Claim Your Free 14-Day Growth Trial`,
        },
      },
    };
  }
}

export class ContentEngine {
  private strategyAgent = new ContentStrategyAgent();
  private adaptationAgent = new PlatformAdaptationAgent();
  public creativeAgent = new CreativeAgent();

  public generate30DayOmnichannelSuite(industry: string = "Salon"): MultiPlatformContentPlan[] {
    const calendar = this.strategyAgent.generateMonthlyCalendar(industry);
    return calendar.map((thesis) => this.adaptationAgent.adaptThesis(thesis));
  }

  public adaptSingleIdea(idea: string, pillar: DocodoPillar = "AI for local business"): MultiPlatformContentPlan {
    return this.adaptationAgent.adaptThesis({
      sourceIdea: idea,
      pillar,
      targetAudience: "Local Business Founders",
      coreAngle: "Automating customer acquisition and instant booking conversion.",
    });
  }

  public static async generateOmnichannelBundle(params: {
    thesis: string;
    pillar?: string;
    targetAudience?: string;
  }): Promise<Record<string, any>> {
    const plan = contentEngine.adaptSingleIdea(params.thesis, (params.pillar as any) || "AI for local business");
    return {
      linkedinPost: plan.platforms.linkedinPost,
      instagramCarousel: plan.platforms.instagramCarousel,
      instagramReelScript: plan.platforms.instagramReel,
      facebookPost: plan.platforms.facebookPost,
      facebookReelScript: plan.platforms.facebookReel,
      xThread: plan.platforms.xThread,
      youtubeShortScript: plan.platforms.youtubeShort,
      youtubeLongScript: plan.platforms.youtubeLongScript,
      pinterestGraphicBrief: plan.platforms.pinterestPin,
      blogArticle: plan.platforms.blogArticle,
      emailNewsletter: plan.platforms.newsletterEmail,
      websiteContent: plan.platforms.websiteContent,
      adVariation: plan.platforms.adVariation,
    };
  }
}

export const contentEngine = new ContentEngine();
