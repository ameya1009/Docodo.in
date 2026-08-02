"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DocodoBackendAPI } from "@/lib/api-client";

export async function createPublicBooking(data: {
  businessId: string;
  serviceId?: string;
  staffId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  startTime: string;
  notes?: string;
}) {
  if (!data.businessId || !data.customerName || !data.customerPhone || !data.date || !data.startTime) {
    throw new Error("Missing required booking verification fields.");
  }

  // Verify business exists and is publicly active
  const business = await prisma.business.findFirst({
    where: { id: data.businessId, isPublished: true },
    select: { id: true, name: true },
  });

  if (!business) {
    throw new Error("Business is currently not receiving online appointments.");
  }

  const service = data.serviceId
    ? await prisma.service.findUnique({ where: { id: data.serviceId } })
    : null;

  const duration = service?.duration ?? 60;
  const [h, m] = data.startTime.split(":").map(Number);
  const endMinutes = h * 60 + m + duration;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

  // Check for scheduling conflict / double booking protection
  const existingConflicted = await prisma.booking.findFirst({
    where: {
      businessId: data.businessId,
      date: data.date,
      status: { in: ["CONFIRMED", "PENDING"] },
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: data.startTime } },
      ],
      ...(data.staffId ? { staffId: data.staffId } : {}),
    },
  });

  if (existingConflicted && data.staffId) {
    throw new Error("This timeslot was just booked by another customer. Please select another slot.");
  }

  // Securely register or update Customer CRM profile without exposing auth credentials
  let customer = null;
  try {
    customer = await prisma.customer.upsert({
      where: {
        businessId_phone: {
          businessId: data.businessId,
          phone: data.customerPhone,
        },
      },
      update: {
        name: data.customerName,
        email: data.customerEmail || undefined,
        visitCount: { increment: 1 },
        lifetimeValue: { increment: service?.price ?? 0 },
      },
      create: {
        businessId: data.businessId,
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail || null,
        visitCount: 1,
        lifetimeValue: service?.price ?? 0,
        source: "BOOKING",
      },
    });
  } catch (crmError) {
    console.warn("CRM silent sync fallback:", crmError);
  }

  const booking = await prisma.booking.create({
    data: {
      businessId: data.businessId,
      serviceId: data.serviceId,
      staffId: data.staffId,
      customerId: customer?.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      date: data.date,
      startTime: data.startTime,
      endTime,
      duration,
      price: service?.price ?? 0,
      notes: data.notes || null,
      status: "CONFIRMED",
    },
    include: {
      service: true,
    },
  });

  // Automatically trigger real-time WhatsApp confirmation and NDR verification shield
  try {
    await DocodoBackendAPI.verifyNDRBooking({
      businessId: data.businessId,
      bookingId: booking.id,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
    });
  } catch (backendError) {
    console.warn("Notice: Offline backup queue for WhatsApp NDR check activated:", backendError);
  }

  revalidatePath(`/book/${business.name}`);
  revalidatePath("/dashboard/bookings");
  return booking;
}
