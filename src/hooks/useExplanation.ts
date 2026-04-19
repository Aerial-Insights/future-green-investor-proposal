import { EXPLANATIONS, type ExplanationEntry } from '../data/investorPortal/explanations'
import { useUIStore } from '../store/useUIStore'

export function useExplanation(key: string): ExplanationEntry | null {
  return EXPLANATIONS[key] ?? null
}

export function useExplanationDrawer() {
  const { explanationDrawerOpen, activeExplanationKey, openExplanation, closeExplanation } = useUIStore()
  const explanation = activeExplanationKey ? EXPLANATIONS[activeExplanationKey] ?? null : null

  return {
    isOpen: explanationDrawerOpen,
    explanation,
    key: activeExplanationKey,
    open: openExplanation,
    close: closeExplanation,
  }
}
