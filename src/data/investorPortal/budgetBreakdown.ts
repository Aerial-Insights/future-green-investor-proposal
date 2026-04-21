// ─── FINAL BUDGET BREAKDOWN ─────────────────────────────────────────────────
// Grand Total: $40,000,000

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
    key: 'distributedSolar',
    label: 'Distributed Solar Development',
    total: 10000000,
    color: '#f59e0b',
    items: [
      { label: 'Installation Infrastructure & Crew Scaling', amount: 3200000, why: 'Build capacity for 180+ installs per year across residential, commercial, and institutional' },
      { label: 'Equipment Partnerships (Panels, Inverters, BOS)', amount: 2500000, why: 'Bulk procurement agreements to reduce per-install costs' },
      { label: 'Permitting & Interconnection', amount: 1200000, why: 'Streamline approval pipeline across multiple jurisdictions' },
      { label: 'Project Management & Engineering', amount: 1000000, why: 'Design, site assessment, and quality assurance for distributed installs' },
      { label: 'SREC Administration & Compliance', amount: 800000, why: 'Register installs, manage SREC certification, and ensure ongoing compliance' },
      { label: 'Community Solar Program Development', amount: 600000, why: 'Expand into community solar participation models' },
      { label: 'Fleet & Logistics', amount: 400000, why: 'Installation vehicles, equipment transport, and regional coverage' },
      { label: 'Contingency', amount: 300000, why: 'Buffer for supply chain and regulatory variability' },
    ],
  },
  {
    key: 'homeServices',
    label: 'Home Services',
    total: 8475000,
    color: '#c9a84c',
    items: [
      { label: 'Working Capital (Job Fulfillment)', amount: 4125000, why: 'Funds subcontractor payments, material procurement, and operational continuity at expanded scale under a subcontractor-driven execution model' },
      { label: 'Equipment & Tools', amount: 800000, why: 'Essential job completion tools for growing workforce' },
      { label: 'Office Location Expansion', amount: 750000, why: 'Regional expansion across multiple markets' },
      { label: 'Operations & Admin Staff', amount: 600000, why: 'Backend support for scaled operations' },
      { label: 'Door-to-Door Sales Force', amount: 500000, why: 'Lean, high-performance sales investment focused on top producers' },
      { label: 'Sales Leadership & Recruiting', amount: 400000, why: 'Targeted leadership hires to scale team performance efficiently' },
      { label: 'Fleet (Vehicles, Fuel, Maintenance)', amount: 400000, why: 'Reduced fleet needs under subcontractor-driven model — covers coordination and oversight vehicles only' },
      { label: 'Commercial Sales Expansion', amount: 300000, why: 'Focused commercial pipeline targeting highest-value opportunities' },
      { label: 'Field Marketing Support', amount: 300000, why: 'Improves close rates on leads' },
      { label: 'Contingency', amount: 300000, why: 'Minimal reserve to redeploy capital' },
    ],
  },
  {
    key: 'marketing',
    label: 'Marketing',
    total: 5300000,
    color: '#525252',
    items: [
      { label: 'Solar Customer Acquisition', amount: 2000000, why: 'Optimized solar lead generation — monthly ramp from $50K to $200K/mo at $200 blended CPL with tighter targeting and higher conversion focus' },
      { label: 'PPC (High Intent Only)', amount: 900000, why: 'Aggressive, conversion-focused search ads across all divisions — expanded allocation from cross-division reallocation including Aerial Insights budget optimization' },
      { label: 'Direct Mail Campaigns (Land Acquisition)', amount: 850000, why: 'Highest ROI channel for wholesale pipeline' },
      { label: 'Commercial Campaigns', amount: 750000, why: 'Expanded commercial outreach targeting high-value institutional and multi-site deals' },
      { label: 'Retargeting Campaigns', amount: 400000, why: 'Scaled retargeting to recapture warm leads across all divisions at low incremental cost' },
      { label: 'Creative & Content Production', amount: 200000, why: 'Enhanced content pipeline supporting higher ad volume and brand presence' },
      { label: 'CRM & Automation Systems', amount: 100000, why: 'Scales follow-up and nurturing across all channels' },
      { label: 'Testing New Channels', amount: 100000, why: 'Expanded experimentation budget for emerging platforms and partnership-driven acquisition' },
    ],
  },
  {
    key: 'aerialInsights',
    label: 'Aerial Insights',
    total: 1775000,
    color: '#6366f1',
    items: [
      { label: 'PPC Marketing (Avg. CAC $150)', amount: 800000, why: 'Primary customer acquisition channel at expanded scale' },
      { label: 'Data Acquisition (Imagery, APIs)', amount: 280000, why: 'Focused data spend on highest-value imagery and API integrations' },
      { label: 'Convention & Influencer Interactions', amount: 200000, why: 'Supports conventions, podcasts, influencer partnerships, and broader market visibility for the platform ecosystem' },
      { label: 'AI Detection & Model Accuracy', amount: 200000, why: 'Continuous model improvement with optimized training pipeline' },
      { label: 'Infrastructure (Cloud, Compute, Storage)', amount: 125000, why: 'Scalable backend for growing user base' },
      { label: 'Contingency', amount: 70000, why: 'Iteration buffer' },
      { label: 'Future Additions & Improvements', amount: 50000, why: 'Reserved for product roadmap priorities' },
      { label: 'Internal Tools & Admin Systems', amount: 50000, why: 'Minimal internal support' },
    ],
  },
  {
    key: 'wholesalePipeline',
    label: 'Wholesale Pipeline',
    total: 3580000,
    color: '#40916c',
    items: [
      { label: 'Direct Mail Campaigns', amount: 1450000, why: 'Primary lead generation channel with proven ROI' },
      { label: 'Paid Leads Campaigns', amount: 1000000, why: 'Expanded high-intent lead acquisition to accelerate deal flow' },
      { label: 'Expedited Commissions', amount: 250000, why: 'Performance-based compensation to incentivize faster deal closings' },
      { label: 'Buyer Network Nationwide Expansion', amount: 250000, why: 'Broader buyer network improves close rate, pricing, and speed to sale' },
      { label: 'Data, Skip Tracing & List Pulls', amount: 200000, why: 'Targeted data acquisition for higher-quality lead lists' },
      { label: 'Disposition / Buyer Sales Team', amount: 200000, why: 'Faster dispositions and improved deal velocity drive higher throughput' },
      { label: 'Legal & Closing Costs', amount: 180000, why: 'Lean execution support for transaction closings' },
      { label: 'AI Matching & Automation', amount: 50000, why: 'Scales deal matching efficiency' },
    ],
  },
  {
    key: 'lowIncomeHousing',
    label: 'Low-Income Housing and Subdividing',
    total: 10070000,
    color: '#2d6a4f',
    items: [
      { label: 'Land Acquisition', amount: 2370000, why: 'Consolidated land acquisition fund — combines reallocations from wholesale, strategic partnerships, and internal budget optimization to secure larger and more strategic parcels' },
      { label: 'Construction (Standardized Builds)', amount: 5900000, why: 'Speed and scalability over customization' },
      { label: 'Site Work & Utilities', amount: 500000, why: 'Optimized infrastructure costs with lean site preparation' },
      { label: 'Contingency', amount: 350000, why: 'Buffer for unexpected costs' },
      { label: 'Pre-Development & Permits', amount: 300000, why: 'Streamlined approvals and lean pre-development process' },
      { label: 'Carry Costs (Taxes, Insurance, Holding)', amount: 300000, why: 'Minimize capital lockup time' },
      { label: 'Disposition / Stabilization', amount: 200000, why: 'Quick sale and turnover' },
      { label: 'Project Management', amount: 150000, why: 'Lean oversight for execution' },
    ],
  },
  {
    key: 'strategicPartnerships',
    label: 'Strategic Partnerships',
    total: 800000,
    color: '#8b5cf6',
    items: [
      { label: 'Partnership Development & Outreach', amount: 213000, why: 'Identify and secure strategic alliances across energy and real estate' },
      { label: 'Joint Venture Structuring', amount: 187000, why: 'Legal, financial, and operational setup for JV deals' },
      { label: 'Co-Marketing & Channel Partnerships', amount: 160000, why: 'Shared distribution and customer acquisition with partners' },
      { label: 'Technology & Platform Integrations', amount: 107000, why: 'API and system integrations with partner platforms' },
      { label: 'Industry Events & Network Building', amount: 80000, why: 'Conference presence and relationship capital' },
      { label: 'Contingency', amount: 53000, why: 'Flexibility for emerging opportunities' },
    ],
  },
]

export const BUDGET_GRAND_TOTAL = 40000000
