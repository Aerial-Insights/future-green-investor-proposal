import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../theme/animations'
import { STRATEGIC_IMPACT } from '../data/investorPortal/content'

const iconMap: Record<string, JSX.Element> = {
  users: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  zap: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  home: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  'trending-up': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  cpu: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5M4.5 15.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  lock: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  leaf: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-1.5 0-4.5-1.5-6-4.5S4.5 9 4.5 6c3 0 6 .75 7.5 3s1.5 4.5 1.5 6m0 0c1.5 0 4.5-1.5 6-4.5S21 3 21 3c-3 0-6 .75-7.5 3s-1.5 4.5-1.5 6m-1.5 3V9" />
    </svg>
  ),
  award: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 12h-1.5A3.375 3.375 0 007.5 14.25v4.5m9-9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  ),
}

export default function StrategicImpact() {
  return (
    <PageShell fullWidth>
      <SectionBanner
        headline={STRATEGIC_IMPACT.headline}
        subtitle={STRATEGIC_IMPACT.subtitle}
        accentColor="#2d6a4f"
      />

      <div className="section-container py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {STRATEGIC_IMPACT.impacts.map((impact) => (
            <motion.div key={impact.title} variants={staggerItem} className="luxury-card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-green/10 text-accent-green-light flex items-center justify-center">
                  {iconMap[impact.icon] ?? iconMap.zap}
                </div>
                <span className="font-display font-bold text-accent-gold text-2xl">{impact.metric}</span>
              </div>
              <h3 className="font-display font-semibold text-text-primary text-lg mb-2">{impact.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{impact.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerItem}
          initial="initial"
          animate="animate"
          className="mt-12 rounded-2xl overflow-hidden border border-accent-green/20 group"
        >
          <img
            src="/images/strategic-impact-hero.png"
            alt="Strategic impact overview"
            className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="px-6 py-4 bg-surface-elevated border-t border-accent-green/15">
            <p className="text-text-secondary text-sm leading-relaxed text-center">
              Future Green's proprietary aerial intelligence platform scores and ranks every property in a target area —
              turning satellite imagery into actionable leads at $0.15 per scan.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 luxury-card text-center max-w-3xl mx-auto">
          <h3 className="font-display font-bold text-text-primary text-2xl mb-4">Beyond Financial Returns</h3>
          <p className="text-text-secondary leading-relaxed">
            Future Green Capital Group is designed to create value at every level — for investors, for communities,
            and for the environment. Each dollar deployed generates measurable outcomes across job creation,
            energy production, housing supply, and technology advancement. This is a platform built not
            just to grow, but to matter.
          </p>
        </div>
      </div>
    </PageShell>
  )
}
