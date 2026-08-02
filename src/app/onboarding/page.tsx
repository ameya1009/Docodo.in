import { redirect } from "next/navigation";

// /onboarding → redirect to step 1
export default function OnboardingIndex() {
  redirect("/onboarding/step/1");
}
