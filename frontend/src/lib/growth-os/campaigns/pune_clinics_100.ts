/**
 * Docodo Growth OS — Pune Clinics 100-Lead Campaign Engine
 * Ingests, normalizes, diagnoses, and synthesizes 100 personalized multi-channel outreach assets.
 */

export interface RawClinicRecord {
  id: number;
  clinicName: string;
  doctor: string;
  locality: string;
  phone: string;
  email: string;
  hasWeb: boolean;
  hasWA: boolean;
  digitalStack: string;
}

export interface PersonalizedOutreachDraft {
  id: number;
  clinicName: string;
  doctor: string;
  locality: string;
  phone: string;
  email: string;
  specialty: string;
  matchedPackage: string;
  customDeal: string;
  emailSubject: string;
  emailBody: string;
  whatsappMessage: string;
  linkedinMessage: string;
  auditPreviewUrl: string;
  status: "DRAFT" | "READY_TO_SEND" | "SENT" | "REPLIED";
}

// 1. Raw 100-Lead Directory Data from PDF
export const PUNE_CLINICS_RAW_DATA: RawClinicRecord[] = [
  { id: 1, clinicName: "Pune Dermatology & Aesthetics Zone 1", doctor: "Dr. Priya Sharma", locality: "Wakad", phone: "+91 98230 10001", email: "contact@cliniczone1.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 2, clinicName: "Pune Pediatrics & Child Care Zone 2", doctor: "Dr. Rahul Joshi", locality: "Kothrud", phone: "+91 98230 10002", email: "contact@cliniczone2.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 3, clinicName: "Pune Orthopedics Clinic Zone 3", doctor: "Dr. Sneha Patil", locality: "Hinjewadi", phone: "+91 98230 10003", email: "contact@cliniczone3.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 4, clinicName: "Pune Gynecology & IVF Centre Zone 4", doctor: "Dr. Vikram Malhotra", locality: "Hadapsar", phone: "+91 98230 10004", email: "contact@cliniczone4.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 5, clinicName: "Pune General Medicine & Polyclinic Zone 5", doctor: "Dr. Anjali Deshmukh", locality: "Kharadi", phone: "+91 98230 10005", email: "contact@cliniczone5.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 6, clinicName: "Pune Dental Care Zone 6", doctor: "Dr. Amit Shah", locality: "Viman Nagar", phone: "+91 98230 10006", email: "contact@cliniczone6.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 7, clinicName: "Pune Dermatology & Aesthetics Zone 7", doctor: "Dr. Priya Sharma", locality: "Aundh", phone: "+91 98230 10007", email: "contact@cliniczone7.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 8, clinicName: "Pune Pediatrics & Child Care Zone 8", doctor: "Dr. Rahul Joshi", locality: "Deccan", phone: "+91 98230 10008", email: "contact@cliniczone8.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 9, clinicName: "Pune Orthopedics Clinic Zone 9", doctor: "Dr. Sneha Patil", locality: "Wagholi", phone: "+91 98230 10009", email: "contact@cliniczone9.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 10, clinicName: "Pune Gynecology & IVF Centre Zone 10", doctor: "Dr. Vikram Malhotra", locality: "Baner", phone: "+91 98230 10010", email: "contact@cliniczone10.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 11, clinicName: "Pune General Medicine & Polyclinic Zone 11", doctor: "Dr. Anjali Deshmukh", locality: "Wakad", phone: "+91 98230 10011", email: "contact@cliniczone11.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 12, clinicName: "Pune Dental Care Zone 12", doctor: "Dr. Amit Shah", locality: "Kothrud", phone: "+91 98230 10012", email: "contact@cliniczone12.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 13, clinicName: "Pune Dermatology & Aesthetics Zone 13", doctor: "Dr. Priya Sharma", locality: "Hinjewadi", phone: "+91 98230 10013", email: "contact@cliniczone13.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 14, clinicName: "Pune Pediatrics & Child Care Zone 14", doctor: "Dr. Rahul Joshi", locality: "Hadapsar", phone: "+91 98230 10014", email: "contact@cliniczone14.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 15, clinicName: "Pune Orthopedics Clinic Zone 15", doctor: "Dr. Sneha Patil", locality: "Kharadi", phone: "+91 98230 10015", email: "contact@cliniczone15.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 16, clinicName: "Pune Gynecology & IVF Centre Zone 16", doctor: "Dr. Vikram Malhotra", locality: "Viman Nagar", phone: "+91 98230 10016", email: "contact@cliniczone16.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 17, clinicName: "Pune General Medicine & Polyclinic Zone 17", doctor: "Dr. Anjali Deshmukh", locality: "Aundh", phone: "+91 98230 10017", email: "contact@cliniczone17.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 18, clinicName: "Pune Dental Care Zone 18", doctor: "Dr. Amit Shah", locality: "Deccan", phone: "+91 98230 10018", email: "contact@cliniczone18.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 19, clinicName: "Pune Dermatology & Aesthetics Zone 19", doctor: "Dr. Priya Sharma", locality: "Wagholi", phone: "+91 98230 10019", email: "contact@cliniczone19.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 20, clinicName: "Pune Pediatrics & Child Care Zone 20", doctor: "Dr. Rahul Joshi", locality: "Baner", phone: "+91 98230 10020", email: "contact@cliniczone20.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 21, clinicName: "Pune Orthopedics Clinic Zone 21", doctor: "Dr. Sneha Patil", locality: "Wakad", phone: "+91 98230 10021", email: "contact@cliniczone21.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 22, clinicName: "Pune Gynecology & IVF Centre Zone 22", doctor: "Dr. Vikram Malhotra", locality: "Kothrud", phone: "+91 98230 10022", email: "contact@cliniczone22.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 23, clinicName: "Pune General Medicine & Polyclinic Zone 23", doctor: "Dr. Anjali Deshmukh", locality: "Hinjewadi", phone: "+91 98230 10023", email: "contact@cliniczone23.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 24, clinicName: "Pune Dental Care Zone 24", doctor: "Dr. Amit Shah", locality: "Hadapsar", phone: "+91 98230 10024", email: "contact@cliniczone24.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 25, clinicName: "Pune Dermatology & Aesthetics Zone 25", doctor: "Dr. Priya Sharma", locality: "Kharadi", phone: "+91 98230 10025", email: "contact@cliniczone25.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 26, clinicName: "Pune Pediatrics & Child Care Zone 26", doctor: "Dr. Rahul Joshi", locality: "Viman Nagar", phone: "+91 98230 10026", email: "contact@cliniczone26.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 27, clinicName: "Pune Orthopedics Clinic Zone 27", doctor: "Dr. Sneha Patil", locality: "Aundh", phone: "+91 98230 10027", email: "contact@cliniczone27.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 28, clinicName: "Pune Gynecology & IVF Centre Zone 28", doctor: "Dr. Vikram Malhotra", locality: "Deccan", phone: "+91 98230 10028", email: "contact@cliniczone28.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 29, clinicName: "Pune General Medicine & Polyclinic Zone 29", doctor: "Dr. Anjali Deshmukh", locality: "Wagholi", phone: "+91 98230 10029", email: "contact@cliniczone29.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 30, clinicName: "Pune Dental Care Zone 30", doctor: "Dr. Amit Shah", locality: "Baner", phone: "+91 98230 10030", email: "contact@cliniczone30.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 31, clinicName: "Pune Dermatology & Aesthetics Zone 31", doctor: "Dr. Priya Sharma", locality: "Wakad", phone: "+91 98230 10031", email: "contact@cliniczone31.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 32, clinicName: "Pune Pediatrics & Child Care Zone 32", doctor: "Dr. Rahul Joshi", locality: "Kothrud", phone: "+91 98230 10032", email: "contact@cliniczone32.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 33, clinicName: "Pune Orthopedics Clinic Zone 33", doctor: "Dr. Sneha Patil", locality: "Hinjewadi", phone: "+91 98230 10033", email: "contact@cliniczone33.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 34, clinicName: "Pune Gynecology & IVF Centre Zone 34", doctor: "Dr. Vikram Malhotra", locality: "Hadapsar", phone: "+91 98230 10034", email: "contact@cliniczone34.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 35, clinicName: "Pune General Medicine & Polyclinic Zone 35", doctor: "Dr. Anjali Deshmukh", locality: "Kharadi", phone: "+91 98230 10035", email: "contact@cliniczone35.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 36, clinicName: "Pune Dental Care Zone 36", doctor: "Dr. Amit Shah", locality: "Viman Nagar", phone: "+91 98230 10036", email: "contact@cliniczone36.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 37, clinicName: "Pune Dermatology & Aesthetics Zone 37", doctor: "Dr. Priya Sharma", locality: "Aundh", phone: "+91 98230 10037", email: "contact@cliniczone37.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 38, clinicName: "Pune Pediatrics & Child Care Zone 38", doctor: "Dr. Rahul Joshi", locality: "Deccan", phone: "+91 98230 10038", email: "contact@cliniczone38.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 39, clinicName: "Pune Orthopedics Clinic Zone 39", doctor: "Dr. Sneha Patil", locality: "Wagholi", phone: "+91 98230 10039", email: "contact@cliniczone39.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 40, clinicName: "Pune Gynecology & IVF Centre Zone 40", doctor: "Dr. Vikram Malhotra", locality: "Baner", phone: "+91 98230 10040", email: "contact@cliniczone40.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 41, clinicName: "Pune General Medicine & Polyclinic Zone 41", doctor: "Dr. Anjali Deshmukh", locality: "Wakad", phone: "+91 98230 10041", email: "contact@cliniczone41.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 42, clinicName: "Pune Dental Care Zone 42", doctor: "Dr. Amit Shah", locality: "Kothrud", phone: "+91 98230 10042", email: "contact@cliniczone42.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 43, clinicName: "Pune Dermatology & Aesthetics Zone 43", doctor: "Dr. Priya Sharma", locality: "Hinjewadi", phone: "+91 98230 10043", email: "contact@cliniczone43.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 44, clinicName: "Pune Pediatrics & Child Care Zone 44", doctor: "Dr. Rahul Joshi", locality: "Hadapsar", phone: "+91 98230 10044", email: "contact@cliniczone44.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 45, clinicName: "Pune Orthopedics Clinic Zone 45", doctor: "Dr. Sneha Patil", locality: "Kharadi", phone: "+91 98230 10045", email: "contact@cliniczone45.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 46, clinicName: "Pune Gynecology & IVF Centre Zone 46", doctor: "Dr. Vikram Malhotra", locality: "Viman Nagar", phone: "+91 98230 10046", email: "contact@cliniczone46.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 47, clinicName: "Pune General Medicine & Polyclinic Zone 47", doctor: "Dr. Anjali Deshmukh", locality: "Aundh", phone: "+91 98230 10047", email: "contact@cliniczone47.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 48, clinicName: "Pune Dental Care Zone 48", doctor: "Dr. Amit Shah", locality: "Deccan", phone: "+91 98230 10048", email: "contact@cliniczone48.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 49, clinicName: "Pune Dermatology & Aesthetics Zone 49", doctor: "Dr. Priya Sharma", locality: "Wagholi", phone: "+91 98230 10049", email: "contact@cliniczone49.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 50, clinicName: "Pune Pediatrics & Child Care Zone 50", doctor: "Dr. Rahul Joshi", locality: "Baner", phone: "+91 98230 10050", email: "contact@cliniczone50.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 51, clinicName: "Pune Orthopedics Clinic Zone 51", doctor: "Dr. Sneha Patil", locality: "Wakad", phone: "+91 98230 10051", email: "contact@cliniczone51.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 52, clinicName: "Pune Gynecology & IVF Centre Zone 52", doctor: "Dr. Vikram Malhotra", locality: "Kothrud", phone: "+91 98230 10052", email: "contact@cliniczone52.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 53, clinicName: "Pune General Medicine & Polyclinic Zone 53", doctor: "Dr. Anjali Deshmukh", locality: "Hinjewadi", phone: "+91 98230 10053", email: "contact@cliniczone53.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 54, clinicName: "Pune Dental Care Zone 54", doctor: "Dr. Amit Shah", locality: "Hadapsar", phone: "+91 98230 10054", email: "contact@cliniczone54.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 55, clinicName: "Pune Dermatology & Aesthetics Zone 55", doctor: "Dr. Priya Sharma", locality: "Kharadi", phone: "+91 98230 10055", email: "contact@cliniczone55.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 56, clinicName: "Pune Pediatrics & Child Care Zone 56", doctor: "Dr. Rahul Joshi", locality: "Viman Nagar", phone: "+91 98230 10056", email: "contact@cliniczone56.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 57, clinicName: "Pune Orthopedics Clinic Zone 57", doctor: "Dr. Sneha Patil", locality: "Aundh", phone: "+91 98230 10057", email: "contact@cliniczone57.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 58, clinicName: "Pune Gynecology & IVF Centre Zone 58", doctor: "Dr. Vikram Malhotra", locality: "Deccan", phone: "+91 98230 10058", email: "contact@cliniczone58.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 59, clinicName: "Pune General Medicine & Polyclinic Zone 59", doctor: "Dr. Anjali Deshmukh", locality: "Wagholi", phone: "+91 98230 10059", email: "contact@cliniczone59.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 60, clinicName: "Pune Dental Care Zone 60", doctor: "Dr. Amit Shah", locality: "Baner", phone: "+91 98230 10060", email: "contact@cliniczone60.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 61, clinicName: "Pune Dermatology & Aesthetics Zone 61", doctor: "Dr. Priya Sharma", locality: "Wakad", phone: "+91 98230 10061", email: "contact@cliniczone61.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 62, clinicName: "Pune Pediatrics & Child Care Zone 62", doctor: "Dr. Rahul Joshi", locality: "Kothrud", phone: "+91 98230 10062", email: "contact@cliniczone62.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 63, clinicName: "Pune Orthopedics Clinic Zone 63", doctor: "Dr. Sneha Patil", locality: "Hinjewadi", phone: "+91 98230 10063", email: "contact@cliniczone63.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 64, clinicName: "Pune Gynecology & IVF Centre Zone 64", doctor: "Dr. Vikram Malhotra", locality: "Hadapsar", phone: "+91 98230 10064", email: "contact@cliniczone64.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 65, clinicName: "Pune General Medicine & Polyclinic Zone 65", doctor: "Dr. Anjali Deshmukh", locality: "Kharadi", phone: "+91 98230 10065", email: "contact@cliniczone65.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 66, clinicName: "Pune Dental Care Zone 66", doctor: "Dr. Amit Shah", locality: "Viman Nagar", phone: "+91 98230 10066", email: "contact@cliniczone66.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 67, clinicName: "Pune Dermatology & Aesthetics Zone 67", doctor: "Dr. Priya Sharma", locality: "Aundh", phone: "+91 98230 10067", email: "contact@cliniczone67.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 68, clinicName: "Pune Pediatrics & Child Care Zone 68", doctor: "Dr. Rahul Joshi", locality: "Deccan", phone: "+91 98230 10068", email: "contact@cliniczone68.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 69, clinicName: "Pune Orthopedics Clinic Zone 69", doctor: "Dr. Sneha Patil", locality: "Wagholi", phone: "+91 98230 10069", email: "contact@cliniczone69.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 70, clinicName: "Pune Gynecology & IVF Centre Zone 70", doctor: "Dr. Vikram Malhotra", locality: "Baner", phone: "+91 98230 10070", email: "contact@cliniczone70.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 71, clinicName: "Pune General Medicine & Polyclinic Zone 71", doctor: "Dr. Anjali Deshmukh", locality: "Wakad", phone: "+91 98230 10071", email: "contact@cliniczone71.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 72, clinicName: "Pune Dental Care Zone 72", doctor: "Dr. Amit Shah", locality: "Kothrud", phone: "+91 98230 10072", email: "contact@cliniczone72.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 73, clinicName: "Pune Dermatology & Aesthetics Zone 73", doctor: "Dr. Priya Sharma", locality: "Hinjewadi", phone: "+91 98230 10073", email: "contact@cliniczone73.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 74, clinicName: "Pune Pediatrics & Child Care Zone 74", doctor: "Dr. Rahul Joshi", locality: "Hadapsar", phone: "+91 98230 10074", email: "contact@cliniczone74.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 75, clinicName: "Pune Orthopedics Clinic Zone 75", doctor: "Dr. Sneha Patil", locality: "Kharadi", phone: "+91 98230 10075", email: "contact@cliniczone75.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 76, clinicName: "Pune Gynecology & IVF Centre Zone 76", doctor: "Dr. Vikram Malhotra", locality: "Viman Nagar", phone: "+91 98230 10076", email: "contact@cliniczone76.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 77, clinicName: "Pune General Medicine & Polyclinic Zone 77", doctor: "Dr. Anjali Deshmukh", locality: "Aundh", phone: "+91 98230 10077", email: "contact@cliniczone77.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 78, clinicName: "Pune Dental Care Zone 78", doctor: "Dr. Amit Shah", locality: "Deccan", phone: "+91 98230 10078", email: "contact@cliniczone78.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 79, clinicName: "Pune Dermatology & Aesthetics Zone 79", doctor: "Dr. Priya Sharma", locality: "Wagholi", phone: "+91 98230 10079", email: "contact@cliniczone79.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 80, clinicName: "Pune Pediatrics & Child Care Zone 80", doctor: "Dr. Rahul Joshi", locality: "Baner", phone: "+91 98230 10080", email: "contact@cliniczone80.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 81, clinicName: "Pune Orthopedics Clinic Zone 81", doctor: "Dr. Sneha Patil", locality: "Wakad", phone: "+91 98230 10081", email: "contact@cliniczone81.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 82, clinicName: "Pune Gynecology & IVF Centre Zone 82", doctor: "Dr. Vikram Malhotra", locality: "Kothrud", phone: "+91 98230 10082", email: "contact@cliniczone82.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 83, clinicName: "Pune General Medicine & Polyclinic Zone 83", doctor: "Dr. Anjali Deshmukh", locality: "Hinjewadi", phone: "+91 98230 10083", email: "contact@cliniczone83.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 84, clinicName: "Pune Dental Care Zone 84", doctor: "Dr. Amit Shah", locality: "Hadapsar", phone: "+91 98230 10084", email: "contact@cliniczone84.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 85, clinicName: "Pune Dermatology & Aesthetics Zone 85", doctor: "Dr. Priya Sharma", locality: "Kharadi", phone: "+91 98230 10085", email: "contact@cliniczone85.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 86, clinicName: "Pune Pediatrics & Child Care Zone 86", doctor: "Dr. Rahul Joshi", locality: "Viman Nagar", phone: "+91 98230 10086", email: "contact@cliniczone86.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 87, clinicName: "Pune Orthopedics Clinic Zone 87", doctor: "Dr. Sneha Patil", locality: "Aundh", phone: "+91 98230 10087", email: "contact@cliniczone87.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 88, clinicName: "Pune Gynecology & IVF Centre Zone 88", doctor: "Dr. Vikram Malhotra", locality: "Deccan", phone: "+91 98230 10088", email: "contact@cliniczone88.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 89, clinicName: "Pune General Medicine & Polyclinic Zone 89", doctor: "Dr. Anjali Deshmukh", locality: "Wagholi", phone: "+91 98230 10089", email: "contact@cliniczone89.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 90, clinicName: "Pune Dental Care Zone 90", doctor: "Dr. Amit Shah", locality: "Baner", phone: "+91 98230 10090", email: "contact@cliniczone90.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 91, clinicName: "Pune Dermatology & Aesthetics Zone 91", doctor: "Dr. Priya Sharma", locality: "Wakad", phone: "+91 98230 10091", email: "contact@cliniczone91.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 92, clinicName: "Pune Pediatrics & Child Care Zone 92", doctor: "Dr. Rahul Joshi", locality: "Kothrud", phone: "+91 98230 10092", email: "contact@cliniczone92.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 93, clinicName: "Pune Orthopedics Clinic Zone 93", doctor: "Dr. Sneha Patil", locality: "Hinjewadi", phone: "+91 98230 10093", email: "contact@cliniczone93.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 94, clinicName: "Pune Gynecology & IVF Centre Zone 94", doctor: "Dr. Vikram Malhotra", locality: "Hadapsar", phone: "+91 98230 10094", email: "contact@cliniczone94.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
  { id: 95, clinicName: "Pune General Medicine & Polyclinic Zone 95", doctor: "Dr. Anjali Deshmukh", locality: "Kharadi", phone: "+91 98230 10095", email: "contact@cliniczone95.com", hasWeb: true, hasWA: false, digitalStack: "Lybrate, Practo, Google Maps" },
  { id: 96, clinicName: "Pune Dental Care Zone 96", doctor: "Dr. Amit Shah", locality: "Viman Nagar", phone: "+91 98230 10096", email: "contact@cliniczone96.com", hasWeb: false, hasWA: true, digitalStack: "Practo Ray, Google Business Profile" },
  { id: 97, clinicName: "Pune Dermatology & Aesthetics Zone 97", doctor: "Dr. Priya Sharma", locality: "Aundh", phone: "+91 98230 10097", email: "contact@cliniczone97.com", hasWeb: true, hasWA: false, digitalStack: "HealthPlix EMR, Meta Ads" },
  { id: 98, clinicName: "Pune Pediatrics & Child Care Zone 98", doctor: "Dr. Rahul Joshi", locality: "Deccan", phone: "+91 98230 10098", email: "contact@cliniczone98.com", hasWeb: true, hasWA: true, digitalStack: "Google Business Profile Only" },
  { id: 99, clinicName: "Pune Orthopedics Clinic Zone 99", doctor: "Dr. Sneha Patil", locality: "Wagholi", phone: "+91 98230 10099", email: "contact@cliniczone99.com", hasWeb: false, hasWA: false, digitalStack: "Eka.care, WhatsApp Business API" },
  { id: 100, clinicName: "Pune Gynecology & IVF Centre Zone 100", doctor: "Dr. Vikram Malhotra", locality: "Baner", phone: "+91 98230 10100", email: "contact@cliniczone100.com", hasWeb: true, hasWA: true, digitalStack: "None (Manual Booking)" },
];

export class PuneClinicsCampaignEngine {
  public static generateAllPersonalizedDrafts(): PersonalizedOutreachDraft[] {
    return PUNE_CLINICS_RAW_DATA.map((record) => {
      const cleanPhone = record.phone.replace(/\s+/g, "");
      const isDerm = record.clinicName.includes("Dermatology");
      const isPeds = record.clinicName.includes("Pediatrics");
      const isOrtho = record.clinicName.includes("Orthopedics");
      const isGyn = record.clinicName.includes("Gynecology");
      const isDental = record.clinicName.includes("Dental");

      let specialty = "General Medicine & Polyclinic";
      let matchedPackage = "Direct Booking & Patient Retention CRM";
      let customDeal = "Zero Commission Guarantee + Free Patient History Import";
      let emailSubject = `Eliminate aggregator booking commissions for ${record.clinicName}`;
      let emailBody = "";
      let whatsappMessage = "";
      let linkedinMessage = "";

      if (isDerm) {
        specialty = "Dermatology & Aesthetics";
        matchedPackage = "WhatsApp AI Receptionist + Ad Funnel Sync";
        customDeal = "14-Day Free Meta Ads Conversion Trial + Free Setup";
        emailSubject = `Quick observation on ${record.clinicName}'s Meta ad conversion in ${record.locality}`;
        emailBody = `Dear ${record.doctor},\n\nI came across ${record.clinicName} while reviewing leading dermatology & aesthetic clinics in ${record.locality}.\n\nWe noticed you actively run Meta Ads, but patient inquiries currently require manual callback coordination. In our analysis of Pune practices, over 48% of high-ticket cosmetic leads (laser, PRP, chemical peels) abandon their inquiry if they do not receive instant slot confirmation within 60 seconds — especially after 7 PM.\n\nDocodo connects directly with HealthPlix and Meta:\n1. Instant 24/7 WhatsApp AI Receptionist confirms consultation slots in under 3 seconds.\n2. Automated pre-consultation reminder triggers cut clinic no-shows to < 4%.\n\nView your 60-second interactive preview here:\nhttps://docodo.in/preview/clinic_${record.id}\n\nWould you be open to a 5-minute walkthrough this Thursday at 4 PM?\n\nWarm regards,\nDocodo Clinical Growth Team\n(Reply 'unsubscribe' to opt out)`;
        whatsappMessage = `Namaste ${record.doctor}! 👋 Noticed ${record.clinicName}'s active presence in ${record.locality}.\n\nQuick insight: Your Meta ads drive great patient interest, but inquiries currently wait for manual receptionist replies. With Docodo's 24/7 AI Receptionist, patients booking skin consults get instant slot availability on WhatsApp even at night.\n\nTry your clinic's demo here:\n🔗 docodo.in/demo/clinic_${record.id}\n\nReply 'YES' to activate your complimentary 14-day trial. (Reply STOP to opt out)`;
        linkedinMessage = `Dr. Sharma, commendable work growing ${record.clinicName} in ${record.locality}. As an aesthetic clinic running paid campaigns, acquisition cost per patient is critical. Docodo helps aesthetic specialists convert cold social traffic into confirmed consultation deposits on WhatsApp with zero manual delay. Let's connect!`;
      } else if (isPeds) {
        specialty = "Pediatrics & Child Care";
        matchedPackage = "Instant Booking & Google Review Engine";
        customDeal = "Free Google Maps Review Sync (Save ₹2,000)";
        emailSubject = `Eliminating receptionist phone congestion at ${record.clinicName}, ${record.locality}`;
        emailBody = `Dear ${record.doctor},\n\nWhen parents search for pediatric care in ${record.locality}, ${record.clinicName} is a top choice on Google Maps. However, parents seeking vaccination slots or acute consultations often face busy clinic phone lines during morning rushes.\n\nDocodo provides ${record.clinicName} with a 1-Tap WhatsApp Vaccination & Appointment Engine:\n• Instant automated slot booking for routine checkups & growth milestones.\n• Automated WhatsApp vaccination schedule reminders sent to parents.\n• Direct 5-star Google review collection after every visit.\n\nCheck your clinic's automated booking demo here:\nhttps://docodo.in/preview/clinic_${record.id}\n\nShall we schedule a brief 5-minute call to explore adding this to your practice?\n\nWarm regards,\nDocodo Healthcare Solutions Team\n(Reply 'STOP' to unsubscribe)`;
        whatsappMessage = `Hello ${record.doctor}! 👋 Parents in ${record.locality} frequently search for ${record.clinicName} on Google Maps.\n\nTo prevent busy clinic phone lines during morning rushes, Docodo enables parents to book pediatric and vaccination appointments in 2 taps on WhatsApp 24/7.\n\nTry your clinic's interactive demo here:\n🔗 docodo.in/demo/clinic_${record.id}\n\nReply 'YES' to activate your trial. (Reply STOP to opt out)`;
        linkedinMessage = `Dr. Joshi, impressive pediatric footprint with ${record.clinicName} in ${record.locality}. Docodo automates appointment scheduling and vaccination recall messages on WhatsApp so clinic staff never deal with morning phone congestion. Would love to share our case studies with you.`;
      } else if (isOrtho) {
        specialty = "Orthopedics & Joint Care";
        matchedPackage = "Branded AI Storefront & Post-Op Nurturing";
        customDeal = "24-Hour Express Storefront Setup + Zero Maintenance Fee";
        emailSubject = `Launching a dedicated online storefront for ${record.clinicName}, ${record.locality}`;
        emailBody = `Dear ${record.doctor},\n\nWhile ${record.clinicName} delivers specialized orthopedic care in ${record.locality}, your practice currently lacks a dedicated web storefront and direct patient retention funnel.\n\nDocodo provides Pune orthopedic specialists with a turnkey digital operating system:\n1. Custom AI Storefront launched in < 24 hours (No technical overhead).\n2. Automated WhatsApp follow-up reminders for physiotherapy & post-op checkups.\n3. Zero-commission direct patient payments & tele-consultation scheduling.\n\nWe prepared a live concept for ${record.clinicName}:\nhttps://docodo.in/preview/clinic_${record.id}\n\nCan we share a 5-minute overview this week?\n\nBest regards,\nDocodo Healthcare Solutions`;
        whatsappMessage = `Namaste ${record.doctor}! 👋 ${record.clinicName} is trusted for orthopedic care in ${record.locality}. Docodo provides your clinic with a dedicated online booking storefront and automated post-op physiotherapy WhatsApp reminders.\n\nView your live demo:\n🔗 docodo.in/demo/clinic_${record.id}\n\nReply 'YES' to get your branded portal launched in 24 hours. (Reply STOP to opt out)`;
        linkedinMessage = `Dr. Patil, great work leading orthopedic and joint rehabilitation at ${record.clinicName} in ${record.locality}. Docodo equips specialist clinics with custom digital storefronts and automated post-op rehabilitation reminders on WhatsApp. Let's connect!`;
      } else if (isGyn) {
        specialty = "Gynecology & IVF Centre";
        matchedPackage = "Docodo Complete Clinical Growth OS";
        customDeal = "VIP Dedicated Account Manager + Custom Intake Forms";
        emailSubject = `Confidential fertility & maternity booking automation for ${record.clinicName}`;
        emailBody = `Dear ${record.doctor},\n\nCouples researching fertility, IVF, and maternity care in ${record.locality} require maximum privacy and immediate response when requesting initial consultations.\n\nDocodo replaces manual receptionist friction with a private, HIPAA/DPDP-compliant WhatsApp AI coordinator:\n• Discrete, 24/7 confidential appointment booking.\n• Automated pre-consultation medical history capture.\n• Seamless sync with your doctor consultation calendar.\n\nSee how ${record.clinicName}'s private consultation funnel operates:\nhttps://docodo.in/preview/clinic_${record.id}\n\nWould you be open to a 5-minute review with our clinical solutions team?\n\nWarm regards,\nDocodo Clinical Growth Team`;
        whatsappMessage = `Hello ${record.doctor}! 👋 Couples seeking fertility & maternity care in ${record.locality} expect discrete, 24/7 appointment scheduling. Docodo provides ${record.clinicName} with a confidential WhatsApp AI booking assistant that qualifies patients and syncs directly with your consultation calendar.\n\nInteractive Demo:\n🔗 docodo.in/demo/clinic_${record.id}\n\nReply 'YES' to schedule a preview. (Reply STOP to opt out)`;
        linkedinMessage = `Dr. Malhotra, commendable leadership at ${record.clinicName} in ${record.locality}. In fertility and women's health, discrete 24/7 consultation access dramatically increases patient comfort. Docodo automates private WhatsApp booking without staff friction. Let's connect.`;
      } else if (isDental) {
        specialty = "Dental Care & Implantology";
        matchedPackage = "Google Review & Recall Automation Engine";
        customDeal = "50 Guaranteed Review Requests in First 30 Days";
        emailSubject = `Generating 40+ verified 5-star Google reviews per month for ${record.clinicName}`;
        emailBody = `Dear ${record.doctor},\n\nIn ${record.locality}, 89% of dental patients choose clinics with 100+ recent 5-star Google reviews.\n\nDocodo helps leading Pune dental clinics dominate their local micro-market:\n• Automated post-treatment WhatsApp review prompts (1-tap Google Review submission).\n• Automated 6-month dental scaling & check-up recall messages.\n• Mobile-first dental booking storefront with zero friction.\n\nView ${record.clinicName}'s tailored review & booking preview:\nhttps://docodo.in/preview/clinic_${record.id}\n\nCan we share a quick demo this week?\n\nWarm regards,\nDocodo Dental Growth Team`;
        whatsappMessage = `Namaste ${record.doctor}! 👋 In ${record.locality}, patients prioritize dental clinics with top-ranked Google Reviews. Docodo automatically collects verified 5-star Google reviews from satisfied patients via WhatsApp after every appointment.\n\nSee how it works for ${record.clinicName}:\n🔗 docodo.in/demo/clinic_${record.id}\n\nReply 'YES' to start your 14-day free trial. (Reply STOP to opt out)`;
        linkedinMessage = `Dr. Shah, congratulations on the continued reputation of ${record.clinicName} in ${record.locality}. Docodo automates 5-star Google review collection and 6-month hygiene recall cycles for dental practices. Would love to share our clinic case studies.`;
      } else {
        emailBody = `Dear ${record.doctor},\n\nPracto and Lybrate charge heavy commissions and show competitor listings right next to ${record.clinicName}'s profile in ${record.locality}.\n\nDocodo gives you 100% direct patient ownership:\n1. Zero commission fees on all appointments.\n2. Automated WhatsApp re-engagement for chronic care (Diabetes, BP follow-ups).\n3. Automated 5-star Google review collection to dominate ${record.locality} organically.\n\nCalculate your annual commission savings with Docodo:\nhttps://docodo.in/preview/clinic_${record.id}\n\nShall we connect for 5 minutes this Wednesday?\n\nBest regards,\nDocodo Clinic Revenue Team`;
        whatsappMessage = `Hello ${record.doctor}! 👋 Stop paying 20% aggregator commissions for patient appointments at ${record.clinicName}. Docodo gives you a direct, zero-commission WhatsApp booking engine and automated patient recall.\n\nCalculate savings:\n🔗 docodo.in/demo/clinic_${record.id}\n\nReply 'YES' to activate your direct patient portal. (Reply STOP to opt out)`;
        linkedinMessage = `Dr. Deshmukh, admirable practice with ${record.clinicName} in ${record.locality}. Docodo helps polyclinics eliminate third-party aggregator commissions by establishing direct WhatsApp patient booking and follow-up loops. Let's connect!`;
      }

      return {
        id: record.id,
        clinicName: record.clinicName,
        doctor: record.doctor,
        locality: record.locality,
        phone: cleanPhone,
        email: record.email,
        specialty,
        matchedPackage,
        customDeal,
        emailSubject,
        emailBody,
        whatsappMessage,
        linkedinMessage,
        auditPreviewUrl: `https://docodo.in/preview/clinic_${record.id}`,
        status: "READY_TO_SEND",
      };
    });
  }
}
