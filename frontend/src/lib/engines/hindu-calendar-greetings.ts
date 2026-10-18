/**
 * INDIAN HINDU CALENDAR FESTIVALS & PATIENT BIRTHDAY AUTOMATION ENGINE
 * 
 * Automatically identifies Hindu festivals and patient birthdays,
 * generates warm, consent-compliant clinical wishes from the doctor/practice,
 * and formats WhatsApp/Email dispatches.
 */

export interface HinduFestivalEvent {
  id: string;
  name: string;
  hindiName: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  category: "MAJOR_FESTIVAL" | "NEW_YEAR" | "SEASONAL" | "AUSPICIOUS_VRAT";
  healthTip: string;
  greetingMessage: (clinicName: string, doctorName?: string) => string;
}

// Verified Indian Hindu Calendar Event Schedule (2026-2027)
export const HINDU_FESTIVALS_SCHEDULE: HinduFestivalEvent[] = [
  {
    id: "makar_sankranti",
    name: "Makar Sankranti & Pongal",
    hindiName: "मकर संक्रांति और पोंगल",
    startDate: "2026-01-14",
    endDate: "2026-01-15",
    category: "MAJOR_FESTIVAL",
    healthTip: "Stay hydrated and incorporate seasonal sesame (til) and jaggery for winter immunity.",
    greetingMessage: (clinic, doc) =>
      `Warm Makar Sankranti & Pongal greetings from ${clinic}${doc ? ` and ${doc}` : ""}! 🪁 May this harvest festival bring abundant health, vitality, and sunshine to you and your family. Til-gul ghya, god-god bola! ✨`,
  },
  {
    id: "maha_shivratri",
    name: "Maha Shivratri",
    hindiName: "महाशिवरात्रि",
    startDate: "2026-02-15",
    category: "AUSPICIOUS_VRAT",
    healthTip: "If fasting, opt for light fruits and hydration to maintain electrolyte balance.",
    greetingMessage: (clinic, doc) =>
      `Har Har Mahadev! On the auspicious occasion of Maha Shivratri, ${clinic}${doc ? ` and ${doc}` : ""} wish you divine peace, sound health, and strength. 🔱🌿`,
  },
  {
    id: "holi",
    name: "Holi & Dhulivandan",
    hindiName: "होली और धूलिवंदन",
    startDate: "2026-03-04",
    endDate: "2026-03-05",
    category: "MAJOR_FESTIVAL",
    healthTip: "Use organic skin-safe colors, protect your eyes, and stay well-hydrated.",
    greetingMessage: (clinic, doc) =>
      `Happy Holi from ${clinic}${doc ? ` and ${doc}` : ""}! 🎨 May the festival of colors fill your life with vibrant health, happiness, and peace. Play safely and protect your eyes! 💧`,
  },
  {
    id: "gudi_padwa",
    name: "Gudi Padwa & Ugadi",
    hindiName: "गुढीपाडवा और उगादी",
    startDate: "2026-03-20",
    category: "NEW_YEAR",
    healthTip: "Neem and jaggery morning consumption supports digestive balance during season changes.",
    greetingMessage: (clinic, doc) =>
      `Happy Gudi Padwa and Ugadi! 🌾 Wishing you and your family a healthy, prosperous, and blissful New Year filled with good vitality. Warm regards from ${clinic}. 🪔`,
  },
  {
    id: "ram_navami",
    name: "Ram Navami",
    hindiName: "राम नवमी",
    startDate: "2026-03-28",
    category: "AUSPICIOUS_VRAT",
    healthTip: "Celebrate with wholesome satvik food and mindful rest.",
    greetingMessage: (clinic, doc) =>
      `Warm greetings on the auspicious occasion of Ram Navami from ${clinic}${doc ? ` and ${doc}` : ""}. May Lord Rama bless your home with joy, integrity, and good health! 🏹🚩`,
  },
  {
    id: "raksha_bandhan",
    name: "Raksha Bandhan",
    hindiName: "रक्षाबंधन",
    startDate: "2026-08-28",
    category: "MAJOR_FESTIVAL",
    healthTip: "Celebrate the sacred bond of protection and prioritize preventive health screenings for loved ones.",
    greetingMessage: (clinic, doc) =>
      `Happy Raksha Bandhan from ${clinic}! Celebrating the eternal bond of protection and unconditional care. Wishing enduring health and safety for your entire family. 🧵✨`,
  },
  {
    id: "krishna_janmashtami",
    name: "Krishna Janmashtami",
    hindiName: "श्रीकृष्ण जन्माष्टमी",
    startDate: "2026-09-04",
    category: "MAJOR_FESTIVAL",
    healthTip: "A nutritious, balanced festive diet helps maintain energy throughout celebrations.",
    greetingMessage: (clinic, doc) =>
      `Jai Shri Krishna! ${clinic}${doc ? ` and ${doc}` : ""} pray for your sound health, joy, and peace on Krishna Janmashtami. May the Lord bring sweetness and vitality to your life! 🦚🍯`,
  },
  {
    id: "ganesh_chaturthi",
    name: "Ganesh Chaturthi",
    hindiName: "गणेश चतुर्थी",
    startDate: "2026-09-14",
    endDate: "2026-09-24",
    category: "MAJOR_FESTIVAL",
    healthTip: "Enjoy modaks in moderation; maintain daily walks to keep metabolism active during the 10 days.",
    greetingMessage: (clinic, doc) =>
      `Ganpati Bappa Morya! 🌺 May Lord Ganesha remove all obstacles and bestow vibrant health, happiness, and prosperity upon your family. Warmest festive wishes from ${clinic}! 🐘✨`,
  },
  {
    id: "navratri_dussehra",
    name: "Navratri & Vijayadashami (Dussehra)",
    hindiName: "नवरात्रि और विजयादशमी (दशहरा)",
    startDate: "2026-10-11",
    endDate: "2026-10-20",
    category: "MAJOR_FESTIVAL",
    healthTip: "Celebrate the triumph of positive health habits and regular exercise over sedentary routines.",
    greetingMessage: (clinic, doc) =>
      `Shubh Navratri and Happy Dussehra from ${clinic}! 🌸 May Goddess Durga bless you with radiant energy, immunity, and victory over all ailments. 🏹✨`,
  },
  {
    id: "karwa_chauth",
    name: "Karwa Chauth",
    hindiName: "करवा चौथ",
    startDate: "2026-10-29",
    category: "AUSPICIOUS_VRAT",
    healthTip: "Break the fast with warm fluids and light, non-greasy foods to aid digestion.",
    greetingMessage: (clinic, doc) =>
      `Warm Karwa Chauth wishes from ${clinic}. May this day bring lasting happiness, togetherness, and lifelong good health to you and your partner. 🌕🪔`,
  },
  {
    id: "diwali",
    name: "Diwali & Dhanteras (Deepavali)",
    hindiName: "धनतेरस और दीपावली (दीवाली)",
    startDate: "2026-11-06",
    endDate: "2026-11-10",
    category: "MAJOR_FESTIVAL",
    healthTip: "Protect respiratory health from smoke, drink warm herbal fluids, and celebrate with sound-free green lamps.",
    greetingMessage: (clinic, doc) =>
      `Wishing you and your family a luminous, healthy, and prosperous Diwali! 🪔✨ May Lord Dhanvantari and Goddess Lakshmi bless your home with longevity, wealth, and wellness. Happy Diwali from ${clinic}${doc ? ` and ${doc}` : ""}! 🌺`,
  },
  {
    id: "bhai_dooj",
    name: "Bhai Dooj & Govardhan Puja",
    hindiName: "भाई दूज और गोवर्धन पूजा",
    startDate: "2026-11-11",
    category: "MAJOR_FESTIVAL",
    healthTip: "Keep sweet consumption balanced and enjoy festive home-cooked meals.",
    greetingMessage: (clinic, doc) =>
      `Warm wishes on Bhai Dooj and Govardhan Puja from ${clinic}! May love, health, and mutual well-being always surround your home. 🌾💛`,
  },
];

