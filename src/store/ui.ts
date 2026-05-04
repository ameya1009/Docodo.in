import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  billingCycle: 'monthly' | 'annual';
  setBillingCycle: (cycle: 'monthly' | 'annual') => void;
  selectedPlan: string | null;
  setSelectedPlan: (planId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  billingCycle: 'monthly',
  setBillingCycle: (cycle) => set({ billingCycle: cycle }),
  selectedPlan: 'growth', // Default to Growth plan
  setSelectedPlan: (planId) => set({ selectedPlan: planId }),
}));
