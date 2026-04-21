// Re-export constants from content.ts for single-source imports
export {
  PLATFORM_NAME,
  CAPITAL_RAISE,
  GEOGRAPHY,
  RETURN_WINDOW,
  INVESTMENT_THESIS,
  OVERVIEW,
  OVERVIEW_PLATFORM_SUMMARY,
  OVERVIEW_HOW_IT_WORKS,
  HOME_SERVICES,
  SALES_ENGINE_CHANNELS,
  HOME_SERVICES_OPERATIONAL_MODEL,
  SOLAR_REAL_ESTATE,
  AERIAL_INSIGHTS,
  STRATEGIC_IMPACT,
  QUALIFICATIONS,
} from './content'

// ─── MEMO-SPECIFIC NARRATIVE CONTENT ───────────────────────────────────────
// Institutional-grade copy. Every sentence is load-bearing.
// Do not soften. Do not embellish. Do not remove specificity.

export const MEMO = {
  // Cover meta
  coverSubtitle: 'Confidential Investment Memorandum',
  coverDate: 'April 2026',
  coverThesis:
    'An integrated platform combining immediate cash flow, long-duration recurring revenue, appreciating hard assets, and a proprietary AI intelligence layer — engineered to compound returns across four distinct timelines.',
  coverDisclaimer:
    'This document is confidential and intended solely for the use of the party to whom it is addressed. It contains proprietary information and may not be reproduced, distributed, or disclosed without prior written consent.',

  // Section I — Executive Summary
  executiveSummary: [
    'Future Green Capital Group is raising $40 million to scale an integrated four-division platform spanning direct-to-consumer home services, distributed solar, real estate, and proprietary AI property intelligence. The capital underwrites a business that is already operating, already credentialed, and already executing — structured to compound returns across overlapping time horizons rather than a single exit.',
    'Home services anchors near-term cash flow through roofing, HVAC, insulation, solar, and energy-efficiency projects, delivered via a distributed subcontractor model and acquired through four independent sales channels. In parallel, capital is deployed into distributed solar assets that produce Solar Renewable Energy Credits for twenty years, and into real estate positions that appreciate independently of service revenue cycles.',
    'Aerial Insights supplies the intelligence layer. The platform identifies high-probability exterior-condition properties from satellite and street-level imagery, producing leads at $0.15 each against an industry benchmark of $50–$200+. It compresses customer acquisition cost across every division and operates externally as a standalone SaaS product at $1,200 per month.',
    'Investor economics resolve in two phases. During the accelerated phase, distributions flow from 15% of home services profit, 20% of combined solar and real estate profit, 10% of Aerial Insights profit, and 50% of SREC revenue, continuing until cumulative returns reach $66 million — a 1.65x multiple on $40 million. Once the threshold clears, accelerated streams terminate and two permanent positions remain: 50% SREC participation for the remaining twenty-year life of each contract, and a 3% perpetual residual on Aerial Insights revenue.',
  ],

  // Section II — Investment Overview
  investmentOverview: [
    'The raise funds a single integrated platform, not a portfolio of independent ventures. Each division produces a distinct form of return — immediate cash flow, long-duration recurring revenue, appreciating hard assets, and technology-driven value creation — and each contributes to the underwriting of the whole. Diversification here is structural, not portfolio-theoretic.',
    'Deployment is sequenced. Home services and wholesale real estate generate Year 1 cash flow. Distributed solar and housing development compound from Year 2 forward. Aerial Insights accumulates data advantage and SaaS revenue across the full horizon. Capital is allocated to produce returns on overlapping — not identical — timelines.',
  ],

  // Section III — Platform Architecture
  platformNarrative:
    'The four divisions operate as one system. Aerial Insights supplies property-level intelligence that reduces acquisition cost across home services, solar, and real estate. Home services customers convert into solar prospects. Real estate sourcing reuses the same direct-mail and data infrastructure that powers lead generation. Solar installations compound into independently producing SREC revenue. Growth in any one division amplifies the others — a reinforcement loop engineered by design, not by chance.',

  // Section IV — Home Services
  homeServicesNarrative: [
    'Home services is the platform\'s cash flow engine. The division delivers roofing, HVAC, attic insulation, air sealing, water heaters, residential solar, and LED lighting through a distributed subcontractor network, with per-service gross margins between 35% and 55%. Roofing anchors entry volume and serves as the cross-sell foundation into every adjacent service line.',
    'Execution rests on four independent acquisition channels: door-to-door teams canvassing AI-optimized territories, direct-mail campaigns targeting storm-affected and aging-roof properties, paid-search campaigns aggregating high-intent grant-eligible leads, and a commercial sales function pursuing institutional projects at eight- to ten-times the residential ticket size. Each channel carries its own unit economics and its own defensible logic.',
  ],

  // Section V — Sales & Acquisition
  salesEngineNarrative:
    'The four-channel design eliminates single-channel dependency and builds structural volume redundancy. Door-to-door delivers high-frequency residential penetration. Direct mail produces a verified 15:1 return on marketing spend. Commercial wins institutional contracts at 8–10x residential ticket size. Paid search converts grant-eligible homeowners, 60% of whom qualify for coverage averaging 30% of project cost — a close-rate advantage built into the lead itself.',

  // Section IV sub-note — Customer Expansion
  customerExpansionNarrative:
    'Every roofing job is an entry point to six adjacent service lines. The 15–20% cross-sell rate compounds rapidly at scale: at 42+ reps generating hundreds of roofing jobs per month, secondary revenue becomes a major profit stream with no proportional rise in acquisition cost. Lifetime value expands structurally, not incidentally.',

  // Section VI — Grant Advantage
  grantNarrative: [
    'Federal and state energy-efficiency grants translate directly into margin. Approximately 60% of residential energy leads qualify for coverage averaging 30% of project cost. Combined with average rebate offsets of $3,500 per residential deal and $375,000 per commercial deal, grant-eligible services clear base margins by a factor of 1.3x to 1.5x.',
    'This infrastructure is not transitional. It reflects multi-administration federal energy policy and entrenched state-level programs, and is positioned to expand — not contract — across the deployment horizon. Grant integration is a structural feature of the platform\'s margin profile, not a timing advantage.',
  ],

  // Section VII — Distributed Solar
  solarNarrative: [
    'Distributed solar is acquired through a marketing-driven funnel that ramps from $50K to $200K in monthly spend across Years 1 through 5. Leads are produced at a blended $200 acquisition cost and convert to installations at 8%, producing a compounding install base across the deployment period.',
    'Each installation generates two revenue streams. The installation fee — $28,000 at a 32% margin — produces near-term cash and counts toward investor payback. The SREC stream — 12 credits per year at $400 per credit — produces $4,800 of annual gross revenue per installation for twenty years. Because new installations accumulate annually while prior cohorts continue producing, the SREC portfolio behaves as a stacked annuity rather than a single-year revenue event.',
  ],

  // Section VIII — Real Estate
  realEstateNarrative: [
    'The real estate division deploys capital through three distinct channels. Wholesale converts below-market land acquisitions into fast-turn liquidity at an average $18,000 assignment fee. Housing development executes standardized builds at a $200K cost basis against $360K market value. Subdivision unlocks embedded value through parcel reconfiguration and lot splitting — producing multiple expansion on acreage that would otherwise sit dormant.',
    'Deal sourcing runs on the same direct-mail and data infrastructure that powers customer acquisition. Incoming properties are evaluated and routed to the highest-return pathway based on zoning, location, and market conditions. The intelligence layer built for leads is reused to originate deal flow.',
  ],

  // Section IX — Aerial Insights
  aerialNarrative: [
    'Aerial Insights is a proprietary computer-vision platform that analyzes satellite and street-level imagery to identify exterior property conditions at scale. It detects roofing materials, siding types, and structural indicators, and scores every property within a targeted geography. Leads are produced at $0.15 each — approximately 300x below the industry benchmark of $50–$200+.',
    'Internally, the platform compresses acquisition cost across every revenue-producing division. Externally, it operates as a standalone SaaS product at $1,200 per month, with a Year 5 target of 20,000 subscribers. Both businesses run on the same underlying data infrastructure — the marginal cost of serving either is near zero.',
    'The competitive position compounds with time. Each scan improves model accuracy. Each closed deal validates scoring. Each market expansion adds training data. The result is a defensive moat that widens with scale and deepens with operating history — characteristics typical of data infrastructure assets, not early-stage software.',
  ],

  // Section X — Capital Deployment
  capitalDeploymentNarrative:
    'The $40 million raise is deployed across seven categories, each mapped to a defined operational output. Home services and wholesale funding convert directly into Year 1 cash generation. Distributed solar and housing capital build medium-term asset and recurring-revenue positions. Aerial Insights, marketing, and strategic partnerships fund the long-duration value creation layer. Every dollar carries a specific destination, a specific output, and a specific time horizon.',

  // Section XI — Financial Projections
  financialProjectionsNarrative:
    'Projections span five years and model the full platform simultaneously. Year 1 establishes operational capacity and initial cash generation. Years 2 and 3 accelerate through expanded headcount, a larger installed solar base, and maturing real estate deal flow. Years 4 and 5 compound as SREC cohorts stack, cross-sell volume expands, and Aerial Insights SaaS revenue crosses into material scale.',

  // Section XII — Scenario Analysis
  scenarioNarrative:
    'The model is stress-tested under four named scenarios — Conservative, Base Case, Growth, and Aggressive Scale — each adjusting rep count, conversion rates, marketing spend, SREC pricing, and SaaS growth trajectories. The investor return threshold clears in all four cases. Variation is primarily in the timeline to threshold: faster under growth and aggressive cases, slower under conservative, but achieved in each.',

  // Section XIII — Investor Return Structure
  investorReturnNarrative: [
    'Investor economics resolve in two sequential phases. In the accelerated phase, the investor receives 15% of home services profit, 20% of combined solar and real estate profit, 10% of Aerial Insights profit, and 50% of SREC revenue. Every stream counts toward a cumulative $66 million threshold — a 1.65x return on $40 million invested.',
    'Once the threshold clears, the three accelerated streams terminate. Two permanent positions remain: 50% SREC participation across every installation cohort originated in Years 1 through 5, extending for the full twenty-year life of each contract, and a 3% perpetual residual on Aerial Insights revenue. The investor transitions from aggressive near-term distributions to durable long-duration income without any change in deal terms.',
  ],

  // Section XIV — Residual Income & Exit
  residualNarrative: [
    'Post-threshold, SREC participation continues across every installation cohort originated during the deployment period. Each cohort produces SRECs for twenty years at 50% investor equity. Because cohorts stack — Year 1 installs still producing while Year 5 installs begin — the residual income profile peaks during overlap and extends well beyond the original capital deployment window.',
    'The 3% Aerial Insights residual scales with the underlying SaaS business. As subscriber count compounds past 20,000, the residual grows proportionally. At a Year 7 exit, ARR-based valuations of 4x, 6x, or 8x translate the 3% equity share into meaningful participation in enterprise value — a distinct return path that operates independently of the SREC portfolio.',
  ],

  // Section XV — Qualifications
  qualificationsNarrative:
    'This is an existing operating business. Future Green Services has operated continuously since 2012, completing 50,000+ home energy audits, serving 300,000+ residential and commercial customers, and earning the ENERGY STAR Century Club Award from the U.S. Department of Energy and EPA. The leadership team holds LEED AP, BPI, MIT Sustainable Energy, and GPRO credentials. Execution runs through a vetted subcontractor network that includes Greenscape Energy (13,000+ solar installations), Cecil & Sons HVAC, and Argueta\'s True R-Value Insulation. The capital funds scaling, not formation.',

  // Section XVI — Strategic Impact
  impactNarrative:
    'The deployment produces measurable impact alongside financial return. The five-year model projects 500+ jobs created, 2,900+ solar installations, 135+ housing units delivered, 50,000+ home energy audits completed, and $100M+ in regional economic output. As a certified Minority Business Enterprise, the platform accesses programmatic opportunities and partnerships that reinforce its execution infrastructure. Impact is a byproduct of the business model — not a marketing overlay.',

  // Section XVII — Closing Investment Thesis
  closingThesis: [
    'Future Green Capital Group assembles four elements that rarely appear together: immediate cash flow, long-duration recurring revenue, appreciating hard assets, and a proprietary technology moat — inside a single integrated platform, under a single operating team, with a single deployment plan.',
    'The $40 million capital structure produces accelerated returns during the deployment period and two permanent positions after threshold: 50% SREC participation across twenty-year contracts, and a 3% perpetual residual on a growing SaaS business. The deal is engineered to return capital efficiently and to continue producing income long after capital has been returned.',
    'Execution credentials are established. Operational depth is documented. The model is stress-tested. What remains is deployment.',
  ],

  closingCTA:
    'For full financial modeling, supporting documentation, or to discuss participation terms, contact Future Green Capital Group directly.',
}
