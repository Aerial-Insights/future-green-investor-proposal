// Operating Structure — investor-facing blueprint of the team architecture and
// entity structure. This data model powers a fully visual, two-tab page:
// 1) Team Structure — divisions, role groups, hierarchies, funnels, automation
// 2) Entity Structure — trust → division → subsidiary diagram
//
// Visual reference: https://canva.link/7no0j2hm723wmve
// Headcounts are the authoritative Year-One target snapshot.

import { DIVISION_COLORS } from '../../theme/chartTheme'

export type DivisionId = 'homeServices' | 'realEstate' | 'aerialInsights'

export type RoleGroupId =
  | 'leadership'
  | 'sales'
  | 'operations'
  | 'support'
  | 'technology'

export interface RoleDetail {
  id: string
  title: string
  count: number
  divisionId: DivisionId
  group: RoleGroupId
  shortNote?: string
  description: string
  responsibilities: string[]
  revenueImpact: string
  flex?: boolean
}

export interface RoleGroup {
  id: RoleGroupId
  label: string
  roles: string[] // role ids
}

export type HierarchyLayoutId = 'stacked' | 'three-team' | 'aerial'

export interface FunnelStage {
  label: string
  description: string
}

export interface AutomationCallout {
  label: string
  description: string
}

export interface DivisionBlueprint {
  id: DivisionId
  title: string
  shortName: string
  engineLabel: string
  tagline: string
  accentColor: string
  total: number
  flexSeats?: number
  totalNote?: string
  pillars: string[]
  hierarchyLayout: HierarchyLayoutId
  groups: RoleGroup[]
  funnel: {
    label: string
    stages: FunnelStage[]
  }
  automations: AutomationCallout[]
}

// ---------------------------------------------------------------------------
// ROLE LIBRARY — keyed for clickable detail drawer
// ---------------------------------------------------------------------------

