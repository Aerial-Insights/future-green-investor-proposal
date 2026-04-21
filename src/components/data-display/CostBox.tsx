import { formatCurrency } from '../../utils/formatCurrency'

interface CostBoxProps {
  title: string
  totalCost: number
  subtitle?: string
  breakdowns: { label: string; value: number }[]
}

export default function CostBox({ title, totalCost, subtitle, breakdowns }: CostBoxProps) {
  return (
    <div
      className="luxury-card p-5 rounded-xl"
      style={{
        background: 'linear-gradient(135deg, #4a1515, #5c1e1e)',
        border: '1px solid rgba(220, 38, 38, 0.35)',
      }}
    >
      <p className="text-red-200 text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">
        {title}
      </p>
      <p className="text-white font-display font-bold text-2xl">
        {formatCurrency(totalCost)}
      </p>
      <p className="text-red-200/60 text-[10px] mt-0.5">
        {subtitle ?? '5-Year Total Spend'}
      </p>

      {breakdowns.length > 0 && (
        <div className="mt-3 pt-3 border-t border-red-800/30 space-y-1.5">
          {breakdowns.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-red-200/80 text-[11px]">{item.label}</span>
              <span className="text-white text-[11px] font-semibold">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
