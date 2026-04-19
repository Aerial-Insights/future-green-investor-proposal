# Investor Portal — Implementation Plan

## Project Goal
Build a premium, black luxury-style interactive investor presentation portal for a $40M capital raise across an integrated platform spanning Home Services, Solar and Real Estate, and Aerial Insights.

## Core Product Thesis
A vertically integrated platform where Aerial Insights drives lead intelligence, Home Services generates immediate cash flow, Solar expands recurring energy revenue, and Real Estate converts opportunities into long-term appreciating assets — each division reinforcing the others operationally and financially.

## Audience
- Institutional investors
- Family offices
- Private capital partners
- Strategic investors
- High-net-worth decision-makers

## Design Direction
Premium dark luxury system:
- Matte black backgrounds (#0a0a0a)
- Dark graphite elevated surfaces (#141414)
- White and warm-gray typography
- Accent palette: muted gold (#c9a84c), deep green (#2d6a4f), platinum (#d4d4d8)
- Generous spacing, subtle shadows, restrained animation
- Institutional polish — not startup gimmicks

## Full Site Map

### Pages & Tab Structure

| # | Page | Route | Internal Tabs |
|---|------|-------|---------------|
| 1 | Overview | `/` | — |
| 2 | Home Services | `/home-services` | Overview, Services, Sales Engine, Unit Economics, Grant Integration, Operations, Projections |
| 3 | Solar & Real Estate | `/solar-real-estate` | Overview, Solar Installs, Solar Farms, Land Acquisition, Housing Development, Subdivision, Revenue Model, Projections |
| 4 | Aerial Insights | `/aerial-insights` | Overview, Platform Workflow, Revenue Model, Accuracy & Data Flywheel, Strategic Value, Expansion, Projections |
| 5 | Financial Model | `/financial-model` | Overview, Revenue, Profitability, Capital Deployment, Division Breakdown, Return Timeline, Assumption Notes |
| 6 | Assumptions Lab | `/assumptions-lab` | — (split panel layout) |
| 7 | Strategic Impact | `/strategic-impact` | — |
| 8 | Next Step | `/next-step` | — |

## Data & Calculation Requirements

### Financial Logic Files
- `baseAssumptions.ts` — All ~80 typed input defaults
- `scenarioPresets.ts` — Conservative, Base Case, Growth Case, Aggressive Scale
- `formulas/homeServices.ts` — Sales funnel, revenue by service, margins, grants
- `formulas/solarOperations.ts` — Install volume, revenue, margins
- `formulas/landAcquisition.ts` — Outreach funnel, economics, deal allocation, wholesale
- `formulas/solarFarms.ts` — Acreage-to-MW, revenue, SREC, activation lag
- `formulas/housingDev.ts` — Units, rent, stabilization, cap rate valuation
- `formulas/subdivision.ts` — Lot split, uplift, resale
- `formulas/aerialInsights.ts` — User growth, MRR, lead revenue, add-ons
- `formulas/portfolio.ts` — Consolidated revenue, profitability, capital deployment, return timeline
- `chartBuilders/` — Transform formula outputs into chart-ready data
- `explanations.ts` — 40+ metric explanation entries
- `content.ts` — All static section copy

### Key Calculation Domains
1. **Home Services**: reps × doors/day × days × close rate = deals → revenue by service × margins
2. **Solar Operations**: lead flow × conversion → install revenue by type × margins
3. **Land Acquisition**: mail volume × response × qualification × close = acquisitions → deal allocation
4. **Solar Farms**: acreage → MW → energy sales + SRECs (with activation lag)
5. **Housing**: units × build cost, rent, stabilization, cap rate valuation
6. **Aerial Insights**: user growth → MRR (subscriptions + leads + add-ons)
7. **Portfolio**: consolidated revenue, profitability, capital deployment, return timeline

## Assumptions Lab Requirements

### Layout
- Left panel: grouped controls with sliders, number inputs, toggles
- Right panel: live KPI cards + updating charts + scenario comparison

### Control Groups
1. Sales Inputs (reps, doors/day, working days, close rate, upsell rate)
2. Service Economics (revenue per job by service, gross margins, subcontractor costs)
3. Real Estate Acquisition (mail volume, response rate, qualification rate, close rate, parcel size, discount, allocation splits)
4. Solar Inputs (conversion rate, contract values, build cost/MW, acres/MW, SREC value, MWh/MW)
5. Housing Inputs (units/project, build cost/unit, rent/unit, stabilization lag, cap rate)
6. Aerial Insights (users, subscription pricing, enterprise accounts, lead pricing, add-on attach rate, CAC)
7. Capital Deployment (allocation %, marketing spend, ops spend, tech investment)

### Preset Scenarios
- Conservative, Base Case, Growth Case, Aggressive Scale

### Live Outputs
- Annual revenue, profit, EBITDA trajectory, division mix, cumulative assets, payback timing, scenario comparison cards

## Explanation System Requirements
Every major metric gets an explanation entry with:
- Metric name and plain-English definition
- Why it matters
- Main input drivers
- Formula logic in plain English
- Scenario context (values across presets)
- Notes or caveats

Delivery methods: tooltips, info icon → drawer, modal overlay, inline accordion

## Chart Requirements
- Line charts (growth over time)
- Stacked bars (division contribution)
- Area charts (cumulative growth)
- Donut/radial (capital allocation, revenue mix)
- KPI summary cards (with delta indicators)
- Funnel diagrams (sales, acquisition)
- Flywheel diagram (Aerial Insights data loop)
- Timeline visuals (return timing, development phases)
- Allocation visuals (deal routing, capital deployment)

All charts: dark-theme optimized, smooth animations on load and data change, info icons

## Milestone-by-Milestone Build Plan

### M1 — Read specs + create this plan file ✓
### M2 — Project initialization (Vite + React + TypeScript + all deps + config)
### M3 — Route structure, layout shell, TopNav, dark theme, StickyTabNav
### M4 — Financial data layer (assumptions, presets, all formulas, explanations, content, Zustand stores, hooks, utils)
### M5 — Overview page (hero, metric strip, platform architecture, why-this-wins, capital deployment, preview cards)
### M6 — Home Services page (7 tabs: overview, services, sales engine, unit economics, grant integration, operations, projections)
### M7 — Solar & Real Estate page (8 tabs: overview, solar installs, solar farms, land acquisition, housing dev, subdivision, revenue model, projections)
### M8 — Aerial Insights page (7 tabs: overview, platform workflow, revenue model, accuracy/flywheel, strategic value, expansion, projections)
### M9 — Financial Model page (7 tabs + division filter: overview, revenue, profitability, capital deployment, division breakdown, return timeline, assumption notes)
### M10 — Assumptions Lab (split panel, 7 control groups, 4 presets, live KPIs + charts)
### M11 — Strategic Impact + Next Step pages
### M12 — Explanation system integration across all pages
### M13 — Visual polish (animations, spacing, hover states, responsive, typography)
### M14 — Full QA pass (routes, tabs, calculations, charts, assumptions persistence, dark theme, responsiveness, no placeholders)
### M15 — Final summary of deliverables

## QA Checklist
- [ ] Every page loads without errors
- [ ] Every tab on every page renders real content
- [ ] Every formula produces reasonable numbers for all 4 scenarios
- [ ] Every chart updates when assumptions change
- [ ] Assumptions persist across page navigation
- [ ] Explanation system works for all major metrics
- [ ] No placeholder content remains
- [ ] No console errors
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Dark theme consistent everywhere
- [ ] Premium feel maintained throughout

## Final Acceptance Standard
The finished portal must feel like:
- A luxury digital investor briefing portal
- A live model-driven capital presentation
- A visually rich and interactive deal room
- A production-grade experience that impresses serious investors without a presenter