export const ROLES: Record<string, RoleDetail> = {
  // ── HOME SERVICES ────────────────────────────────────────────────────────
  hs_regional: {
    id: 'hs_regional',
    title: 'Regional Managers',
    count: 5,
    divisionId: 'homeServices',
    group: 'leadership',
    shortNote: 'Territory ownership',
    description:
      'Five regional leaders own performance across defined territories, coaching team leads and reporting directly into the operating group.',
    responsibilities: [
      'Hit regional revenue targets',
      'Coach and recruit team leads',
      'Own KPIs across territory',
    ],
    revenueImpact:
      'Each region carries a revenue quota — regional managers are the leverage point that turns 50 reps into a coordinated production force.',
  },
  hs_team_lead: {
    id: 'hs_team_lead',
    title: 'Team Leads',
    count: 11,
    divisionId: 'homeServices',
    group: 'leadership',
    shortNote: 'Daily production leadership',
    description:
      'Eleven team leads run the daily sales floor — coaching reps, working ride-alongs, and managing pipeline cadence.',
    responsibilities: [
      'Drive daily sales output',
      'Coach reps in field',
      'Manage pipeline and CRM hygiene',
    ],
    revenueImpact:
      'Team leads convert headcount into closed revenue — the multiplier between rep activity and dollars produced.',
  },
  hs_sales: {
    id: 'hs_sales',
    title: 'Sales Reps',
    count: 50,
    divisionId: 'homeServices',
    group: 'sales',
    shortNote: 'Field execution force',
    description:
      'Fifty trained reps are the production engine — running inspections, presenting bids, and signing customers across all home-service lines.',
    responsibilities: [
      'Inspect and present in the field',
      'Sign contracts and collect deposits',
      'Hand off cleanly to install ops',
    ],
    revenueImpact:
      'The 50-rep field force is the direct generator of Home Services top-line revenue.',
  },
  hs_csva: {
    id: 'hs_csva',
    title: 'CSVA',
    count: 4,
    divisionId: 'homeServices',
    group: 'support',
    shortNote: 'Customer Support VAs',
    description:
      'Four customer support virtual assistants cover scheduling, customer comms, and escalation triage — keeping reps and install managers focused on field work.',
    responsibilities: [
      'Inbound scheduling & rescheduling',
      'Customer communication and reminders',
      'Escalation triage to managers',
    ],
    revenueImpact:
      'Removes admin drag from sales and install — preserves hours on revenue-producing activities.',
  },
  hs_install: {
    id: 'hs_install',
    title: 'Install Managers',
    count: 5,
    divisionId: 'homeServices',
    group: 'operations',
    shortNote: 'Job scheduling',
    description:
      'Five install managers schedule crews, sequence jobs, and own throughput from signed contract to start date.',
    responsibilities: [
      'Schedule installs and crews',
      'Sequence material and labor',
      'Drive contract-to-install velocity',
    ],
    revenueImpact:
      'Faster contract-to-install conversion = faster revenue recognition and lower cancellation rates.',
  },
  hs_os_install: {
    id: 'hs_os_install',
    title: 'OS Install Managers',
    count: 5,
    divisionId: 'homeServices',
    group: 'operations',
    shortNote: 'On-site execution',
    description:
      'Five on-site install managers run quality and execution at the job site — keeping crews on-spec and customers in the loop.',
    responsibilities: [
      'On-site quality and crew supervision',
      'Live customer communication',
      'Resolve job-day exceptions',
    ],
    revenueImpact:
      'Owns realized revenue at the job — protects margin from rework, callbacks, and customer credits.',
  },
  hs_supplement: {
    id: 'hs_supplement',
    title: 'Supplement Manager',
    count: 1,
    divisionId: 'homeServices',
    group: 'operations',
    shortNote: 'Insurance supplements',
    description:
      'Specialist who works carrier supplements on insurance-restoration jobs — recovering scope and dollars from approved claims.',
    responsibilities: [
      'File and negotiate supplements',
      'Document scope expansions',
      'Coordinate with carriers and adjusters',
    ],
    revenueImpact:
      'Supplements lift average ticket on insurance jobs — pure margin recovery on already-sold work.',
  },
  hs_atr: {
    id: 'hs_atr',
    title: 'ATR Reps',
    count: 2,
    divisionId: 'homeServices',
    group: 'support',
    shortNote: 'Attempt-to-Repair',
    description:
      'Two attempt-to-repair specialists handle warranty calls and post-install issues — saving relationships and protecting revenue from refund risk.',
    responsibilities: [
      'Service warranty and callback claims',
      'Diagnose and repair on first visit',
      'Document for QA and supplement loops',
    ],
    revenueImpact:
      'Protects realized revenue and reduces refund/charge-back exposure on closed jobs.',
  },

  // ── REAL ESTATE ──────────────────────────────────────────────────────────
  re_team1_lead: {
    id: 're_team1_lead',
    title: 'Sales Team 1 Lead',
    count: 1,
    divisionId: 'realEstate',
    group: 'leadership',
    description:
      'Lead for primary acquisitions team — runs daily standups, reviews pipeline, and coaches reps to lock seller deals.',
    responsibilities: [
      'Manage Team 1 reps and pipeline',
      'Review live offers and call quality',
      'Hit weekly contract goals',
    ],
    revenueImpact:
      'Drives the largest share of acquisition contracts feeding underwriting and disposition.',
  },
  re_team2_lead: {
    id: 're_team2_lead',
    title: 'Sales Team 2 Lead',
    count: 1,
    divisionId: 'realEstate',
    group: 'leadership',
    description:
      'Lead for the parallel acquisitions team — provides redundancy and competitive cadence with Team 1.',
    responsibilities: [
      'Manage Team 2 reps and pipeline',
      'Drive volume in parallel with Team 1',
      'Run live coaching and call review',
    ],
    revenueImpact:
      'Doubles deal-flow capacity — two teams in parallel multiply contracts without doubling overhead.',
  },
  re_cold_lead: {
    id: 're_cold_lead',
    title: 'Cold Outreach Lead',
    count: 1,
    divisionId: 'realEstate',
    group: 'leadership',
    shortNote: 'Training pipeline',
    description:
      'Runs outbound and trains the next generation of sales reps — the third team doubles as a farm system into Teams 1 and 2.',
    responsibilities: [
      'Run cold outreach campaigns',
      'Train and ramp new reps',
      'Promote top performers into Team 1/2',
    ],
    revenueImpact:
      'Creates a self-replenishing rep pipeline — keeps headcount growth at zero recruiting cost.',
  },
  re_team1_reps: {
    id: 're_team1_reps',
    title: 'Sales Team 1 Reps',
    count: 6,
    divisionId: 'realEstate',
    group: 'sales',
    description:
      'Six closers working live seller leads — qualifying, negotiating, and locking purchase contracts.',
    responsibilities: [
      'Qualify and negotiate sellers',
      'Lock signed purchase contracts',
      'Hand off to underwriting cleanly',
    ],
    revenueImpact:
      'Direct contract production — every signed contract is the input to the deal pipeline.',
  },
  re_team2_reps: {
    id: 're_team2_reps',
    title: 'Sales Team 2 Reps',
    count: 6,
    divisionId: 'realEstate',
    group: 'sales',
    description:
      'Six closers working in parallel with Team 1 — same playbook, separate quota, redundancy of throughput.',
    responsibilities: [
      'Qualify and negotiate sellers',
      'Lock signed purchase contracts',
      'Hit independent weekly goals',
    ],
    revenueImpact:
      'Adds the second axis of throughput so deal volume is not single-team-bottlenecked.',
  },
  re_cold_reps: {
    id: 're_cold_reps',
    title: 'Cold Outreach Reps',
    count: 6,
    divisionId: 'realEstate',
    group: 'sales',
    shortNote: 'New rep training pool',
    description:
      'Six outbound reps prospecting sellers and training into Team 1/Team 2 closer roles.',
    responsibilities: [
      'Run outbound seller campaigns',
      'Book qualified appointments',
      'Train into closer roles',
    ],
    revenueImpact:
      'Generates top-of-funnel volume and feeds promotions into the closer teams.',
  },
  re_underwriters: {
    id: 're_underwriters',
    title: 'Underwriters',
    count: 2,
    divisionId: 'realEstate',
    group: 'operations',
    shortNote: 'Deal quality + UW',
    description:
      'Two underwriters evaluate every signed contract — pricing, comping, and clearing risk before disposition picks it up.',
    responsibilities: [
      'Comp and price every contract',
      'Run risk and title pre-checks',
      'Approve deals into disposition',
    ],
    revenueImpact:
      'Filters out bad-spread deals — protects margin and prevents lost time on dead contracts.',
  },
  re_dispo: {
    id: 're_dispo',
    title: 'Dispo Managers',
    count: 2,
    divisionId: 'realEstate',
    group: 'operations',
    shortNote: 'Connects to Landfront',
    description:
      'Two disposition managers package approved deals and hand them into Landfront for AI-assisted matching and exit.',
    responsibilities: [
      'Package deal rooms for buyers',
      'Push assignments into Landfront',
      'Close assignment fees',
    ],
    revenueImpact:
      'Owns the realized exit — every dollar of assignment fee runs through this role.',
  },

  // ── AERIAL INSIGHTS ──────────────────────────────────────────────────────
  ai_team1_lead: {
    id: 'ai_team1_lead',
    title: 'Sales Team 1 Lead',
    count: 1,
    divisionId: 'aerialInsights',
    group: 'leadership',
    description:
      'Leads primary outbound team selling the platform into roofing companies.',
    responsibilities: [
      'Run Team 1 standups and pipeline',
      'Coach demo and close cycles',
      'Hit subscription quota',
    ],
    revenueImpact:
      'Drives recurring SaaS subscription revenue from roofing-company customers.',
  },
  ai_team2_lead: {
    id: 'ai_team2_lead',
    title: 'Sales Team 2 Lead',
    count: 1,
    divisionId: 'aerialInsights',
    group: 'leadership',
    description:
      'Parallel team lead — same playbook, doubled outbound capacity.',
    responsibilities: [
      'Run Team 2 standups and pipeline',
      'Operate redundant to Team 1',
      'Drive net-new logo additions',
    ],
    revenueImpact:
      'Adds parallel subscription production — extra sales capacity at low fixed cost.',
  },
  ai_cold_lead: {
    id: 'ai_cold_lead',
    title: 'Cold Outreach Lead',
    count: 1,
    divisionId: 'aerialInsights',
    group: 'leadership',
    description:
      'Manages outbound roofing-company prospecting and rep training.',
    responsibilities: [
      'Build target lists of roofing cos.',
      'Run outbound campaigns',
      'Promote reps into Teams 1/2',
    ],
    revenueImpact:
      'Owns cost-efficient top-of-funnel for the SaaS business.',
  },
  ai_team1_reps: {
    id: 'ai_team1_reps',
    title: 'Sales Team 1 Reps',
    count: 4,
    divisionId: 'aerialInsights',
    group: 'sales',
    description:
      'Four closers selling subscriptions to roofing companies — demoing, scoping, and closing accounts.',
    responsibilities: [
      'Demo platform to roofing cos.',
      'Run negotiation and close',
      'Hand off to onboarding cleanly',
    ],
    revenueImpact:
      'Converts subscription pipeline directly into recurring revenue.',
  },
  ai_team2_reps: {
    id: 'ai_team2_reps',
    title: 'Sales Team 2 Reps',
    count: 4,
    divisionId: 'aerialInsights',
    group: 'sales',
    description:
      'Four parallel closers — redundant capacity, identical comp model.',
    responsibilities: [
      'Demo platform and close',
      'Hit independent quota',
      'Compete with Team 1 cadence',
    ],
    revenueImpact:
      'Doubles closer capacity for the same outbound volume.',
  },
  ai_cold_reps: {
    id: 'ai_cold_reps',
    title: 'Cold Outreach Reps',
    count: 4,
    divisionId: 'aerialInsights',
    group: 'sales',
    shortNote: 'Roofing co. outbound',
    description:
      'Four outbound reps prospecting roofing companies and feeding qualified meetings into Teams 1 and 2.',
    responsibilities: [
      'Run outbound list campaigns',
      'Book qualified demos',
      'Promote into closer roles',
    ],
    revenueImpact:
      'Top-of-funnel SaaS volume at sub-closer cost.',
  },
  ai_csva: {
    id: 'ai_csva',
    title: 'CSVA',
    count: 3,
    divisionId: 'aerialInsights',
    group: 'support',
    shortNote: 'Customer success',
    description:
      'Three customer support VAs onboard new accounts, handle inbound platform support, and drive activation.',
    responsibilities: [
      'Onboard new roofing cos.',
      'Handle inbound platform support',
      'Drive activation and retention',
    ],
    revenueImpact:
      'Owns NRR — every retained subscription is preserved revenue.',
  },
  ai_lead_dev: {
    id: 'ai_lead_dev',
    title: 'Lead Developer',
    count: 1,
    divisionId: 'aerialInsights',
    group: 'technology',
    description:
      'Owns platform engineering — backend services, model integrations, and customer-facing infrastructure.',
    responsibilities: [
      'Architect platform services',
      'Manage model integrations',
      'Lead engineering quality',
    ],
    revenueImpact:
      'Underpins every SaaS dollar — uptime, reliability, and feature velocity.',
  },
  ai_developer: {
    id: 'ai_developer',
    title: 'Developer',
    count: 1,
    divisionId: 'aerialInsights',
    group: 'technology',
    description:
      'Engineer focused on platform features, integrations, and data pipelines.',
    responsibilities: [
      'Build customer-facing features',
      'Maintain ETL pipelines',
      'Support model deployment',
    ],
    revenueImpact:
      'Adds engineering capacity for new revenue features and integrations.',
  },
  ai_annotation: {
    id: 'ai_annotation',
    title: 'Annotation Agents',
    count: 3,
    divisionId: 'aerialInsights',
    group: 'technology',
    shortNote: 'Knowledge Base labeling',
    description:
      'Three labelers feed the Knowledge Base — every property and roof image labeled improves the Detection Model.',
    responsibilities: [
      'Label property and roof imagery',
      'Maintain Knowledge Base quality',
      'Flag edge-case data for review',
    ],
    revenueImpact:
      'Compounds the data moat — better labels, sharper detection, more qualified leads.',
  },
  ai_flex: {
    id: 'ai_flex',
    title: 'Flexible Growth Seats',
    count: 2,
    divisionId: 'aerialInsights',
    group: 'support',
    shortNote: 'Optional · not confirmed',
    description:
      'Two flex seats reserved for opportunistic hires — sales, support, or engineering — to be deployed when growth metrics justify expansion.',
    responsibilities: [
      'Deployed against demand signal',
      'Roles assigned dynamically',
      'Funded only when warranted',
    ],
    revenueImpact:
      'Optionality — capacity reserve to capture upside without locking in fixed cost.',
    flex: true,
  },
}

