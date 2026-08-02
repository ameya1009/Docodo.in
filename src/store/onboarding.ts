// Zustand store for onboarding wizard state
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  step: number;
  businessId: string | null;
  slug: string | null;
  // Step 1
  name: string;
  industry: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  about: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  // Step 2
  style: string;
  // Step 3
  primaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  darkMode: boolean;

  setStep: (step: number) => void;
  setBusinessId: (id: string, slug: string) => void;
  setField: (field: string, value: string | boolean) => void;
  reset: () => void;
}

const defaults = {
  step: 1,
  businessId: null,
  slug: null,
  name: "",
  industry: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  about: "",
  instagram: "",
  facebook: "",
  whatsapp: "",
  style: "modern",
  primaryColor: "#2563EB",
  accentColor: "#06B6D4",
  fontHeading: "Inter",
  fontBody: "Inter",
  darkMode: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...defaults,
      setStep: (step) => set({ step }),
      setBusinessId: (businessId, slug) => set({ businessId, slug }),
      setField: (field, value) => set({ [field]: value } as any),
      reset: () => set(defaults),
    }),
    { name: "docodo-onboarding" }
  )
);
