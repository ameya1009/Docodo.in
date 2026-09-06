import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  let businessName = "My Business";
  let customers: any[] = [];

  try {
    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
    });

    if (business) {
      businessName = business.name;
      customers = await prisma.customer.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
        include: {
          bookings: {
            orderBy: { date: "desc" },
            take: 5,
            include: { service: true },
          },
        },
      });
    }
  } catch (err) {
    console.warn("[CustomersPage Fallback]:", err);
  }

  return <CustomersClient customers={customers} businessName={businessName} />;
}