// ---------------------------------------------------------------------------
// DIVISION BLUEPRINTS
// ---------------------------------------------------------------------------

const HOME_SERVICES: DivisionBlueprint = {
  id: 'homeServices',
  title: 'Home Services',
  shortName: 'Home Services',
  engineLabel: 'Field Execution Engine',
  tagline: 'Regional sales, team-led production, end-to-end install ops.',
  accentColor: DIVISION_COLORS.homeServices,
  total: 83,
  pillars: ['Regional leadership', 'Team-led production', 'End-to-end install ops'],
  hierarchyLayout: 'stacked',
  groups: [
    { id: 'leadership', label: 'Leadership', roles: ['hs_regional', 'hs_team_lead'] },
    { id: 'sales', label: 'Sales', roles: ['hs_sales'] },
    { id: 'operations', label: 'Operations', roles: ['hs_install', 'hs_os_install', 'hs_supplement'] },
    { id: 'support', label: 'Support', roles: ['hs_csva', 'hs_atr'] },
  ],
  funnel: {
    label: 'Field Execution Funnel',
    stages: [
      { label: 'Lead Generation', description: 'AI + marketing-driven leads enter the pipeline.' },
      { label: 'Sales Rep Inspection', description: 'Reps inspect property and present scope.' },
      { label: 'Contract / Approval', description: 'Customer signs, deposit collected.' },
      { label: 'Supplement Review', description: 'Insurance jobs run through supplement loop.' },
      { label: 'Install Management', description: 'Install + OS managers schedule and execute.' },
      { label: 'Customer Completion', description: 'ATR closes any callbacks; revenue realized.' },
    ],
  },
  automations: [
    { label: 'Lead Routing', description: 'Inbound leads auto-route to the closest available rep by zip and capacity.' },
    { label: 'CRM Status Movement', description: 'Pipeline stages auto-advance from inspection → bid → signed → installed.' },
    { label: 'Follow-Up Workflows', description: 'Drip sequences fire on no-show, pending bid, and post-install touchpoints.' },
    { label: 'Dispatch & Install Coordination', description: 'Install scheduler pulls signed jobs and assigns crews automatically.' },
    { label: 'Supplement Tracking', description: 'Carrier responses and approvals flow into the supplement queue without manual entry.' },
  ],
}

