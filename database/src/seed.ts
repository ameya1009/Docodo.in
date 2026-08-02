import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/docodo";

// Configure Edge-ready Postgres driver connection for Prisma
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Docodo Enterprise SaaS Database Seed...");

  // Clean existing testing records if running in development environment
  if (process.env.NODE_ENV === "development") {
    await prisma.whatsappLog.deleteMany();
    await prisma.codLedger.deleteMany();
    await prisma.ndrDispute.deleteMany();
    await prisma.aiContent.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.service.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.workingHours.deleteMany();
    await prisma.business.deleteMany();
    await prisma.user.deleteMany();
  }

  // 1. Create Demo Business Owner
  const demoOwner = await prisma.user.upsert({
    where: { email: "demo@docodo.in" },
    update: {},
    create: {
      email: "demo@docodo.in",
      name: "Ameya Varma (Demo Owner)",
      role: "OWNER",
      plan: "ENTERPRISE",
      password: "$2a$12$e/samplehashedstringplaceholderforsecurity567", // hash for "password123"
    },
  });

  // 2. Create Sample Indian Local Business Profile
  const sampleBusiness = await prisma.business.upsert({
    where: { slug: "docodo-studio-mumbai" },
    update: {},
    create: {
      slug: "docodo-studio-mumbai",
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

  // 5. Populate Sample CRM Customers & Bookings
  const cust1 = await prisma.customer.create({
    data: {
      businessId: sampleBusiness.id,
      name: "Rajesh Sharma",
      email: "rajesh.s@example.com",
      phone: "+919820012345",
      tags: JSON.stringify(["VIP", "Repeat Client"]),
      visitCount: 6,
      lifetimeValue: 14994,
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      businessId: sampleBusiness.id,
      name: "Priyanka Desai",
      email: "priyanka.d@example.com",
      phone: "+919830054321",
      tags: JSON.stringify(["New", "WhatsApp Verified"]),
      visitCount: 1,
      lifetimeValue: 2499,
    },
  });

  const firstService = await prisma.service.findFirst({ where: { businessId: sampleBusiness.id } });

  await prisma.booking.create({
    data: {
      businessId: sampleBusiness.id,
      serviceId: firstService?.id,
      customerId: cust1.id,
      customerName: cust1.name,
      customerEmail: cust1.email,
      customerPhone: cust1.phone,
      date: new Date().toISOString().split("T")[0],
      startTime: "14:30",
      endTime: "16:00",
      duration: 90,
      price: 2499,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
    },
  });

  // 6. Populate Sample WhatsApp Automation Logs & NDR Records
  await prisma.whatsappLog.createMany({
    data: [
      {
        businessId: sampleBusiness.id,
        recipient: "+919820012345",
        messageType: "BOOKING_CONFIRM",
        content: "Hi Rajesh, your appointment for Ayurvedic Herbal Massage at Docodo Spa is confirmed for 2:30 PM today!",
        status: "READ",
      },
      {
        businessId: sampleBusiness.id,
        recipient: "+919830054321",
        messageType: "REMINDER_24HR",
        content: "Hi Priyanka, this is a reminder for your relaxing session tomorrow at Docodo Spa. Reply 1 to Confirm or 2 to Reschedule.",
        status: "DELIVERED",
      },
    ],
  });

  console.log("✅ Docodo Enterprise Database successfully seeded with demo business:", sampleBusiness.name);
}

main()
  .catch((e) => {
    console.error("❌ Error running database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
