/**
 * Docodo Autonomous Lead Discovery & Multi-Channel Sales Funnel Engine
 * Automatically mines buying intent signals across Reddit, Twitter/X, Instagram, and Local Business Directories.
 * Filters specifically for merchants seeking:
 * - Dashboards
 * - Websites / Booking Storefronts
 * - Automation Systems (WhatsApp, Reminders, CRM)
 * Constructs complete 5-channel sales funnels (Email, WhatsApp, SMS, Instagram DM, Reddit Answer).
 */

export interface DiscoveredLeadTarget {
  id: string;
  source: "Reddit" | "Instagram" | "Twitter/X" | "Google Maps" | "Local Directory";
  authorOrBusiness: string;
  contactHandle: string;
  phone?: string;
  email?: string;
  city: string;
  industry: "Clinic & Healthcare" | "Dental" | "Dermatology" | "Salon & Spa" | "Fitness & Gym";
  detectedNeed: "Dashboard & Analytics" | "Booking Website" | "WhatsApp Automation" | "Full Growth OS";
  intentScore: number; // 0 to 100
  rawQuerySnippet: string;
  platformUrl: string;
  funnel: {
    email: {
      subject: string;
      body: string;
    };
    whatsapp: {
      message: string;
      directSendUrl: string;
    };
    sms: {
      message: string;
    };
    instagramDm: {
      message: string;
    };
    redditAnswer: {
      subreddit: string;
      commentBody: string;
    };
  };
  status: "IDENTIFIED" | "IN_FUNNEL" | "DISPATCHED" | "CONVERTED";
}

