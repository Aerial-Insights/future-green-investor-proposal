import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../theme/animations'
import { QUALIFICATIONS } from '../data/investorPortal/content'

/* ─── ICON MAPS ──────────────────────────────────────────────────────────── */

const credentialIcons: Record<string, JSX.Element> = {
  calendar: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  clipboard: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  award: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768-.767-1.768-1.768 0-1.148.604-1.836 1.768-1.968m0 3.736a48.354 48.354 0 017.497 0m7.5 0v.916c0 .848-.648 1.557-1.49 1.694l-.04.006a2.18 2.18 0 01-.526-.055M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.471v1.515M18.75 4.236c.996.178 1.768-.767 1.768-1.768 0-1.148-.604-1.836-1.768-1.968" />
    </svg>
  ),
}


const certCategoryColors: Record<string, string> = {
  Sustainability: 'bg-accent-green/10 text-accent-green-light',
  'Building Performance': 'bg-accent-blue/10 text-accent-blue',
  'Green Construction': 'bg-accent-green/10 text-accent-green-light',
  Energy: 'bg-amber-500/10 text-amber-400',
  Compliance: 'bg-red-500/10 text-red-400',
}


/* ─── MAIN PAGE ──────────────────────────────────────────────────────────── */

export default function Qualifications() {
  return (
    <PageShell fullWidth>
      <SectionBanner
        headline={QUALIFICATIONS.headline}
        subtitle={QUALIFICATIONS.subtitle}
        accentColor="#c9a84c"
      />

      <div className="section-container py-12 space-y-20">

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1: QUALIFICATIONS OVERVIEW
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="luxury-card border-l-4 border-l-accent-gold mb-10"
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              Operating Experience & Execution Depth
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {QUALIFICATIONS.heroCopy}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {QUALIFICATIONS.credentials.map((cred) => (
              <motion.div key={cred.label} variants={staggerItem} className="luxury-card group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0">
                    {credentialIcons[cred.icon] ?? credentialIcons.calendar}
                  </div>
                  <div>
                    <span className="font-display font-bold text-3xl sm:text-4xl gold-gradient-text block leading-none">
                      {cred.value}
                    </span>
                    <span className="font-display font-semibold text-text-primary text-base mt-1 block">
                      {cred.label}
                    </span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{cred.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2: CREDENTIALS & CERTIFICATIONS
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              {QUALIFICATIONS.certifications.headline}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              {QUALIFICATIONS.certifications.intro}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {QUALIFICATIONS.certifications.items.map((cert) => (
              <motion.div key={cert.name} variants={staggerItem} className="luxury-card group relative">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${certCategoryColors[cert.category] || 'bg-accent-gold/10 text-accent-gold'}`}>
                    {cert.category}
                  </span>
                  {('certNumber' in cert && cert.certNumber) && (
                    <span className="text-text-dim text-xs font-mono">{cert.certNumber}</span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-text-primary text-base mb-1 leading-snug">
                  {cert.name}
                </h3>
                <p className="text-accent-gold text-sm mb-1">{cert.holder}</p>
                <p className="text-text-muted text-xs mb-2">{cert.issuer}</p>
                {'issued' in cert && cert.issued && (
                  <p className="text-text-dim text-xs mb-2">Issued: {cert.issued}</p>
                )}
                <p className="text-text-secondary text-xs leading-relaxed border-t border-surface-border pt-2 mt-auto">
                  {cert.relevance}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2B: VERIFIED CREDENTIALS — IMAGE GALLERY
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              Verified Credentials & Proof of Work
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              Documented certifications, federal recognitions, and professional credentials backing the team's operational authority.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                src: '/images/credentials/epa-leadsafe.jpg',
                title: 'EPA Lead-Safe Certified Firm',
                subtitle: 'NAT-F222147-1',
                description: 'Federal certification for lead-safe renovation, repair, and painting practices.',
              },
              {
                src: '/images/credentials/energystar-century-club.jpg',
                title: 'ENERGY STAR Century Club Award',
                subtitle: '2022 — Future Green Services',
                description: 'Awarded by the U.S. Department of Energy and EPA for improving energy efficiency in 100+ homes.',
              },
              {
                src: '/images/credentials/mit-sustainable-energy.jpg',
                title: 'MIT — Sustainable Energy',
                subtitle: 'MITx Verified Certificate',
                description: 'Completed MIT 22.811 Sustainable Energy curriculum through edX — Franklin Bourdeau.',
              },
              {
                src: '/images/credentials/gpro-construction.jpg',
                title: 'GPRO Construction Management',
                subtitle: 'Urban Green Council',
                description: 'Certified in sustainable construction management and high-performance building practices.',
              },
              {
                src: '/images/credentials/energy-benchmarking.jpg',
                title: 'Energy Benchmarking Certification',
                subtitle: 'PBJ Tech Hub — 4 PDH | .4 CEU',
                description: 'Completed Energy Data, Metrics, and Analytics professional development program.',
              },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerItem}>
                <a
                  href={item.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block luxury-card group overflow-hidden h-full hover:shadow-glow"
                >
                  <div className="relative -mx-6 -mt-6 mb-4 overflow-hidden bg-surface rounded-t-xl">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-52 object-contain bg-white/90 p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-display font-semibold text-text-primary text-base mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-accent-gold text-sm mb-2">{item.subtitle}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{item.description}</p>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 3: AWARDS & RECOGNITION
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              {QUALIFICATIONS.awards.headline}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              {QUALIFICATIONS.awards.intro}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {QUALIFICATIONS.awards.items.map((award) => (
              <motion.div key={award.name} variants={staggerItem} className="luxury-card group">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display font-semibold text-text-primary text-lg leading-snug">
                        {award.name}
                      </h3>
                      <span className="text-accent-gold font-display font-bold text-lg shrink-0 ml-4">
                        {award.year}
                      </span>
                    </div>
                    <p className="text-accent-gold/80 text-sm mb-2">{award.issuer}</p>
                    <p className="text-text-secondary text-sm leading-relaxed mb-2">{award.description}</p>
                    <p className="text-text-muted text-xs italic">{award.significance}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 4: UTILITY & PROGRAM PARTNERSHIPS
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              {QUALIFICATIONS.programPartners.headline}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              {QUALIFICATIONS.programPartners.intro}
            </p>
          </motion.div>

          {/* Program Administrator Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {QUALIFICATIONS.programPartners.partners.map((partner) => (
              <motion.div key={partner.name} variants={staggerItem} className="luxury-card group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-bold text-text-primary text-xl">{partner.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-hover text-text-muted border border-surface-border shrink-0">
                    {partner.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Years</span>
                    <span className="text-text-primary font-medium">{partner.years}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Clients Serviced</span>
                    <span className="text-text-primary font-medium">{partner.clientsServiced}</span>
                  </div>
                  {partner.ranking !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Ranking</span>
                      <span className="text-accent-gold font-semibold">{partner.ranking}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Utility Partners Strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="luxury-card"
          >
            <h3 className="font-display font-semibold text-text-primary text-base mb-4">Utility Partner Network</h3>
            <div className="flex flex-wrap gap-2">
              {QUALIFICATIONS.programPartners.utilities.map((u) => (
                <span
                  key={u}
                  className="text-sm font-medium text-text-primary bg-accent-gold/10 px-4 py-2 rounded-lg border border-accent-gold/20"
                >
                  {u}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 5: NOTABLE PAST WORK
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              {QUALIFICATIONS.executionHistory.headline}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              {QUALIFICATIONS.executionHistory.introCopy}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {QUALIFICATIONS.executionHistory.projects.map((project) => (
              <motion.div key={project.title} variants={staggerItem} className="luxury-card group">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display font-semibold text-text-primary text-lg leading-snug">
                        {project.title}
                      </h3>
                      <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold">
                        {project.serviceType}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm mb-2">{project.location}</p>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">{project.description}</p>
                  </div>
                  <div className="lg:w-72 shrink-0 rounded-lg bg-surface border border-surface-border p-4">
                    <p className="text-text-dim text-xs uppercase tracking-wider mb-1">Key Outcome</p>
                    <p className="text-accent-gold font-display font-semibold text-base">{project.outcome}</p>
                    <p className="text-text-muted text-xs mt-2 italic">{project.significance}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 6: SUBCONTRACTOR NETWORK
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              Service Coverage & Subcontractor Depth
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              {QUALIFICATIONS.subcontractorIntro}
            </p>
          </motion.div>

          {/* ── Hero Summary Strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="luxury-card luxury-card-highlighted mb-10"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-bold text-5xl sm:text-6xl gold-gradient-text leading-none">
                  {QUALIFICATIONS.totalSubcontractors}
                </span>
                <span className="font-display font-bold text-text-primary text-xl sm:text-2xl">
                  Active Subs
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
                A distributed subcontractor network providing flexible installation and service capacity across six core home-services categories — enabling the platform to scale execution without in-house workforce constraints.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {QUALIFICATIONS.subcontractorCategories.map((cat) => (
                  <span
                    key={cat.category}
                    className="text-xs font-medium text-text-secondary bg-surface-hover px-3 py-1.5 rounded-full border border-surface-border"
                  >
                    {cat.category}: {cat.count}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Featured Execution Partners ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
            className="mb-8"
          >
            <h3 className="font-display font-semibold text-text-primary text-lg mb-1">
              Featured Execution Partners
            </h3>
            <p className="text-text-muted text-sm mb-6">
              Key subcontractors providing depth and regional capacity across solar, HVAC, and weatherization.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {QUALIFICATIONS.featuredSubcontractors.map((sub) => (
              <motion.div
                key={sub.name}
                variants={staggerItem}
                className="luxury-card luxury-card-highlighted flex flex-col"
              >
                <div className="w-10 h-1 rounded-full bg-accent-gold mb-4" />
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent-gold bg-accent-gold/10 px-2.5 py-1 rounded-full self-start mb-3">
                  {sub.category}
                </span>
                <h4 className="font-display font-semibold text-text-primary text-lg mb-3">
                  {sub.name}
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {sub.summary}
                </p>
                <div className="mb-4 flex-1">
                  <p className="text-text-dim text-xs uppercase tracking-wider font-medium mb-2">Capabilities</p>
                  <ul className="space-y-1.5">
                    {sub.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2 text-text-secondary text-xs leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-accent-gold mt-1.5 shrink-0" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-surface-border pt-3 mt-auto">
                  <p className="text-text-muted text-xs italic leading-relaxed">{sub.whyItMatters}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Audit Partner Highlight ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
            className="luxury-card border-l-4 border-l-accent-blue"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-semibold text-text-primary text-base mb-1">
                  Energy Audit Partner: {QUALIFICATIONS.auditPartner.name}
                </h3>
                <p className="text-accent-blue text-sm mb-1">{QUALIFICATIONS.auditPartner.principal} — {QUALIFICATIONS.auditPartner.location}</p>
                <p className="text-text-secondary text-sm leading-relaxed mb-2">{QUALIFICATIONS.auditPartner.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUALIFICATIONS.auditPartner.credentials.map((c) => (
                    <span key={c} className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 7: OPERATIONAL INFRASTRUCTURE
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
          >
            <h2 className="font-display font-bold text-text-primary text-2xl mb-4">
              {QUALIFICATIONS.operations.headline}
            </h2>
            <p className="text-text-secondary leading-relaxed max-w-4xl mb-8">
              {QUALIFICATIONS.operations.intro}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {QUALIFICATIONS.operations.capabilities.map((cap) => (
              <motion.div key={cap.title} variants={staggerItem} className="luxury-card group">
                <div className="w-8 h-1 rounded-full bg-accent-gold mb-4" />
                <h3 className="font-display font-semibold text-text-primary text-base mb-2">
                  {cap.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Execution Readiness Callout ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="luxury-card text-center max-w-3xl mx-auto"
        >
          <div className="w-10 h-1 rounded-full bg-accent-gold mx-auto mb-5" />
          <h3 className="font-display font-bold text-text-primary text-2xl mb-4">
            Execution Readiness
          </h3>
          <p className="text-text-secondary leading-relaxed">
            Future Green Services combines over a decade of continuous operations, 300,000+ customer connections,
            federal and utility-level recognition, a distributed subcontractor network across six service categories,
            and structured operational systems designed for program-grade accountability. This is not a business
            plan built on projections alone — it is a platform supported by verified execution history, institutional
            partnerships, and real-world field performance.
          </p>
        </motion.div>

      </div>
    </PageShell>
  )
}
