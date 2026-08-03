export interface ServiceOffering {
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export function getDefaultServices(industry: string): ServiceOffering[] {
  const services: Record<string, ServiceOffering[]> = {
    salon: [
      { name: "Haircut & Style", duration: 45, price: 400, description: "Professional cut and styling" },
      { name: "Hair Colour", duration: 90, price: 1200, description: "Full colour treatment" },
      { name: "Blow Dry & Spa", duration: 30, price: 350, description: "Deep conditioning wash and blow dry" },
    ],
    spa: [
      { name: "Swedish Massage", duration: 60, price: 1500, description: "Full body relaxation massage" },
      { name: "Deep Tissue Therapy", duration: 60, price: 1800, description: "Therapeutic deep tissue work" },
      { name: "Aromatherapy Facial", duration: 60, price: 1200, description: "Brightening skin treatment" },
    ],
    clinic: [
      { name: "General Consultation", duration: 20, price: 500, description: "Specialist doctor consultation" },
      { name: "Follow-up Visit", duration: 15, price: 300, description: "Routine health assessment" },
    ],
    dentist: [
      { name: "Dental Examination", duration: 30, price: 400, description: "Comprehensive dental screening and checkup" },
      { name: "Teeth Cleaning & Scaling", duration: 45, price: 800, description: "Professional polishing and plaque removal" },
      { name: "Cavity Restoration", duration: 45, price: 1200, description: "Composite tooth filling" },
    ],
    gym: [
      { name: "Personal Training Session", duration: 60, price: 800, description: "One-on-one professional fitness coaching" },
      { name: "Fitness Assessment & BMI", duration: 30, price: 500, description: "Body composition profiling and diet consult" },
    ],
    yoga: [
      { name: "Group Yoga Class", duration: 60, price: 350, description: "Guided breathwork and asana practice" },
      { name: "Private Mindfulness Session", duration: 60, price: 800, description: "Customized holistic yoga instruction" },
    ],
  };

  return services[industry.toLowerCase()] ?? [
    { name: "Professional Consultation", duration: 30, price: 500, description: "Initial expert consultation and roadmap" },
    { name: "Standard Session", duration: 60, price: 1000, description: "Comprehensive full service session" },
  ];
}

export function getDefaultWorkingHours() {
  return [
    { day: "MON", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: "TUE", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: "WED", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: "THU", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: "FRI", isOpen: true, openTime: "09:00", closeTime: "19:00" },
    { day: "SAT", isOpen: true, openTime: "10:00", closeTime: "17:00" },
    { day: "SUN", isOpen: false, openTime: "10:00", closeTime: "14:00" },
  ];
}

export function generateSEOMetadata(name: string, industry: string, city?: string | null) {
  return {
    seoTitle: `${name} | Top Rated ${industry}`,
    seoDesc: `Professional ${industry} services in ${city || "your city"}. Book appointments online with instant WhatsApp confirmation.`,
  };
}

export function getFallbackAIContent(name: string, industry: string, city?: string | null, address?: string | null) {
  const cleanCity = city || "your area";
  const tagCity = city ? city.toLowerCase().replace(/\s/g, "") : "localbusiness";
  return {
    description: `Welcome to ${name}, your premier ${industry} destination in ${cleanCity}. We pride ourselves on top-tier expertise, punctuality, and client satisfaction.`,
    seoMeta: `Best ${industry} in ${cleanCity} | ${name}`,
    instagramPost: `✨ Step into excellence at ${name}! 🌟\n\nExperience unmatched ${industry.toLowerCase()} services tailored just for you.\n\n📍 ${address || cleanCity}\n📞 Book online instantly via link in bio!\n\n#${industry.toLowerCase()} #${tagCity} #docodo`,
  };
}
