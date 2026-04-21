import { formatCurrency } from '../../utils/formatCurrency'

interface FinancialRow {
  year: number
  cost: number
  revenue: number
  profit: number
}

interface ChannelFinancialTableProps {
  data: FinancialRow[]
  title?: string
  highlightYear?: number
}

export default function ChannelFinancialTable({
  data,
  title = '5-Year Financial Summary',
  highlightYear,
}: ChannelFinancialTableProps) {
  const totals = data.reduce(
    (acc, row) => ({
      cost: acc.cost + row.cost,
      revenue: acc.revenue + row.revenue,
      profit: acc.profit + row.profit,
    }),
    { cost: 0, revenue: 0, profit: 0 }
  )

  return (
    <div className="luxury-card overflow-x-auto">
      <h3 className="font-display font-semibold text-text-primary text-lg mb-4">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            <th className="text-left text-text-muted font-medium py-3 pr-4">Year</th>
            <th className="text-right text-text-muted font-medium py-3 px-2">Total Cost</th>
            <th className="text-right text-text-muted font-medium py-3 px-2">Total Revenue</th>
            <th className="text-right text-text-muted font-medium py-3 px-2">Total Profit</th>
            <th className="text-right text-text-muted font-medium py-3 pl-2">Margin</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isHighlighted = highlightYear === row.year
            const margin = row.revenue > 0 ? (row.profit / row.revenue) * 100 : 0
            return (
              <tr
                key={row.year}
                className={`border-b transition-colors duration-200 ${
                  isHighlighted
                    ? 'bg-accent-gold/5 border-accent-gold/20'
                    : 'border-surface-border/50'
                }`}
              >
                <td className="text-text-secondary py-3 pr-4 font-medium">Year {row.year}</td>
                <td className="text-right text-red-400/80 py-3 px-2">{formatCurrency(row.cost)}</td>
                <td className="text-right text-text-primary py-3 px-2">{formatCurrency(row.revenue)}</td>
                <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{formatCurrency(row.profit)}</td>
                <td className="text-right text-text-secondary py-3 pl-2">{margin.toFixed(1)}%</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-accent-gold/30">
            <td className="text-text-primary font-display font-bold py-3 pr-4">Total</td>
            <td className="text-right text-red-400/80 font-display font-semibold py-3 px-2">{formatCurrency(totals.cost)}</td>
            <td className="text-right text-text-primary font-display font-semibold py-3 px-2">{formatCurrency(totals.revenue)}</td>
            <td className="text-right text-accent-gold font-display font-bold py-3 px-2">{formatCurrency(totals.profit)}</td>
            <td className="text-right text-text-primary font-display font-semibold py-3 pl-2">
              {totals.revenue > 0 ? ((totals.profit / totals.revenue) * 100).toFixed(1) : '0.0'}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
