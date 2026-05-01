import { motion } from 'framer-motion'

// ─── $40M SURETY BOND PROTECTION FRAMEWORK ─────────────────────────────────
// Investor-facing summary of the surety bond protection structure. Used on
// both the Percentage-Back and Partnership option summaries so the protection
// framing is consistent across the two structures.
//
// Wording is intentionally conditional ("intends to secure", "target",
// "good-faith collateral", "within six months after release of funds") — the
// bond is not yet active, approved, or guaranteed.

const blocks = [
  {
    label: 'Good-Faith Collateral',
    value: '$1.8M House',
    detail: 'A residential property is pledged upfront as tangible security while the bond is finalized.',
  },
  {
    label: 'Bond Target',
    value: '$40M Surety',
    detail: 'Target bond amount intended to sit alongside the deployed capital stack.',
  },
  {
    label: 'Timing',
    value: '≤ 6 Months',
    detail: 'The bond is intended to be secured within six months after the full release of funds.',
  },
  {
    label: 'Purpose',
    value: 'Investor Protection',
    detail: 'Adds an additional layer of capital assurance across the operating platform.',
  },
]

export default function SuretyBondSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-labelledby="surety-bond-heading"
    >
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.05] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] font-bold text-emerald-100 bg-emerald-700/80 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Capital Protection
            </span>
            <span className="text-emerald-300 text-xs uppercase tracking-[0.2em] font-semibold">
              $40M Surety Bond Framework
            </span>
          </div>
          <h2
            id="surety-bond-heading"
            className="font-display font-bold text-text-primary text-3xl md:text-4xl mb-4 leading-tight"
          >
            $40M Surety Bond Protection Framework
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-8">
            To strengthen the investor protection structure, the operating group{' '}
            <span className="text-emerald-300 font-semibold">intends to secure</span> a{' '}
            <span className="text-emerald-300 font-semibold">$40,000,000 surety bond</span> after the
            investment capital is released. Prior to bond placement, a{' '}
            <span className="text-emerald-300 font-semibold">$1.8M residential property</span> will be pledged as
            good-faith collateral, creating a tangible security commitment while the surety bond is finalized.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {blocks.map((block) => (
              <div
                key={block.label}
                className="bg-surface/40 border border-surface-border/50 rounded-xl p-5 hover:border-emerald-500/40 transition-colors duration-300"
              >
                <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">
                  {block.label}
                </p>
                <p className="text-emerald-300 font-display font-bold text-xl mb-2">{block.value}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{block.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
            <p className="text-text-secondary text-sm leading-relaxed">
              The bond is expected to be obtained{' '}
              <span className="text-emerald-300 font-semibold">within six months after the full release of funds</span>{' '}
              and is designed to add an additional layer of protection across the operating platform, acquisition strategy,
              and deployed capital stack. The pledged property functions as upfront security and signals commitment to
              completing the bond placement on schedule.
            </p>
            <p className="text-text-muted text-[11px] leading-relaxed mt-3">
              The surety bond is a target outcome rather than a current guarantee — language above reflects the operating
              group's intent at the time the investment is structured.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
