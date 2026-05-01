import { motion } from 'framer-motion'
import type { PartnershipOptionConfig } from '../../../data/investorPortal/baseAssumptions'

interface Props {
  config: PartnershipOptionConfig
}

export default function PartnershipGovernanceSummary({ config }: Props) {
  const seats = Array.from({ length: config.governance.boardSeatsAppointed }, (_, i) => i + 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-gold/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="relative">
          <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">Governance & Strategic Oversight</p>
          <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl mb-4">
            {config.governance.role}
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-3xl">
            The investor enters as <span className="text-accent-gold font-semibold">{config.governance.role}</span> with the
            ability to appoint <span className="text-accent-gold font-semibold">{config.governance.boardSeatsAppointed} board selections</span>.
            This structure embeds long-term governance influence and strategic alignment across Home Services, Real Estate,
            and Aerial Insights — giving the investor visibility into operating decisions, capital allocation, and
            growth strategy throughout the partnership.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Chair Role
            </span>
            <span className="text-text-primary text-sm font-semibold">{config.governance.role}</span>
          </div>
          <ul className="space-y-3">
            {[
              'Chairs board meetings and sets the strategic agenda for the operating platform.',
              'Oversees executive leadership decisions, capital allocation, and major operating commitments.',
              'Provides strategic visibility into all three divisions: Home Services, Real Estate, Aerial Insights.',
              'Voting authority on material corporate actions, M&A, and capital structure changes.',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 flex-shrink-0" />
                <p className="text-text-secondary text-sm leading-relaxed">{line}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="luxury-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-emerald-100 bg-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Board Selections
            </span>
            <span className="text-text-primary text-sm font-semibold">
              {config.governance.boardSeatsAppointed} appointments
            </span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Investor-appointed board members serve as additional governance influence and strategic
            advisors. Recommend selections with operating, capital markets, and platform-scaling expertise.
          </p>
          <div className="space-y-2.5">
            {seats.map((n) => (
              <div
                key={n}
                className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-surface/40 border border-surface-border/40"
              >
                <div className="w-7 h-7 rounded-full bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
                  <span className="text-accent-gold font-display font-bold text-sm">{n}</span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-semibold">Board Selection {n}</p>
                  <p className="text-text-muted text-xs">Appointed at the investor's discretion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
