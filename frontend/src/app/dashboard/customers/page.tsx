import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  const userId = (session.user as any).id;

  const business = await prisma.business.findFirst({
    where: { ownerId: userId },
    select: { id: true, name: true },
  });
  if (!business) redirect("/onboarding/step/1");

  const customers = await prisma.customer.findMany({
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

  return <CustomersClient customers={customers} businessName={business.name} />;
}