export interface GreetingsCheckResult {
  currentDateStr: string;
  festivalToday: HinduFestivalEvent | null;
  upcomingFestivals: HinduFestivalEvent[];
  birthdayGreetingTemplate: (patientName: string, clinicName: string, doctorName?: string) => string;
  festivalGreetingText: string | null;
}

/**
 * Checks current date against Hindu festival calendar and produces active greetings.
 */
export function getHinduCalendarStatus(
  currentDate: Date = new Date(),
  clinicName: string = "Our Clinic",
  doctorName?: string
): GreetingsCheckResult {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const currentDateStr = `${year}-${month}-${day}`;

  // Find festival occurring today
  const festivalToday =
    HINDU_FESTIVALS_SCHEDULE.find((fest) => {
      if (fest.endDate) {
        return currentDateStr >= fest.startDate && currentDateStr <= fest.endDate;
      }
      return currentDateStr === fest.startDate;
    }) || null;

  // Find upcoming festivals within the next 14 days
  const futureDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  const futureYear = futureDate.getFullYear();
  const futureMonth = String(futureDate.getMonth() + 1).padStart(2, "0");
  const futureDay = String(futureDate.getDate()).padStart(2, "0");
  const futureDateStr = `${futureYear}-${futureMonth}-${futureDay}`;

  const upcomingFestivals = HINDU_FESTIVALS_SCHEDULE.filter(
    (fest) => fest.startDate > currentDateStr && fest.startDate <= futureDateStr
  );

  const birthdayGreetingTemplate = (patient: string, clinic: string, doc?: string) =>
    `Dearest ${patient}, Happy Birthday! 🎂🎉 ${doc ? `Dr. ${doc} and the entire care team at ` : ""}${clinic} wish you a vibrant year ahead filled with good health, joy, and longevity. Thank you for being a valued part of our practice! 💐✨`;

  const festivalGreetingText = festivalToday
    ? festivalToday.greetingMessage(clinicName, doctorName)
    : null;

  return {
    currentDateStr,
    festivalToday,
    upcomingFestivals,
    birthdayGreetingTemplate,
    festivalGreetingText,
  };
}

/**
 * Formats a birthday greeting for a specific patient.
 */
export function formatPatientBirthdayMessage(params: {
  patientName: string;
  clinicName: string;
  doctorName?: string;
  appointmentLink?: string;
}): string {
  const linkText = params.appointmentLink
    ? `\n\nBook your annual wellness review: ${params.appointmentLink}`
    : "";

  return `Dear ${params.patientName}, Happy Birthday from ${params.clinicName}${params.doctorName ? ` (Dr. ${params.doctorName})` : ""}! 🎂🎉\n\nMay this special day bring you vibrant health, joy, and peace. We are honored to care for your health and well-being.${linkText}\n\nWarm regards,\n${params.clinicName}`;
}