const REAL_ESTATE: DivisionBlueprint = {
  id: 'realEstate',
  title: 'Real Estate',
  shortName: 'Real Estate',
  engineLabel: 'Deal Flow Engine',
  tagline: 'Three sales teams feed underwriting and dispo into Landfront.',
  accentColor: DIVISION_COLORS.realEstate,
  total: 25,
  pillars: ['Three-team sales engine', 'In-house underwriting', 'Landfront-powered exit'],
  hierarchyLayout: 'three-team',
  groups: [
    { id: 'leadership', label: 'Leadership', roles: ['re_team1_lead', 're_team2_lead', 're_cold_lead'] },
    { id: 'sales', label: 'Sales', roles: ['re_team1_reps', 're_team2_reps', 're_cold_reps'] },
    { id: 'operations', label: 'Operations', roles: ['re_underwriters', 're_dispo'] },
  ],
  funnel: {
    label: 'Deal Flow Funnel',
    stages: [
      { label: 'Lead Source / Outreach', description: 'Cold outreach + inbound seller leads.' },
      { label: 'Sales Qualification', description: 'Teams 1 & 2 qualify and lock contracts.' },
      { label: 'Underwriting', description: 'Two underwriters comp, price, and clear risk.' },
      { label: 'Disposition', description: 'Dispo managers package deal rooms.' },
      { label: 'Landfront AI Sale / Exit', description: 'Landfront matches buyers and closes assignment.' },
    ],
  },
  automations: [
    { label: 'Lead Enrichment', description: 'Seller leads auto-enriched with property, ownership, and equity data on intake.' },
    { label: 'Qualification Logic', description: 'Scoring rules route hot leads to closers and warm leads to nurture.' },
    { label: 'Underwriting Comps', description: 'Auto-pulled comps and price-band suggestions surface in the UW queue.' },
    { label: 'Landfront Handoff', description: 'Approved deals push directly into Landfront for AI buyer matching.' },
    { label: 'Pipeline Hygiene', description: 'Inactive contracts auto-flagged and surfaced to leads weekly.' },
  ],
}

