// ─── FINAL BUDGET BREAKDOWN ─────────────────────────────────────────────────
// Source: BUDGET - Sheet1.numbers / Sheet 1
// Grand Total: $39,975,000

export interface BudgetLineItem {
  label: string
  amount: number
  why: string
}

export interface BudgetCategory {
  key: string
  label: string
  total: number
  color: string
  items: BudgetLineItem[]
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    key: 'solarFarms',
    label: 'Solar Farms',
    total: 18500000,
    color: '#f59e0b',
    items: [
      { label: 'Land Control (Options & Strategic Acquisition)', amount: 3000000, why: 'Control more sites with less upfront capital' },
      { label: 'Interconnection & Permitting', amount: 2500000, why: 'Accelerate time to revenue and clear the main bottleneck' },
      { label: 'EPC & Installation (Phased Builds)', amount: 6500000, why: 'Bring projects online faster instead of all at once' },
      { label: 'Equipment (Panels, Inverters, BOS)', amount: 4500000, why: 'Core infrastructure for energy generation' },
      { label: 'Development & Engineering', amount: 900000, why: 'Lean execution of site planning and engineering' },
      { label: 'Legal & Compliance', amount: 600000, why: 'Permits, contracts, and regulatory approvals' },
      { label: 'O&M Reserve', amount: 300000, why: 'Minimal early-stage maintenance reserve' },
      { label: 'Contingency', amount: 200000, why: 'Reduced reserve to redeploy capital into growth' },
    ],
  },
  {
    key: 'lowIncomeHousing',
    label: 'Low-Income Housing',
    total: 9000000,
    color: '#2d6a4f',
    items: [
      { label: 'Land Acquisition', amount: 900000, why: 'Lower cost basis across more projects' },
      { label: 'Pre-Development & Permits', amount: 500000, why: 'Fast approvals and lean setup' },
      { label: 'Construction (Standardized Builds)', amount: 5900000, why: 'Speed and scalability over customization' },
      { label: 'Site Work & Utilities', amount: 700000, why: 'Controlled infrastructure costs' },
      { label: 'Project Management', amount: 150000, why: 'Lean oversight for execution' },
      { label: 'Carry Costs (Taxes, Insurance, Holding)', amount: 300000, why: 'Minimize capital lockup time' },
      { label: 'Disposition / Stabilization', amount: 200000, why: 'Quick sale and turnover' },
      { label: 'Contingency', amount: 350000, why: 'Buffer for unexpected costs' },
    ],
  },
  {
    key: 'wholesalePipeline',
    label: 'Wholesale Pipeline',
    total: 3950000,
    color: '#40916c',
    items: [
      { label: 'Direct Mail Campaigns', amount: 1600000, why: 'Primary lead generation channel' },
      { label: 'Paid Leads Campaigns', amount: 800000, why: 'Supplemental high-intent lead acquisition' },
      { label: 'Data, Skip Tracing & List Pulls', amount: 400000, why: 'Improves targeting and conversion rates' },
      { label: 'Acquisition Team Payroll & Commissions', amount: 500000, why: 'Revenue is driven by closers' },
      { label: 'Disposition / Buyer Sales Team', amount: 200000, why: 'Faster deal exits increase throughput' },
      { label: 'Buyer Network Nationwide Expansion', amount: 200000, why: 'Improves close rate and speed to sale' },
      { label: 'AI Matching & Automation', amount: 50000, why: 'Scales deal matching efficiency' },
      { label: 'Legal & Closing Costs', amount: 200000, why: 'Lean execution support' },
    ],
  },
  {
    key: 'homeServices',
    label: 'Home Services',
    total: 4950000,
    color: '#c9a84c',
    items: [
      { label: 'Door-to-Door Sales Force', amount: 300000, why: 'Primary revenue engine' },
      { label: 'Sales Leadership & Recruiting', amount: 300000, why: 'Scales team growth and performance' },
      { label: 'Field Marketing Support', amount: 100000, why: 'Improves close rates on leads' },
      { label: 'Office Location Expansion', amount: 400000, why: 'Regional expansion capacity' },
      { label: 'Working Capital (Job Fulfillment)', amount: 2200000, why: 'Keeps operations moving without delays' },
      { label: 'Fleet (Vehicles, Fuel, Maintenance)', amount: 350000, why: 'Supports field operations' },
      { label: 'Equipment & Tools', amount: 500000, why: 'Essential job completion tools' },
      { label: 'Operations & Admin Staff', amount: 400000, why: 'Lean backend support' },
      { label: 'Commercial Sales Expansion', amount: 200000, why: 'Targets higher ticket opportunities' },
      { label: 'Contingency', amount: 200000, why: 'Minimal reserve to redeploy capital' },
    ],
  },
  {
    key: 'aerialInsights',
    label: 'Aerial Insights',
    total: 875000,
    color: '#6366f1',
    items: [
      { label: 'PPC Marketing (Avg. CAC $150)', amount: 400000, why: 'Primary customer acquisition channel' },
      { label: 'Future Additions & Improvements', amount: 100000, why: 'Build the core product only' },
      { label: 'AI Detection & Model Accuracy', amount: 70000, why: 'Primary value driver' },
      { label: 'Data Acquisition (Imagery, APIs)', amount: 180000, why: 'Fuels the AI system' },
      { label: 'Infrastructure (Cloud, Compute, Storage)', amount: 50000, why: 'Lean, scalable backend' },
      { label: 'Internal Tools & Admin Systems', amount: 25000, why: 'Minimal internal support' },
      { label: 'Contingency', amount: 50000, why: 'Iteration buffer' },
    ],
  },
  {
    key: 'marketing',
    label: 'Marketing',
    total: 2700000,
    color: '#525252',
    items: [
      { label: 'Direct Mail Campaigns (Roofing)', amount: 400000, why: 'Highest ROI acquisition channel' },
      { label: 'Direct Mail Campaigns (Land Acquisition)', amount: 850000, why: 'Highest ROI acquisition channel' },
      { label: 'PPC (High Intent Only)', amount: 500000, why: 'Targeted, conversion-focused ads' },
      { label: 'Commercial Campaigns', amount: 500000, why: 'Targets high-value deals' },
      { label: 'Retargeting Campaigns', amount: 250000, why: 'Low-cost conversion layer' },
      { label: 'Creative & Content Production', amount: 100000, why: 'Supports conversions and branding' },
      { label: 'CRM & Automation Systems', amount: 50000, why: 'Scales follow-up and nurturing' },
      { label: 'Testing New Channels', amount: 50000, why: 'Controlled experimentation' },
    ],
  },
]

export const BUDGET_GRAND_TOTAL = 39975000
