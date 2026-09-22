export type BusinessVertical = "salon" | "clinic" | "gym" | "spa" | "consultant" | "general";

export interface VerticalConfig {
  id: BusinessVertical;
  name: string;
  icon: string;
  terminology: {
    service: string;
    staff: string;
    client: string;
    booking: string;
  };
  features: string[];
}

export const VERTICAL_REGISTRY: Record<BusinessVertical, VerticalConfig> = {
  salon: {
    id: "salon",
    name: "Salon & Beauty Parlour",
    icon: "Scissors",
    terminology: {
      service: "Treatment / Styling",
      staff: "Stylist / Beautician",
      client: "Client",
      booking: "Appointment",
    },
    features: ["chair_allocation", "product_retail_addons", "stylist_commission"],
  },
  clinic: {
    id: "clinic",
    name: "Doctor & Polyclinic",
    icon: "Stethoscope",
    terminology: {
      service: "Consultation / Procedure",
      staff: "Doctor / Specialist",
      client: "Patient",
      booking: "Consultation",
    },
    features: ["opd_queue", "emr_notes", "prescription_history"],
  },
  gym: {
    id: "gym",
    name: "Fitness Center & Gym",
    icon: "Dumbbell",
    terminology: {
      service: "Session / Class",
      staff: "Trainer / Coach",
      client: "Member",
      booking: "Session Slot",
    },
    features: ["batch_capacity", "equipment_scheduling", "membership_renewals"],
  },
  spa: {
    id: "spa",
    name: "Ayurveda & Spa Wellness",
    icon: "Sparkles",
    terminology: {
      service: "Therapy / Massage",
      staff: "Therapist",
      client: "Guest",
      booking: "Session",
    },
    features: ["room_scheduling", "buffer_time_clean", "aroma_selection"],
  },
  consultant: {
    id: "consultant",
    name: "Professional & Consultant",
    icon: "Briefcase",
    terminology: {
      service: "Strategy Call",
      staff: "Consultant",
      client: "Client",
      booking: "Meeting",
    },
    features: ["meeting_url_generation", "intake_questionnaire", "advance_deposit"],
  },
  general: {
    id: "general",
    name: "Local Service Business",
    icon: "Building2",
    terminology: {
      service: "Service",
      staff: "Staff Member",
      client: "Customer",
      booking: "Booking",
    },
    features: ["standard_scheduling", "whatsapp_reminders"],
  },
};

/**
 * Dynamic Vertical Feature Loader
 * Kept outside main bundle to reduce initial JavaScript payload size.
 */
export function getVerticalConfig(category?: string | null): VerticalConfig {
  if (!category) return VERTICAL_REGISTRY.general;
  const key = category.toLowerCase().trim() as BusinessVertical;
  return VERTICAL_REGISTRY[key] || VERTICAL_REGISTRY.general;
}