const AERIAL_INSIGHTS: DivisionBlueprint = {
  id: 'aerialInsights',
  title: 'Aerial Insights',
  shortName: 'Aerial Insights',
  engineLabel: 'Technology Intelligence Engine',
  tagline: 'Outbound SaaS to roofing cos. — annotation compounds the Detection Model.',
  accentColor: DIVISION_COLORS.aerialInsights,
  total: 23,
  flexSeats: 2,
  totalNote: '23 confirmed · 2 flex seats reconcile to 25',
  pillars: ['Outbound roofing sales', 'CSVA-led onboarding', 'Annotation → Knowledge Base loop'],
  hierarchyLayout: 'aerial',
  groups: [
    { id: 'leadership', label: 'Leadership', roles: ['ai_team1_lead', 'ai_team2_lead', 'ai_cold_lead'] },
    { id: 'sales', label: 'Sales', roles: ['ai_team1_reps', 'ai_team2_reps', 'ai_cold_reps'] },
    { id: 'support', label: 'Support', roles: ['ai_csva', 'ai_flex'] },
    { id: 'technology', label: 'Technology / AI', roles: ['ai_lead_dev', 'ai_developer', 'ai_annotation'] },
  ],
  funnel: {
    label: 'Platform Customer Funnel',
    stages: [
      { label: 'Roofing Company Data Pull', description: 'Targeted lists of roofing cos. built for outbound.' },
      { label: 'Cold Outreach', description: 'Outreach team books qualified demos.' },
      { label: 'Sales Conversion', description: 'Teams 1 & 2 close subscription accounts.' },
      { label: 'Customer Onboarding', description: 'CSVAs onboard, activate, and retain.' },
      { label: 'Platform Support', description: 'CSVAs + engineering keep customers successful.' },
      { label: 'Detection Model Feedback', description: 'Customer usage feeds back into the model loop.' },
    ],
  },
  automations: [
    { label: 'Data Enrichment', description: 'Outbound lists auto-enriched with roofing-company size, geography, and stack.' },
    { label: 'Annotation Pipeline', description: 'New imagery flows from customers into the Annotation queue automatically.' },
    { label: 'Knowledge Base Updates', description: 'Labeled property data syncs into the Knowledge Base on a continuous cadence.' },
    { label: 'Model Feedback Loop', description: 'Knowledge Base growth retrains the Detection Model on a recurring cycle.' },
    { label: 'Onboarding Workflow', description: 'New subscriptions auto-trigger onboarding tasks and CSVA assignment.' },
  ],
}

