import { motion } from 'framer-motion'
import type { DeploymentOutput } from '../../data/investorPortal/deploymentOutputs'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatWholeNumber } from '../../utils/formatNumber'

interface DeploymentOutputCardProps {
  allocation: number
  outputs: DeploymentOutput[]
}

function formatUnitCost(label: string, cost: number): string {
  if (cost < 1) return `${label}: $${cost.toFixed(2)}`
  return `${label}: ${formatCurrency(cost)}`
}

export default function DeploymentOutputCard({ allocation, outputs }: DeploymentOutputCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-2"
    >
      {outputs.map((output, i) => {
        const effectiveAllocation = output.allocationOverride ?? allocation
        const quantity = Math.floor(effectiveAllocation / output.unitCost)

        return (
          <div
            key={i}
            className="bg-gradient-to-br from-accent-gold/[0.06] to-accent-gold/[0.02] border border-accent-gold/25 rounded-lg p-3"
          >
            <p className="text-[10px] font-semibold tracking-wider uppercase text-text-dim mb-1.5">
              What This Buys
            </p>
            <p className="gold-gradient-text font-display font-bold text-xl leading-tight">
              {formatWholeNumber(quantity)}
            </p>
            <p className="text-text-secondary text-xs font-medium mt-0.5">
              {output.outputLabel}
            </p>
            <p className="text-text-muted text-[10px] mt-1.5">
              {formatUnitCost(output.unitCostLabel, output.unitCost)}
            </p>
            {output.helperText && (
              <p className="text-text-dim text-[10px] italic mt-1">
                {output.helperText}
              </p>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}
