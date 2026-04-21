import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { applyThemeToDOM } from '../../theme/themeValues'
import MemoNav from './MemoNav'
import ReadingProgress from './ReadingProgress'
import type { MemoSection } from '../../hooks/useMemoNavigation'

const SECTIONS: MemoSection[] = [
  { id: 'hero', label: 'Cover' },
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'investment-overview', label: 'Investment Overview' },
  { id: 'platform', label: 'Platform Architecture' },
  { id: 'home-services', label: 'Home Services' },
  { id: 'sales-engine', label: 'Sales & Acquisition' },
  { id: 'grants', label: 'Grant Advantage' },
  { id: 'solar', label: 'Distributed Solar' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'aerial-insights', label: 'Aerial Insights' },
  { id: 'capital-deployment', label: 'Capital Deployment' },
  { id: 'projections', label: 'Financial Projections' },
  { id: 'scenarios', label: 'Scenario Analysis' },
  { id: 'investor-returns', label: 'Investor Returns' },
  { id: 'residual-income', label: 'Residual Income' },
  { id: 'qualifications', label: 'Qualifications' },
  { id: 'impact', label: 'Strategic Impact' },
  { id: 'closing', label: 'Investment Thesis' },
]

export { SECTIONS }

export default function MemoLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyThemeToDOM()
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <div className="min-h-screen bg-surface relative">
      {/* Ambient background treatments — matching main proposal tone */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.7]"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 50% -5%, rgba(74,124,89,0.08), transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-grid-pattern) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-pattern) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <ReadingProgress />
      <MemoNav sections={SECTIONS} />

      <div className="relative z-10 lg:ml-[240px]">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-14 lg:pt-0 pb-32">
          {children}
        </div>
      </div>
    </div>
  )
}