// ---------------------------------------------------------------------------

export const DIVISIONS: Record<DivisionId, DivisionBlueprint> = {
  homeServices: HOME_SERVICES,
  realEstate: REAL_ESTATE,
  aerialInsights: AERIAL_INSIGHTS,
}

export const DIVISION_ORDER: DivisionId[] = [
  'homeServices',
  'realEstate',
  'aerialInsights',
]

// Brighter accent variants used when text/badges sit on dark surfaces.
// The base accents (deep forest, indigo) are too low-contrast on the dark hero
// gradient — these lifted variants stay readable on dark forest backgrounds.
export const DIVISION_ACCENTS_ON_DARK: Record<DivisionId, string> = {
  homeServices: '#e6c66a', // brighter gold
  realEstate: '#7bd2a0',   // sage / mint on dark
  aerialInsights: '#a5b4fc', // light indigo
}

// ---------------------------------------------------------------------------
// ENTITY STRUCTURE — Central Trust → Divisions → Subsidiaries
// ---------------------------------------------------------------------------

export interface EntitySubsidiary {
  name: string
  note?: string
}

export interface EntityDivision {
  id: 'homeServices' | 'realEstate'
  title: string
  badge: string
  description: string
  subsidiaries: EntitySubsidiary[]
}

export interface SeparateEntity {
  title: string
  badge: string
  description: string
  capabilities: { label: string; note: string }[]
}

export const ENTITY_STRUCTURE = {
  trust: {
    title: 'Central Trust',
    badge: 'Centralized Control',
    note: 'Holds and directs both operating divisions.',
  },
  divisions: [
    {
      id: 'homeServices',
      title: 'Home Services Division',
      badge: 'Liability Separation',
      description:
        'Each service line operates as a separate subsidiary so liability stays isolated between trades.',
      subsidiaries: [
        { name: 'Roofing', note: 'Highest volume entry service' },
        { name: 'HVAC', note: 'High-margin recurring replacements' },
        { name: 'Solar', note: 'Largest revenue per job' },
        { name: 'Water Heaters', note: 'Energy-code-driven demand' },
        { name: 'Air Sealing', note: 'Bundled with insulation' },
        { name: 'Insulation', note: 'Grant-eligible core' },
        { name: 'LED Lighting', note: 'Quick-install add-on' },
      ],
    },
    {
      id: 'realEstate',
      title: 'Real Estate Division',
      badge: 'Centralized Platform',
      description:
        'Operated through the central platform — acquisition, underwriting, and disposition route into Landfront.',
      subsidiaries: [
        { name: 'Acquisition', note: 'Three-team sales engine' },
        { name: 'Underwriting', note: 'In-house deal pricing' },
        { name: 'Disposition', note: 'Packaged deal rooms' },
        { name: 'Landfront', note: 'AI buyer matching & exit' },
      ],
    },
  ] as EntityDivision[],
  separate: {
    title: 'Aerial Insights',
    badge: 'Separate Technology Entity',
    description:
      'Operates alongside the trust as an independent technology entity — strategically aligned, structurally separate.',
    capabilities: [
      { label: 'SaaS / AI Platform', note: 'Subscription revenue from roofing companies' },
      { label: 'Detection Model', note: 'Proprietary computer vision' },
      { label: 'Knowledge Base', note: 'Compounding labeled data' },
      { label: 'Advisory Support', note: 'Qualifications + advisory board position' },
    ],
  } as SeparateEntity,
  investorNote:
    'The entity structure is designed to separate operating liability by service line while keeping strategic control centralized. Home Services subsidiaries isolate risk between trades, Real Estate operates through the central platform, and Aerial Insights remains a separate technology entity aligned with the operating group.',
}

// ---------------------------------------------------------------------------
// SERVICE-SPECIFIC FUNNELS (Home Services)
// ---------------------------------------------------------------------------

export type HsServiceId = 'roofing' | 'hvac' | 'water_heater' | 'insulation' | 'solar'

export interface FunnelDef {
  id: string
  stages: { label: string; sub?: string }[]
}