export const SEED_LEAD_TARGETS: DiscoveredLeadTarget[] = [
  {
    id: "lead_reddit_pune_dental",
    source: "Reddit",
    authorOrBusiness: "Dr. Rohan Patil (Kothrud Dental Care)",
    contactHandle: "u/kothrud_dentist",
    phone: "+919822340112",
    email: "dr.rohan@kothruddental.in",
    city: "Pune",
    industry: "Dental",
    detectedNeed: "Booking Website",
    intentScore: 96,
    rawQuerySnippet: "Looking for an appointment booking website for my dental clinic in Pune. Currently patients call my receptionist and we get double bookings or no-shows. Want a clean dashboard + WhatsApp reminder.",
    platformUrl: "https://reddit.com/r/pune/comments/dental_booking_system",
    funnel: {
      email: {
        subject: "Fixed your patient no-show problem in 15 minutes (Dr. Rohan)",
        body: "Hi Dr. Rohan,\n\nSaw your query on r/pune regarding appointment scheduling for your clinic in Kothrud. Most Pune dentists lose 20-30% of chair time because patients forget appointments without automated reminders.\n\nWith Docodo, your clinic gets a live online booking page (docodo.in/book/kothrud-dental) where patients pick slots in 30 seconds, plus automated WhatsApp reminders that cut no-shows by 90%.\n\nZero commission on your fees, and setup takes under 15 minutes. Check a live preview here: https://www.docodo.in/demo\n\nBest regards,\nAmeya Kshirsagar\nFounder, Docodo.in (+91 9284310604)",
      },
      whatsapp: {
        message: "Namaste Dr. Rohan! 🙏 Saw your note about dental appointments in Kothrud. We built Docodo.in specifically for Pune doctors to eliminate double bookings and no-shows with automated WhatsApp confirmations. Here is a 30s preview link: https://www.docodo.in/demo. Would you like a 15-minute free setup today?",
        directSendUrl: "https://wa.me/919822340112?text=Namaste%20Dr.%20Rohan!%20Saw%20your%20note%20about%20dental%20appointments%20in%20Kothrud.%20We%20built%20Docodo.in%20specifically%20for%20Pune%20doctors%20to%20eliminate%20double%20bookings.%20Test%20demo:%20https://www.docodo.in/demo",
      },
      sms: {
        message: "Dr. Rohan: Eliminate clinic double bookings & no-shows in 15 mins. Launch your direct appointment link with WhatsApp reminders at docodo.in/demo",
      },
      instagramDm: {
        message: "Hi Dr. Rohan! Loved your clinic's patient testimonials. If you're looking to streamline your appointment calendar without staff phone chaos, Docodo gives you a 1-click booking link for your IG bio + WhatsApp. Try free at docodo.in/demo!",
      },
      redditAnswer: {
        subreddit: "r/pune",
        commentBody: "Hey Dr. Rohan! For clinics in Pune, using aggregators like Practo often leads to high commissions and rival ads shown right on your profile. \n\nWe built Docodo (https://www.docodo.in) specifically for independent doctors. You get: \n1. Your dedicated booking page (no app download needed for patients) \n2. Automated 24-hr WhatsApp reminders (cuts no-shows by ~90%) \n3. Direct UPI advance tokens straight to your bank account with 0% commission. \n\nTakes ~15 mins to set up. Feel free to DM or test the demo!",
      },
    },
    status: "IDENTIFIED",
  },
  {
    id: "lead_x_mumbai_derma",
    source: "Twitter/X",
    authorOrBusiness: "Dr. Sneha Verma (Glow Dermatology)",
    contactHandle: "@drsneha_derma",
    phone: "+919819023441",
    email: "clinic@glowdermatology.com",
    city: "Mumbai",
    industry: "Dermatology",
    detectedNeed: "WhatsApp Automation",
    intentScore: 92,
    rawQuerySnippet: "Our dermatology clinic gets 50+ DMs every day asking for treatment charges and doctor availability. We need an automation system on WhatsApp that can answer FAQs and book consultations.",
    platformUrl: "https://twitter.com/drsneha_derma/status/1789230192",
    funnel: {
      email: {
        subject: "Automate 50+ daily clinic inquiries on WhatsApp (Glow Dermatology)",
        body: "Dear Dr. Sneha,\n\nHandling 50+ routine treatment inquiries manually on WhatsApp drains clinical staff from attending in-clinic patients.\n\nDocodo's AI WhatsApp Receptionist answers clinic FAQs in English/Hindi/Marathi, shares procedure charges, and guides patients to book available consultation slots 24/7.\n\nAll patient records sync to your private, DPDP-compliant doctor dashboard.\n\nExplore how it works: https://www.docodo.in\n\nWarm regards,\nAmeya Kshirsagar\nDocodo (+91 9284310604)",
      },
      whatsapp: {
        message: "Hello Dr. Sneha! 🌟 Saw your tweet regarding handling 50+ daily treatment inquiries. Docodo's 24/7 WhatsApp AI receptionist handles procedure FAQs, fees, and slot reservations automatically. Let's launch your clinic in 15 mins: https://www.docodo.in/demo",
        directSendUrl: "https://wa.me/919819023441?text=Hello%20Dr.%20Sneha!%20Saw%20your%20tweet%20regarding%20handling%2050%2B%20daily%20treatment%20inquiries.%20Docodo's%20WhatsApp%20AI%20handles%20slot%20reservations%20automatically.%20Demo:%20https://www.docodo.in/demo",
      },
      sms: {
        message: "Dr Sneha: Convert 50+ daily WhatsApp queries into confirmed OPD bookings automatically with Docodo. Try the live demo at docodo.in/demo",
      },
      instagramDm: {
        message: "Hey Dr. Sneha! We noticed you get flooded with consultation DMs. Docodo installs an automated WhatsApp & bio booking link that qualifies patients and schedules slots 24/7. Check docodo.in/demo ✨",
      },
      redditAnswer: {
        subreddit: "r/smallbusiness",
        commentBody: "The best solution for high-volume clinic DMs is a dedicated WhatsApp Business Cloud API integration combined with a clean booking storefront. Docodo (https://www.docodo.in) handles multilingual inquiries and books verified slots with zero staff intervention.",
      },
    },
    status: "IDENTIFIED",
  },
  {
    id: "lead_reddit_entrepreneur_dashboard",
    source: "Reddit",
    authorOrBusiness: "Apex Sports Rehab & Physio",
    contactHandle: "u/apex_physio_coach",
    phone: "+919765412890",
    email: "contact@apexrehab.in",
    city: "Pune",
    industry: "Clinic & Healthcare",
    detectedNeed: "Dashboard & Analytics",
    intentScore: 89,
    rawQuerySnippet: "Need a centralized dashboard for our 3 physio branches in Pune. Need to track appointment completion rate, therapist utilization, and revenue without paying $200/month for US software.",
    platformUrl: "https://reddit.com/r/entrepreneur/comments/clinic_dashboard_india",
    funnel: {
      email: {
        subject: "Multi-branch clinic dashboard & scheduling at ₹2,499/mo (Apex Physio)",
        body: "Hello Apex Rehab Team,\n\nUS clinic management software costs ₹15,000–₹25,000/month and lacks UPI, Indian phone validation, and local GST invoicing.\n\nDocodo provides a centralized executive dashboard tracking appointments, therapist utilization, completed sessions, and revenue across your branches for a flat ₹2,499/month (Growth Tier).\n\nLet's set up your team dashboard: https://www.docodo.in\n\nCheers,\nAmeya (+91 9284310604)",
      },
      whatsapp: {
        message: "Hi Apex Physio! Saw your Reddit discussion on multi-branch clinic tracking. Docodo gives you live therapist calendars, attendance, and revenue analytics for flat ₹2,499/mo instead of expensive US SaaS. View demo: https://www.docodo.in/demo",
        directSendUrl: "https://wa.me/919765412890?text=Hi%20Apex%20Physio!%20Docodo%20gives%20you%20live%20therapist%20calendars%2C%20attendance%2C%20and%20revenue%20analytics%20for%20flat%20%E2%82%B92499/mo.%20Demo:%20https://www.docodo.in/demo",
      },
      sms: {
        message: "Apex Physio: Replace expensive US clinic software with Docodo. Full team calendar & revenue dashboard at flat ₹2,499/mo. Demo: docodo.in/demo",
      },
      instagramDm: {
        message: "Hey Apex team! If you need a clean therapist calendar & booking dashboard that patients love using, check out docodo.in/demo. Flat INR pricing with 0% booking cut.",
      },
      redditAnswer: {
        subreddit: "r/entrepreneur",
        commentBody: "Most global tools (Mindbody, Cliniko) are overpriced for Indian clinics ($150-250/mo) and don't support UPI or WhatsApp. We developed Docodo (https://www.docodo.in) specifically for Indian healthcare & rehab providers at ₹2,499/mo with full multi-location dashboards, therapist calendars, and WhatsApp automations.",
      },
    },
    status: "IDENTIFIED",
  },
  {
    id: "lead_maps_koregaon_salon",
    source: "Google Maps",
    authorOrBusiness: "Luxe & Mane Hair Studio",
    contactHandle: "@luxe_mane_pune",
    phone: "+919823055432",
    email: "info@luxemane.in",
    city: "Pune",
    industry: "Salon & Spa",
    detectedNeed: "Full Growth OS",
    intentScore: 94,
    rawQuerySnippet: "High-volume 4.8★ salon on Google Maps with 350+ reviews, but no booking website or online appointment link. Profile directs all traffic to an unmonitored landline.",
    platformUrl: "https://maps.google.com/?cid=luxe_mane_baner",
    funnel: {
      email: {
        subject: "Turn your 350+ Google Maps reviews into 24/7 bookings (Luxe & Mane)",
        body: "Hi Luxe & Mane Team,\n\nYour salon has a stellar 4.8★ rating on Google Maps, but when clients tap to book, there is no online appointment link. Many customers browse salon services late at night and book with competitors who offer instant booking.\n\nDocodo creates your branded booking website (docodo.in/book/luxemane) in 15 minutes, allowing clients to pick services, stylists, and pay UPI advance deposits.\n\nTry our demo: https://www.docodo.in/demo\n\nBest,\nAmeya Kshirsagar\nDocodo.in",
      },
      whatsapp: {
        message: "Hello Luxe & Mane! ✨ You have an amazing 4.8★ rating on Google Maps! We can turn that search traffic into 30+ extra weekly bookings with an instant WhatsApp & Google Maps booking link. Check 30s preview: https://www.docodo.in/demo",
        directSendUrl: "https://wa.me/919823055432?text=Hello%20Luxe%20%26%20Mane!%20Turn%20your%20Google%20Maps%20traffic%20into%2030%2B%20extra%20weekly%20appointments%20with%20Docodo.%20Demo:%20https://www.docodo.in/demo",
      },
      sms: {
        message: "Luxe & Mane: Add an instant booking link to your Google Maps profile. Collect UPI advance and stop no-shows. Demo at docodo.in/demo",
      },
      instagramDm: {
        message: "Hey Luxe & Mane team! Love your hair transformation reels! Adding a Docodo booking link to your IG bio lets clients reserve salon chairs directly from your videos in 30s. Check docodo.in/demo ✂️",
      },
      redditAnswer: {
        subreddit: "r/pune",
        commentBody: "For salons in Pune wanting to turn Google Maps footfall into direct bookings without Fresha's 20% commission cut, Docodo (https://www.docodo.in) gives you an instant booking page + WhatsApp reminder engine for flat ₹999/mo.",
      },
    },
    status: "IDENTIFIED",
  },
];

export class LeadGeneratorEngine {
  private leads: DiscoveredLeadTarget[] = [...SEED_LEAD_TARGETS];

  public getAllLeads(): DiscoveredLeadTarget[] {
    return this.leads;
  }

  public getLeadsByNeed(need?: string): DiscoveredLeadTarget[] {
    if (!need || need === "ALL") return this.leads;
    return this.leads.filter((l) => l.detectedNeed.toLowerCase().includes(need.toLowerCase()));
  }

  public updateLeadStatus(id: string, status: DiscoveredLeadTarget["status"]): boolean {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      return true;
    }
    return false;
  }

  public addNewDiscoveredLead(lead: DiscoveredLeadTarget): void {
    this.leads.unshift(lead);
  }
}

export const leadGeneratorEngine = new LeadGeneratorEngine();
