import { BusinessDiscoveryInput } from "../validations/discovery";

export type InstrumentationEventType = 
  | "launch_started"
  | "discovery_triggered"
  | "profile_confirmed"
  | "website_published"
  | "booking_link_shared"
  | "first_booking_received";

export interface TelemetryEvent {
  event: InstrumentationEventType;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Emits structural telemetry events directly monitoring Time To First Booking and activation funnels.
 */
export function recordInstrumentationEvent(
  event: InstrumentationEventType,
  metadata?: Record<string, any>
): TelemetryEvent {
  const payload: TelemetryEvent = {
    event,
    timestamp: new Date().toISOString(),
    metadata,
  };
  // In production runtime, this relays to PostHog/Google Telemetry channels
  console.info(`[DOCODO_TELEMETRY_EVENT] [${payload.timestamp}] -> ${payload.event}`, payload.metadata ?? "");
  return payload;
}

export interface SynthesizedService {
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
}

export interface DiscoveredBusinessProfile {
  name: string;
  city: string;
  businessType: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  workingHours: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>;
  services: SynthesizedService[];
  seoTitle: string;
  seoDesc: string;
}

/**
 * Synthesizes high-conversion local business details and services immediately upon input
 * ensuring the merchant sees a live website & booking page within < 5 minutes.
 */
export function synthesizeBusinessProfile(input: BusinessDiscoveryInput): DiscoveredBusinessProfile {
  const { name, city, businessType } = input;

  let services: SynthesizedService[] = [];
  let tagline = "Premier local services & appointment scheduling.";
  let desc = `Experience premier care and personalized attention at ${name}. Serving valued clients across ${city} with modern excellence.`;

  switch (businessType) {
    case "Salon":
      tagline = `Elevating your style and confidence in ${city}.`;
      desc = `Welcome to ${name}, ${city}'s premium sanctuary for tailored hair styling, bespoke coloring, and luxury beauty treatments.`;
      services = [
        { name: "Signature Hair Styling & Grooming", price: 499, duration: 45, description: "Precision haircut, luxury wash, and personalized styling." },
        { name: "Keratin Spa Treatment & Revival", price: 2800, duration: 90, description: "Intensive anti-frizz smoothing and nourishing hair spa." },
        { name: "Express Glow Facial & Detan", price: 899, duration: 45, description: "Instant botanical rejuvenation and deep surface cleansing." },
      ];
      break;
    case "Spa":
      tagline = `Your serene sanctuary for deep healing in ${city}.`;
      desc = `Immerse yourself in tranquility at ${name}. Offering holistic therapies, ancient wellness traditions, and therapeutic rejuvenation.`;
      services = [
        { name: "Aromatherapy Deep Relaxation Massage", price: 2400, duration: 60, description: "Full-body stress relieving therapy with organic essential oils." },
        { name: "Traditional Ayurvedic Abhyanga Therapy", price: 3200, duration: 75, description: "Warm medicated oil massage restoring vitality and energy flow." },
        { name: "Foot Reflexology & Acupressure Care", price: 1200, duration: 45, description: "Targeted pressure therapy relieving mental tension and foot fatigue." },
      ];
      break;
    case "Clinic":
      tagline = `Compassionate healthcare and clinical precision in ${city}.`;
      desc = `${name} provides trusted diagnostics, patient-focused consultations, and specialized preventative healthcare for families in ${city}.`;
      services = [
        { name: "Specialist Clinical Consultation", price: 800, duration: 20, description: "One-on-one expert evaluation, diagnostics, and prescription review." },
        { name: "Follow-up Assessment & Vitals Review", price: 500, duration: 15, description: "Structured check-in on therapy efficacy and diagnostic reports." },
        { name: "Comprehensive Health Screening", price: 1800, duration: 45, description: "Full diagnostic evaluation and multi-point wellness check." },
      ];
      break;
    case "Dentist":
      tagline = `Crafting radiant, healthy smiles across ${city}.`;
      desc = `${name} brings modern painless dentistry and cosmetic oral care to ${city}. Committed to comfort, hygiene, and lasting perfection.`;
      services = [
        { name: "Comprehensive Oral Checkup & Scaling", price: 900, duration: 30, description: "Ultrasonic cleaning, plaque removal, and full oral evaluation." },
        { name: "Laser Teeth Whitening & Polishing", price: 4500, duration: 45, description: "Advanced stain elimination restoring vibrant natural white luster." },
        { name: "Root Canal Diagnostic & Digital Imaging", price: 700, duration: 20, description: "Precision pain localization and structural restoration planning." },
      ];
      break;
    case "Gym":
      tagline = `Forge your strength and exceed your limits in ${city}.`;
      desc = `Join ${name}, ${city}'s elite training performance space. Featuring modern strength rigs, functional cardio zones, and accredited trainers.`;
      services = [
        { name: "1-on-1 Personal Coaching Kick-off", price: 1200, duration: 60, description: "Custom biomechanic audit and targeted training intensity drill." },
        { name: "Body Composition & Metabolic Audit", price: 600, duration: 30, description: "In-depth body fat percentage, resting caloric burn, and posture test." },
        { name: "Group HIIT & Strength Conditioning", price: 450, duration: 45, description: "High energy circuit training engineered for maximum metabolic burn." },
      ];
      break;
    case "Yoga Studio":
      tagline = `Find harmony of breath, body, and balance in ${city}.`;
      desc = `${name} welcomes practitioners of all levels in ${city} to mindful Vinyasa flows, healing Pranayama breathwork, and restorative stillness.`;
      services = [
        { name: "Sunrise Ashtanga Flow Session", price: 600, duration: 60, description: "Energizing traditional series awakening core physical flexibility." },
        { name: "Personalized Pranayama & Mindfulness", price: 1400, duration: 60, description: "Private breathwork engineering deep mental clarity and calm." },
        { name: "Restorative Yin & Bowl Sound Healing", price: 800, duration: 75, description: "Deep meditative physical recovery and stress release session." },
      ];
      break;
    case "Beauty Studio":
      tagline = `Bespoke makeup artistry and lash elegance in ${city}.`;
      desc = `${name} transforms life's milestones with high-definition bridal artistry, advanced nail styling, and luxury lash extensions in ${city}.`;
      services = [
        { name: "HD Bridal & Celebration Makeup Studio", price: 9500, duration: 120, description: "High-definition photo-perfect airbrush artistry and styling." },
        { name: "Gel Extensions & Bespoke Nail Art", price: 1600, duration: 60, description: "Long-lasting strengthening gel overlays with custom design touches." },
        { name: "Lash Lift & Brow Microblading Consult", price: 1200, duration: 30, description: "Personalized face-mapping and lash fullness architectural styling." },
      ];
      break;
    default:
      services = [
        { name: "Standard Professional Consultation", price: 500, duration: 30, description: "Comprehensive discovery and service planning discussion." },
        { name: "Express Service Intervention", price: 1000, duration: 45, description: "Rapid diagnostic and targeted implementation solution." },
        { name: "Premium Full-Suite Service Package", price: 2500, duration: 90, description: "End-to-end professional support and VIP execution." },
      ];
      break;
  }

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const workingHours = days.map((day) => ({
    day,
    isOpen: day !== "SUN", // Sunday off by default for clean lifestyle balance
    openTime: "09:30",
    closeTime: "19:00",
  }));

  return {
    name,
    city,
    businessType,
    tagline,
    description: desc,
    address: `Central Commercial Hub, Near High Street, ${city}`,
    phone: "+91 98765 43210",
    workingHours,
    services,
    seoTitle: `${name} | Premier ${businessType} in ${city} — Instant Online Booking`,
    seoDesc: `Book appointments instantly at ${name} in ${city}. Verified reviews, pricing, and live availability for ${services[0]?.name || "our top services"}.`,
  };
}

export interface ActivationState {
  websiteLive?: boolean;
  bookingActive?: boolean;
  linkShared?: boolean;
  firstBooking?: boolean;
  googleConnected?: boolean;
  whatsappEnabled?: boolean;
}

/**
 * Calculates real-time Activation Score (%) to gate premature dashboard analytics.
 * Starts at 20% once AI Discovery Website appears. Reaches 100% upon first booking completion.
 */
export function calculateActivationScore(state: ActivationState): number {
  let score = 0;
  if (state.websiteLive) score += 20;
  if (state.bookingActive) score += 20;
  if (state.linkShared) score += 20;
  if (state.firstBooking) score += 20;
  if (state.googleConnected) score += 10;
  if (state.whatsappEnabled) score += 10;
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculates Time To First Booking (in exact seconds) for foundational outcome metrics.
 */
export function calculateTimeToFirstBooking(activatedAt?: Date | string | null, firstBookingAt?: Date | string | null): number | null {
  if (!activatedAt || !firstBookingAt) return null;
  const start = new Date(activatedAt).getTime();
  const end = new Date(firstBookingAt).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return null;
  return Math.round((end - start) / 1000);
}
