import React from "react";
import { getPuneClinicsDraftsAction } from "@/lib/actions/growth-os/dispatch-campaign";
import PuneClinicsClient from "./PuneClinicsClient";

export const dynamic = "force-dynamic";

export default async function PuneClinicsCampaignPage() {
  const drafts = await getPuneClinicsDraftsAction();

  return <PuneClinicsClient initialDrafts={drafts} />;
}
