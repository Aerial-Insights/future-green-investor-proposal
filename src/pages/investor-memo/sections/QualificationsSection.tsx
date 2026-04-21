import { motion } from 'framer-motion'
import { MEMO, QUALIFICATIONS } from '../../../data/investorPortal/memoContent'
import SectionHeader from '../components/SectionHeader'

export default function QualificationsSection() {
  return (
    <section id="qualifications" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XV"
        eyebrow="Credibility"
        title="Execution Credibility"
        subtitle="An existing operating business with federal recognition, deep regional partnerships, and documented delivery history"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] sm:text-[15.5px] mb-12"
      >
        {MEMO.qualificationsNarrative}
      </motion.p>

      {/* Hero credentials */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {QUALIFICATIONS.credentials.map((cred, i) => (
          <motion.div
            key={cred.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="luxury-card p-5"
          >
            <p className="font-display font-bold text-xl text-accent-gold mb-1">{cred.value}</p>
            <p className="text-text-primary text-xs font-medium mb-1">{cred.label}</p>
            <p className="text-text-muted text-[10px] leading-relaxed">{cred.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Certifications */}
      <div className="mb-4">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">Credentials</p>
        <h3 className="font-display font-semibold text-xl text-text-primary">Professional Certifications</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 mb-14">
        {QUALIFICATIONS.certifications.items.map((cert) => (
          <div key={cert.name} className="luxury-card p-4 flex gap-3 hover:border-accent-gold/30 transition-all duration-300">
            <div className="flex-shrink-0 mt-0.5">
              <span className="text-[9px] uppercase tracking-[0.15em] text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded">
                {cert.category}
              </span>
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium">{cert.name}</p>
              <p className="text-text-muted text-xs">{cert.holder} — {cert.issuer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Awards */}
      <div className="mb-4">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">Recognition</p>
        <h3 className="font-display font-semibold text-xl text-text-primary">Awards & Recognition</h3>
      </div>
      <div className="space-y-3 mb-14">
        {QUALIFICATIONS.awards.items.map((award) => (
          <div key={award.name} className="luxury-card p-5 border-l border-accent-gold/30">
            <div className="flex items-baseline justify-between mb-1">
              <h4 className="font-display font-semibold text-text-primary text-sm">{award.name}</h4>
              <span className="text-text-dim text-xs ml-2">{award.year}</span>
            </div>
            <p className="text-text-muted text-xs mb-1">{award.issuer}</p>
            <p className="text-text-secondary text-xs leading-[1.7]">{award.description}</p>
          </div>
        ))}
      </div>

      {/* Partnerships */}
      <div className="mb-4">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">Partners</p>
        <h3 className="font-display font-semibold text-xl text-text-primary">Program Partnerships</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 mb-14">
        {QUALIFICATIONS.programPartners.partners.slice(0, 6).map((p) => (
          <div key={p.name} className="luxury-card p-4">
            <p className="text-text-primary text-sm font-medium">{p.name}</p>
            <p className="text-text-muted text-xs">{p.years}</p>
            <p className="text-accent-gold text-xs font-medium mt-1">{p.ranking}</p>
          </div>
        ))}
      </div>

      {/* Featured subcontractors */}
      <div className="mb-4">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">Execution</p>
        <h3 className="font-display font-semibold text-xl text-text-primary">Key Execution Partners</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {QUALIFICATIONS.featuredSubcontractors.map((sub) => (
          <div key={sub.name} className="luxury-card p-5 border-t-2 border-accent-green/30">
            <span className="text-[9px] uppercase tracking-[0.15em] text-accent-green-light bg-accent-green/10 px-2 py-0.5 rounded">
              {sub.category}
            </span>
            <h4 className="font-display font-semibold text-text-primary text-sm mt-3 mb-2">{sub.name}</h4>
            <p className="text-text-muted text-xs leading-[1.6] mb-3">{sub.summary.slice(0, 200)}...</p>
            <p className="text-text-secondary text-[10px] italic leading-relaxed">{sub.whyItMatters}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
