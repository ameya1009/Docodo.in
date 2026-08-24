import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/docodo";
const adapter = new PrismaPg({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Docodo local/staging database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Demo Business Owner
  const demoOwner = await prisma.user.upsert({
    where: { email: "demo@docodo.in" },
    update: { password: hashedPassword },
    create: {
      email: "demo@docodo.in",
      name: "Ameya Varma (Demo Owner)",
      role: "OWNER",
      plan: "ENTERPRISE",
      password: hashedPassword,
    },
  });

  // 2. Create Sample Indian Local Business Profile
  const sampleBusiness = await prisma.business.upsert({
    where: { slug: "docodo-wellness-mumbai" },
    update: { ownerId: demoOwner.id, isPublished: true, onboardingComplete: true },
    create: {
      slug: "docodo-wellness-mumbai",
      name: "Docodo Wellness & Spa Mumbai",
      industry: "salon",
      tagline: "Experience tranquil Ayurvedic relaxation and modern aesthetics in Bandra West.",
      description: "Premier destination for holistic wellness, therapeutic spa treatments, and modern skincare in Mumbai.",
      phone: "+919876543210",
      email: "booking@docodospa.in",
      city: "Mumbai",
      state: "Maharashtra",
      address: "Ground Floor, Linking Road, Bandra West, Mumbai 400050",
      currency: "INR",
      timezone: "Asia/Kolkata",
      isPublished: true,
      onboardingComplete: true,
      ownerId: demoOwner.id,
      primaryColor: "#C8F135",
      accentColor: "#00FFAA",
      style: "luxury",
    },
  });

  // 3. Populate Working Hours
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  for (const day of days) {
    await prisma.workingHours.upsert({
      where: { businessId_day: { businessId: sampleBusiness.id, day } },
      update: {},
      create: {
        businessId: sampleBusiness.id,
        day,
        isOpen: day !== "SUN",
        openTime: "10:00",
        closeTime: "20:00",
      },
    });
  }

  // 4. Populate Catalog Services
  const services = [
    { name: "Ayurvedic Herbal Full Body Massage", duration: 90, price: 2499, description: "Traditional oil-based deep muscle revitalization." },
    { name: "Executive Radiance Facial & Skin Cleanup", duration: 45, price: 1299, description: "Instant cooling detox cleansing for urban pollution relief." },
    { name: "Head, Neck & Shoulder Tension Relief", duration: 30, price: 799, description: "Quick stress dissipation massage for busy professionals." },
  ];

  for (let idx = 0; idx < services.length; idx++) {
    const s = services[idx];
    const existing = await prisma.service.findFirst({
      where: { businessId: sampleBusiness.id, name: s.name },
    });
    if (!existing) {
      await prisma.service.create({
        data: {
          businessId: sampleBusiness.id,
          name: s.name,
          duration: s.duration,
          price: s.price,
          description: s.description,
          order: idx,
        },
      });
    }
  }

  // 5. Populate Sample CRM Customers
  const cust1 = await prisma.customer.upsert({
    where: { businessId_phone: { businessId: sampleBusiness.id, phone: "+919820012345" } },
    update: {},
    create: {
      businessId: sampleBusiness.id,
      name: "Rajesh Sharma",
      email: "rajesh.s@example.com",
      phone: "+919820012345",
      tags: JSON.stringify(["VIP", "Repeat Client"]),
      visitCount: 6,
      lifetimeValue: 14994,
    },
  });

  const firstService = await prisma.service.findFirst({ where: { businessId: sampleBusiness.id } });
  if (firstService) {
    const today = new Date().toISOString().split("T")[0];
    const existingBooking = await prisma.booking.findFirst({
      where: { businessId: sampleBusiness.id, date: today, startTime: "14:30" },
    });
    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          businessId: sampleBusiness.id,
          serviceId: firstService.id,
          customerId: cust1.id,
          customerName: cust1.name,
          customerEmail: cust1.email,
          customerPhone: cust1.phone,
          date: today,
          startTime: "14:30",
          endTime: "16:00",
          duration: 90,
          price: 2499,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paymentMethod: "UPI",
        },
      });
    }
  }

  console.log("✅ Seed complete! Demo credentials: demo@docodo.in / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
