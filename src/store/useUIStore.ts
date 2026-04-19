import { create } from 'zustand'

interface UIState {
  explanationDrawerOpen: boolean
  activeExplanationKey: string | null
  activeDivisionFilter: string
  mobileMenuOpen: boolean
  openExplanation: (key: string) => void
  closeExplanation: () => void
  setDivisionFilter: (division: string) => void
  setMobileMenu: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  explanationDrawerOpen: false,
  activeExplanationKey: null,
  activeDivisionFilter: 'all',
  mobileMenuOpen: false,

  openExplanation: (key) =>
    set({ explanationDrawerOpen: true, activeExplanationKey: key }),

  closeExplanation: () =>
    set({ explanationDrawerOpen: false, activeExplanationKey: null }),

  setDivisionFilter: (division) =>
    set({ activeDivisionFilter: division }),

  setMobileMenu: (open) =>
    set({ mobileMenuOpen: open }),
}))
