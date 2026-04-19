import { motion } from 'framer-motion'
import { formatWholeNumber } from '../../utils/formatNumber'
import { staggerContainer, staggerItem } from '../../theme/animations'

interface FunnelStep {
  label: string
  value: number
  color?: string
}

interface FunnelDiagramProps {
  steps: FunnelStep[]
  title?: string
}

export default function FunnelDiagram({ steps, title }: FunnelDiagramProps) {
  const maxValue = Math.max(...steps.map((s) => s.value))

  return (
    <div>
      {title && <h4 className="font-display font-semibold text-text-primary text-lg mb-6">{title}</h4>}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
        {steps.map((step, i) => {
          const widthPercent = maxValue > 0 ? Math.max((step.value / maxValue) * 100, 20) : 20
          const defaultColors = ['#c9a84c', '#e2c97e', '#2d6a4f', '#40916c', '#6366f1']
          const color = step.color ?? defaultColors[i % defaultColors.length]

          return (
            <motion.div key={step.label} variants={staggerItem} className="flex items-center gap-4">
              <div className="w-32 sm:w-40 text-right">
                <p className="text-text-secondary text-sm">{step.label}</p>
              </div>
              <div className="flex-1 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  className="h-10 rounded-lg flex items-center px-3"
                  style={{ backgroundColor: color + '25', borderLeft: `3px solid ${color}` }}
                >
                  <span className="font-display font-semibold text-text-primary text-sm">
                    {formatWholeNumber(step.value)}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