export const HS_SERVICES: { id: HsServiceId; label: string }[] = [
  { id: 'roofing', label: 'Roofing' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'water_heater', label: 'Water Heater' },
  { id: 'insulation', label: 'Insulation' },
  { id: 'solar', label: 'Solar' },
]

// Standard funnel — used by HVAC, Water Heater, Insulation, Solar
export const HS_FUNNEL_STANDARD: FunnelDef = {
  id: 'hs_standard',
  stages: [
    { label: 'Open Lead', sub: 'PPC + Referral' },
    { label: 'In-Home Inspection', sub: 'Qualification' },
    { label: 'Schedule Install', sub: 'Materials staged' },
    { label: 'Install' },
    { label: 'Upsell + Referrals' },
  ],
}

export const HS_FUNNEL_ROOFING: FunnelDef = {
  id: 'hs_roofing',
  stages: [
    { label: 'Open Lead', sub: 'D2D + DM + Referral' },
    { label: 'Inspection + Claim Call' },
    { label: 'Adjuster Meeting' },
    { label: 'Supplement Process' },
    { label: 'Pick Color + Schedule' },
    { label: 'Install' },
    { label: 'Upsell + Referrals' },
  ],
}

// ---------------------------------------------------------------------------
// AI / AUTOMATION TOOLS — connected to funnel stages (1-indexed)
// ---------------------------------------------------------------------------

export interface AITool {
  id: string
  name: string
  tagline: string // ONE clean line
  // Stage connections per funnel — keyed by funnel id; values are 1-indexed stage numbers
  stagesByFunnel: Record<string, number[]>
  // Whether this tool is core (always shown) or service-gated (only roofing, etc.)
  serviceFilter?: HsServiceId[]
}

export const HS_TOOLS: AITool[] = [
  {
    id: 'arc_crm',
    name: 'ARC CRM',
    tagline: 'Central system connecting all tools, workflows, and data.',
    stagesByFunnel: {
      hs_standard: [1, 2, 3, 4, 5],
      hs_roofing: [1, 2, 3, 4, 5, 6, 7],
    },
  },
  {
    id: 'qualify_ai',
    name: 'Qualify AI',
    tagline: 'Auto-qualifies rebates and grants from the customer address.',
    stagesByFunnel: {
      hs_standard: [1],
    },
    serviceFilter: ['hvac', 'water_heater', 'insulation', 'solar'],
  },
  {
    id: 'claim_portal',
    name: 'Claim Portal',
    tagline: 'Customer portal for selections, status, and updates.',
    stagesByFunnel: {
      hs_standard: [2, 3, 4],
      hs_roofing: [2, 3, 5, 6],
    },
  },
  {
    id: 'supotrack',
    name: 'SupoTrack',
    tagline: 'Automates the entire insurance supplement process.',
    stagesByFunnel: {
      hs_roofing: [4],
    },
    serviceFilter: ['roofing'],
  },
  {
    id: 'delay_proof',
    name: 'Delay Proof',
    tagline: 'Watches weather risk and auto-reschedules installs.',
    stagesByFunnel: {
      hs_standard: [3, 4],
      hs_roofing: [5, 6],
    },
  },
  {
    id: 'rep_lift',
    name: 'RepLift',
    tagline: 'Post-install automation for referrals and upsells over time.',
    stagesByFunnel: {
      hs_standard: [5],
      hs_roofing: [7],
    },
  },
]

// ---------------------------------------------------------------------------
// REAL ESTATE — Funnel + Landfront engine
// ---------------------------------------------------------------------------

export const RE_FUNNEL: FunnelDef = {
  id: 're_main',
  stages: [
    { label: 'Open Lead' },
    { label: 'Call + Underwrite' },
    { label: 'Contract Property' },
    { label: 'Market Property' },
    { label: 'Close' },
  ],
}

export interface LandfrontFeature {
  id: string
  name: string
  tagline: string
  stages: number[]
  group: 'lead' | 'marketing' | 'closing'
}

export const LANDFRONT_FEATURES: LandfrontFeature[] = [
  {
    id: 'lf_letters',
    name: 'Handwritten Letter Automation',
    tagline: 'AI-driven seller outreach at scale.',
    stages: [1],
    group: 'lead',
  },
  {
    id: 'lf_followup',
    name: 'Follow-Up Sequences',
    tagline: 'Automated nurture across every stage.',
    stages: [1, 5],
    group: 'lead',
  },
  {
    id: 'lf_buyers',
    name: 'Nationwide Buyer List',
    tagline: 'Continuously enriched, ranked buyer database.',
    stages: [4],
    group: 'marketing',
  },
  {
    id: 'lf_match',
    name: 'Property → Buyer Matching',
    tagline: 'Instant matchmaking on every new contract.',
    stages: [4],
    group: 'marketing',
  },
  {
    id: 'lf_auction_public',
    name: 'Public Auction Engine',
    tagline: 'Open bidding — price climbs in real time.',
    stages: [4, 5],
    group: 'closing',
  },
  {
    id: 'lf_auction_blind',
    name: 'Blind Auction Engine',
    tagline: '30-day sealed-bid sequence locks the buyer.',
    stages: [4, 5],
    group: 'closing',
  },
]

