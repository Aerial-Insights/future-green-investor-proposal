export interface ExplanationEntry {
  metricName: string
  definition: string
  whyItMatters: string
  inputDrivers: string[]
  formulaLogic: string
  scenarioContext: string
  notes?: string
}

export const EXPLANATIONS: Record<string, ExplanationEntry> = {
  repCount: {
    metricName: 'Sales Rep Count',
    definition: 'The number of active door-to-door sales representatives in the field at any given time.',
    whyItMatters: 'Rep count is the primary driver of deal volume. More reps = more doors knocked = more revenue.',
    inputDrivers: ['Hiring velocity', 'Training capacity', 'Territory availability', 'Capital deployed to sales'],
    formulaLogic: 'Base reps × year-over-year growth multiplier. Year 1: base, Year 3: 1.9x, Year 5: 3.2x.',
    scenarioContext: 'Conservative: 12, Base: 15, Growth: 20, Aggressive: 30',
    notes: 'Reps are typically ramped over 4-6 weeks before reaching full productivity.',
  },

  closeRate: {
    metricName: 'Close Rate',
    definition: 'The percentage of contacted homeowners who sign a service agreement.',
    whyItMatters: 'A 2% improvement in close rate can increase annual revenue by $1M+ without adding a single rep.',
    inputDrivers: ['Sales training quality', 'Grant eligibility', 'Market conditions', 'Service pricing', 'Brand recognition'],
    formulaLogic: 'D2D Conversion Rate = Roofing Jobs / Total Doors Knocked. Base: 1.5% of all doors knocked convert to roofing jobs.',
    scenarioContext: 'Conservative: 1.0%, Base: 1.5%, Growth: 2.0%, Aggressive: 2.5%',
    notes: 'Industry average for D2D roofing is 1-3%. 15 reps × 30 doors/day × 5 days/week = 9,450 doors/month → 142 jobs at 1.5%.',
  },

  averageJobValue: {
    metricName: 'Average Job Value',
    definition: 'The weighted average revenue generated per completed service job across all service lines.',
    whyItMatters: 'Higher average job values improve unit economics and reduce the number of jobs needed to hit revenue targets.',
    inputDrivers: ['Service mix', 'Upsell rate', 'Regional pricing', 'Grant coverage'],
    formulaLogic: 'Sum of (Deal Share × Revenue Per Job) across all service lines, plus upsell revenue.',
    scenarioContext: 'Ranges from $5K (air sealing) to $52K (solar). Roofing: $18K, Insulation: $12K, HVAC: $8K, Water Heater: $6.5K.',
  },

  grantEligibility: {
    metricName: 'Grant Eligibility Rate',
    definition: 'The percentage of homeowners who qualify for federal or state energy efficiency grants.',
    whyItMatters: 'Grant-eligible jobs close at higher rates and reduce the homeowner\'s out-of-pocket cost significantly.',
    inputDrivers: ['Household income levels', 'Property age', 'Geographic location', 'Program funding availability'],
    formulaLogic: 'Grant-Eligible Deals = Total Deals × Grant Eligibility Rate.',
    scenarioContext: 'Base: 60% eligibility. Effective close rate uplift: 15% higher when grant is available.',
    notes: 'Reimbursement typically arrives 2-4 months after project completion.',
  },

  totalRevenue: {
    metricName: 'Total Portfolio Revenue',
    definition: 'The combined annual revenue from all business divisions: Home Services, Solar Operations, Real Estate, and Aerial Insights.',
    whyItMatters: 'This is the primary top-line metric for the entire platform and the basis for investor return calculations.',
    inputDrivers: ['Sales volume', 'Service pricing', 'Real estate deal flow', 'Solar installations', 'SaaS subscriptions'],
    formulaLogic: 'Home Services Revenue + Solar Operations Revenue + Real Estate Revenue + Aerial Insights Revenue.',
    scenarioContext: 'Year 5 ranges from ~$15M (conservative) to ~$80M+ (aggressive) depending on scaling assumptions.',
  },

  ebitda: {
    metricName: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization — a proxy for operating cash flow.',
    whyItMatters: 'EBITDA is the standard metric institutional investors use to value operating businesses.',
    inputDrivers: ['Revenue', 'Gross margins', 'Operating expenses', 'Admin overhead', 'Marketing spend'],
    formulaLogic: 'Gross Profit × 0.65 (after operating expenses). Individual division margins vary from 35% to 75%.',
    scenarioContext: 'Target EBITDA margin of 20-30% at scale across the blended portfolio.',
    notes: 'SaaS (Aerial Insights) carries highest margins; Home Services has moderate margins with high volume.',
  },

  revenuePerInstall: {
    metricName: 'Annual SREC Revenue Per Install',
    definition: 'The recurring annual SREC revenue generated per distributed solar installation.',
    whyItMatters: 'This is the primary long-term profit driver for the distributed solar portfolio. Each install generates predictable, recurring SREC income for 20+ years.',
    inputDrivers: ['SRECs per install (12/year)', 'SREC value ($400/credit)', 'Install quality', 'System uptime'],
    formulaLogic: 'Revenue per install = SRECs/install × SREC value = 12 × $400 = $4,800/year per install.',
    scenarioContext: 'Conservative: $3,360 (lower SREC value). Base: $4,800. Growth: $5,100. Aggressive: $5,400.',
    notes: 'No build delay — distributed rooftop installs produce SRECs from their install year. Cumulative installs compound revenue.',
  },

  srecValue: {
    metricName: 'SREC Value Per Credit',
    definition: 'Solar Renewable Energy Certificate value — a tradeable credit earned per MWh of solar energy generated by distributed solar installations.',
    whyItMatters: 'SRECs are the dominant long-term revenue stream for the distributed solar portfolio. The investor receives 50% of all SREC revenue independently of the threshold.',
    inputDrivers: ['State RPS requirements', 'Market supply/demand', 'Regional policy', 'System certification'],
    formulaLogic: 'Annual SREC revenue per install = 12 SRECs × $400/credit = $4,800/year. Cumulative installs grow with monthly marketing ramp. Separate from one-time install fee ($28K/job).',
    scenarioContext: 'Conservative: $350/credit. Base: $400/credit. Growth: $425/credit. Aggressive: $450/credit.',
    notes: 'Each install generates 12 SRECs/year. SRECs continue for 20+ years per cohort. Investor receives 50% of all SREC revenue. Marketing ramps from $50K/mo to $200K/mo.',
  },

  buildCostPerUnit: {
    metricName: 'Build Cost Per Unit',
    definition: 'The total construction cost to build one residential housing unit, including materials, labor, and permits.',
    whyItMatters: 'Build cost determines the equity spread between construction and stabilized asset value.',
    inputDrivers: ['Material costs', 'Labor market', 'Permitting costs', 'Unit size', 'Geographic location'],
    formulaLogic: 'Total Project Cost = Units Per Project × Build Cost Per Unit.',
    scenarioContext: 'Base: $200,000/unit. Market value: $360,000/unit. Creates $160K equity per unit at completion.',
    notes: 'Costs can fluctuate with material prices and local labor availability.',
  },

  mrr: {
    metricName: 'Monthly Recurring Revenue (MRR)',
    definition: 'The total monthly subscription and recurring revenue from the Aerial Insights platform.',
    whyItMatters: 'MRR is the core SaaS metric. Predictable recurring revenue commands premium valuations.',
    inputDrivers: ['Active users', 'Subscription pricing', 'Enterprise accounts', 'Add-on attach rate', 'Churn rate'],
    formulaLogic: 'Core Subscription MRR ($1,200/user) + CRM Add-On ($52/user × 40% attach) + Crew Tracker ($200/user × 25% attach).',
    scenarioContext: 'Y1: 500 users → $600K+/mo MRR. Y5: 10,000+ users → $30M+/mo potential.',
    notes: 'ARR = MRR × 12. Core platform at $1,200/mo is primary driver. CAC: $200/user, cost per scan: $0.07.',
  },

  stabilizedUnits: {
    metricName: 'Stabilized Units',
    definition: 'Housing units that have completed construction, been leased, and reached target occupancy levels.',
    whyItMatters: 'Only stabilized units generate rental revenue and can be valued using cap rate methodology.',
    inputDrivers: ['Construction timeline', 'Lease-up period', 'Occupancy rates', 'Market demand'],
    formulaLogic: 'Cumulative units from years where (current year - construction year) > stabilization lag.',
    scenarioContext: 'Rent: $2,200/unit/month. Occupancy: 90%. Y1: 10 units, Y5: 180 cumulative units.',
    notes: 'Asset value = Annual Rental Revenue / Cap Rate. At 6% cap rate, each $1 of NOI = $16.67 of value. Y5 equity: ~$54M.',
  },

  cumulativeInstalls: {
    metricName: 'Cumulative Solar Installs',
    definition: 'Total distributed solar installations completed across all years, actively generating SREC revenue.',
    whyItMatters: 'Cumulative installs represent the compounding asset base — each new install adds perpetual SREC revenue for 20+ years.',
    inputDrivers: ['Monthly marketing spend (ramping $50K→$200K/mo)', 'Lead cost ($200 blended)', 'Conversion rate (8%)', 'Installation capacity'],
    formulaLogic: 'Monthly: Leads = spend/leadCost, Installs = leads × conversion. Aggregated to yearly then cumulative. Installs grow as spend ramps.',
    scenarioContext: 'Conservative: slower ramp. Base: $50K→$200K/mo. Growth: $60K→$230K/mo. Aggressive: $75K→$275K/mo.',
    notes: 'No build delay for distributed installs — SRECs begin generating from the install year. Each install also generates a one-time installation fee ($28K avg).',
  },

  mailVolume: {
    metricName: 'Monthly Mail Volume',
    definition: 'Number of direct-to-owner mail pieces sent per month to source land acquisition opportunities.',
    whyItMatters: 'Mail volume is the top of the acquisition funnel — it determines the ceiling on deal flow.',
    inputDrivers: ['Marketing budget', 'Target market size', 'List quality', 'Geographic expansion'],
    formulaLogic: 'Base mail volume × year-over-year growth multiplier (1x to 3.5x over 5 years).',
    scenarioContext: 'Y1: 20,000/mo, Y2: 30,000/mo, Y3: 35,000/mo, Y4: 40,000/mo, Y5: 45,000/mo. Cost: $1.50/piece.',
  },

  responseRate: {
    metricName: 'Response Rate',
    definition: 'The percentage of mailed property owners who respond to the outreach campaign.',
    whyItMatters: 'Small changes in response rate significantly impact the number of qualified leads entering the pipeline.',
    inputDrivers: ['List quality', 'Mail piece design', 'Market conditions', 'Offer terms', 'Follow-up cadence'],
    formulaLogic: 'Responses = Mail Volume × Response Rate.',
    scenarioContext: 'Base: 1% response rate. 40% lead rate from responses. 10% close rate from leads.',
    notes: 'Industry standard for direct mail land acquisitions is 0.5-2%. Combined conversion: 1% × 40% × 10% = 0.004% mail to deal.',
  },

  capitalDeployment: {
    metricName: 'Capital Deployment',
    definition: 'How the $40M capital raise is allocated across business divisions and operational categories.',
    whyItMatters: 'Capital allocation determines the growth rate and revenue mix of the platform.',
    inputDrivers: ['Strategic priorities', 'Return profiles', 'Market timing', 'Operational readiness'],
    formulaLogic: 'Total Capital × Allocation Percentage per division/category.',
    scenarioContext: 'Low-Income Housing & Subdividing: $10.07M, Distributed Solar: $10M, Home Services: $8.475M, Marketing: $5.3M, Wholesale Pipeline: $3.58M, Aerial Insights: $1.775M, Strategic Partnerships: $0.8M.',
  },

  wholesaleRevenue: {
    metricName: 'Wholesale Revenue',
    definition: 'Revenue from assigning land purchase contracts to end buyers at a markup (assignment fee).',
    whyItMatters: 'Wholesale provides immediate liquidity with minimal capital tied up, funding operations while longer-term assets develop.',
    inputDrivers: ['Deal flow', 'Wholesale allocation', 'Assignment fee', 'Buyer network depth'],
    formulaLogic: 'Wholesale Deals × Average Assignment Fee. Margin: ~85% (minimal holding costs).',
    scenarioContext: 'Base assignment fee: $18,000. Y1: 57.6 deals = $1,036,800. Y5: 129.6 deals = $2,332,800.',
  },

  solarConversionRate: {
    metricName: 'Solar Conversion Rate',
    definition: 'The percentage of Home Services customers who convert into solar installation projects.',
    whyItMatters: 'Cross-selling from home services into solar is a major efficiency advantage — zero incremental CAC.',
    inputDrivers: ['Home Services volume', 'Sales training', 'Customer qualifying criteria', 'Solar economics'],
    formulaLogic: 'Solar Leads = Home Services Deals × Solar Conversion Rate.',
    scenarioContext: 'Conservative: 10%, Base: 15%, Growth: 18%, Aggressive: 22%',
  },

  occupancyRate: {
    metricName: 'Occupancy Rate',
    definition: 'The percentage of housing units that are leased and generating rental income.',
    whyItMatters: 'Occupancy directly drives rental revenue and impacts asset valuations through NOI.',
    inputDrivers: ['Market demand', 'Pricing', 'Property management quality', 'Location'],
    formulaLogic: 'Rental Revenue = Units × Monthly Rent × 12 × Occupancy Rate.',
    scenarioContext: 'Conservative: 85%, Base: 90%, Growth: 93%, Aggressive: 95%',
  },

  capRate: {
    metricName: 'Capitalization Rate',
    definition: 'The rate used to value real estate assets based on their net operating income (NOI).',
    whyItMatters: 'Lower cap rates mean higher asset valuations for the same income stream.',
    inputDrivers: ['Market conditions', 'Property type', 'Location', 'Interest rates', 'Asset quality'],
    formulaLogic: 'Asset Value = Annual NOI / Cap Rate. Example: $100K NOI at 7.5% cap = $1.33M value.',
    scenarioContext: 'Conservative: 7%, Base: 6%, Growth: 5.5%, Aggressive: 5%. Lower cap rates = higher valuations.',
  },

  userGrowth: {
    metricName: 'Active User Growth',
    definition: 'The net growth in active Aerial Insights platform users, accounting for both new signups and churn.',
    whyItMatters: 'User growth drives all Aerial Insights revenue streams — subscriptions, leads, add-ons, and enterprise.',
    inputDrivers: ['Marketing spend', 'Product quality', 'Churn rate', 'Market size', 'Referrals'],
    formulaLogic: 'Users = Starting Users × (1 + Net Monthly Growth Rate) ^ Months. Net Rate = Growth Rate - Churn Rate.',
    scenarioContext: 'Net monthly growth ranges from 2% (conservative) to 15% (aggressive).',
  },

  blendedMargin: {
    metricName: 'Blended Gross Margin',
    definition: 'The weighted average gross margin across all revenue streams and divisions.',
    whyItMatters: 'Blended margin indicates overall business quality and the pathway from revenue to profitability.',
    inputDrivers: ['Division revenue mix', 'Individual division margins', 'Operational efficiency'],
    formulaLogic: 'Total Gross Profit / Total Revenue. Ranges from ~35% (services-heavy) to ~55% (SaaS-heavy mix).',
    scenarioContext: 'As Aerial Insights and distributed solar scale (higher margins), blended margins improve.',
  },

  divisionMix: {
    metricName: 'Revenue Division Mix',
    definition: 'The percentage contribution of each business division to total portfolio revenue.',
    whyItMatters: 'The revenue mix shows platform diversification and which divisions are driving growth in each period.',
    inputDrivers: ['Individual division growth rates', 'Market conditions', 'Capital allocation'],
    formulaLogic: 'Division Revenue / Total Revenue for each division.',
    scenarioContext: 'Early years: Home Services dominant. Later years: Real Estate and Aerial Insights grow as % of mix.',
  },

  equityCreated: {
    metricName: 'Equity Created at Acquisition',
    definition: 'The immediate paper equity gain from purchasing land below market value.',
    whyItMatters: 'Day-one equity creation provides a margin of safety and demonstrates disciplined acquisition strategy.',
    inputDrivers: ['Purchase discount', 'Market value accuracy', 'Negotiation quality', 'Deal sourcing'],
    formulaLogic: 'Equity = Market Value - Purchase Price. Market Value = Parcel Size × Value Per Acre.',
    scenarioContext: 'Base discount: 35% below market. Aggressive: 40%. Creates $40K-$80K equity per deal.',
  },

  dealsPerRep: {
    metricName: 'Deals Per Rep Per Month',
    definition: 'The average number of signed agreements each sales rep closes per month.',
    whyItMatters: 'This metric captures rep productivity — the combination of activity (doors knocked) and effectiveness (close rate).',
    inputDrivers: ['Doors per day', 'Working days', 'Contact rate', 'Close rate', 'Training quality'],
    formulaLogic: 'Doors/Day × Days/Month × Contact Rate × Close Rate.',
    scenarioContext: 'Base: ~1.8 deals/rep/month. Top performers: 3-4 deals/rep/month.',
  },
}
