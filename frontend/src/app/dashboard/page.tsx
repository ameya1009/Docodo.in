import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/actions/dashboard";
import DashboardHome from "./DashboardHome";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const data = await getDashboardData();
  if (!data) redirect("/onboarding/step/1");

  return <DashboardHome data={data} />;
}
