import { motion } from 'framer-motion'

const segments = [
  { label: 'More Users', description: 'Platform adoption grows', angle: 0, color: '#6366f1' },
  { label: 'More Data', description: 'Every interaction creates signal', angle: 90, color: '#c9a84c' },
  { label: 'Better Models', description: 'AI accuracy improves', angle: 180, color: '#2d6a4f' },
  { label: 'Higher Value', description: 'Leads improve, platform stickier', angle: 270, color: '#f59e0b' },
]

export default function FlywheelDiagram() {
  return (
    <div className="luxury-card p-8">
      <h4 className="font-display font-semibold text-text-primary text-lg mb-2 text-center">Data Flywheel</h4>
      <p className="text-text-muted text-sm text-center mb-8">Compounding advantage through usage</p>

      <div className="relative w-72 h-72 mx-auto">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-surface-border border-dashed"
        />

        {/* Segments */}
        {segments.map((seg, i) => {
          const x = 50 + 42 * Math.cos((seg.angle - 90) * (Math.PI / 180))
          const y = 50 + 42 * Math.sin((seg.angle - 90) * (Math.PI / 180))

          return (
            <motion.div
              key={seg.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="absolute text-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: '100px',
              }}
            >
              <div
                className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: seg.color + '20', color: seg.color, border: `2px solid ${seg.color}` }}
              >
                {i + 1}
              </div>
              <p className="text-text-primary text-xs font-semibold">{seg.label}</p>
              <p className="text-text-muted text-[10px] mt-0.5">{seg.description}</p>
            </motion.div>
          )
        })}

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-surface-elevated border border-surface-border flex flex-col items-center justify-center">
            <p className="text-accent-gold font-display font-bold text-xs">AI</p>
            <p className="text-text-muted text-[9px]">Engine</p>
          </div>
        </div>

        {/* Arrows between segments */}
        {segments.map((_, i) => {
          const startAngle = segments[i].angle
          const midAngle = startAngle + 45
          const ax = 50 + 34 * Math.cos((midAngle - 90) * (Math.PI / 180))
          const ay = 50 + 34 * Math.sin((midAngle - 90) * (Math.PI / 180))

          return (
            <div
              key={`arrow-${i}`}
              className="absolute text-accent-gold/40 text-lg"
              style={{ left: `${ax}%`, top: `${ay}%`, transform: `translate(-50%, -50%) rotate(${midAngle}deg)` }}
            >
              &rarr;
            </div>
          )
        })}
      </div>
    </div>
  )
}