// ---------------------------------------------------------------------------
// AERIAL INSIGHTS — Funnel + Sub-app ecosystem + Feedback loop
// ---------------------------------------------------------------------------

export const AI_FUNNEL: FunnelDef = {
  id: 'ai_main',
  stages: [
    { label: 'Open Lead', sub: 'PPC' },
    { label: 'Call + Close + Onboarding' },
    { label: 'Help + Bi-Yearly Follow-Up' },
  ],
}

export const AERIAL_TOOLS: AITool[] = [
  {
    id: 'ai_chatbot',
    name: 'AI Chatbot',
    tagline: 'Handles support, onboarding, and customer comms.',
    stagesByFunnel: { ai_main: [2, 3] },
  },
]

export const AERIAL_FEEDBACK_LOOP: { id: string; label: string }[] = [
  { id: 'data', label: 'Data' },
  { id: 'annotation', label: 'Annotation' },
  { id: 'kb', label: 'Knowledge Base' },
  { id: 'detection', label: 'Detection Model' },
  { id: 'leads', label: 'Better Leads' },
  { id: 'sales', label: 'More Sales' },
]

// ---------------------------------------------------------------------------
// TEAM LAYOUTS — what goes where in the LEFT column
// ---------------------------------------------------------------------------

export interface TeamLayoutRow {
  // Single role across the row (used for hero layers like Regionals → Team Leads → Reps)
  type: 'hero'
  roleId: string
}

export interface TeamLayoutGroup {
  // Side-by-side support roles in a labeled group
  type: 'group'
  label: string
  roleIds: string[]
}

export type TeamLayoutItem = TeamLayoutRow | TeamLayoutGroup

export const TEAM_LAYOUTS: Record<DivisionId, TeamLayoutItem[]> = {
  homeServices: [
    { type: 'hero', roleId: 'hs_regional' },
    { type: 'hero', roleId: 'hs_team_lead' },
    { type: 'hero', roleId: 'hs_sales' },
    {
      type: 'group',
      label: 'Install Operations',
      roleIds: ['hs_install', 'hs_os_install', 'hs_supplement'],
    },
    {
      type: 'group',
      label: 'Customer Support',
      roleIds: ['hs_csva', 'hs_atr'],
    },
  ],
  realEstate: [
    {
      type: 'group',
      label: 'Sales Leads',
      roleIds: ['re_team1_lead', 're_team2_lead', 're_cold_lead'],
    },
    {
      type: 'group',
      label: 'Sales Reps · 3 teams of 6',
      roleIds: ['re_team1_reps', 're_team2_reps', 're_cold_reps'],
    },
    {
      type: 'group',
      label: 'Deal Operations',
      roleIds: ['re_underwriters', 're_dispo'],
    },
  ],
  aerialInsights: [
    {
      type: 'group',
      label: 'Sales Leads',
      roleIds: ['ai_team1_lead', 'ai_team2_lead', 'ai_cold_lead'],
    },
    {
      type: 'group',
      label: 'Sales Reps · 12 closers',
      roleIds: ['ai_team1_reps', 'ai_team2_reps', 'ai_cold_reps'],
    },
    {
      type: 'group',
      label: 'Customer Success',
      roleIds: ['ai_csva'],
    },
    {
      type: 'group',
      label: 'Engineering + Data',
      roleIds: ['ai_lead_dev', 'ai_developer', 'ai_annotation'],
    },
  ],
}

// ---------------------------------------------------------------------------

export const OPERATING_STRUCTURE_PAGE = {
  headline: 'Operating Structure',
  subtitle:
    'A scalable, automated revenue machine — three engines, one operating system.',
  closingSummary:
    'Field execution through Home Services, deal flow through Real Estate, and software-led intelligence through Aerial Insights — coordinated by a central trust with isolated liability and aligned technology.',
}

export function getRole(id: string): RoleDetail | undefined {
  return ROLES[id]
}

export function getConfirmedTotal(): number {
  return DIVISION_ORDER.reduce((sum, id) => sum + DIVISIONS[id].total, 0)
}

export function getFlexTotal(): number {
  return DIVISION_ORDER.reduce(
    (sum, id) => sum + DIVISIONS[id].total + (DIVISIONS[id].flexSeats ?? 0),
    0,
  )
}
