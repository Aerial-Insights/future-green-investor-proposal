You are now operating as the lead engineer, product architect, data visualization designer, and premium UX builder for a high-stakes interactive investor presentation portal. This is a production-grade build, not a prototype, not a mockup, and not a generic landing page. Your job is to take the existing codebase and implement a complete luxury investor portal exactly according to the master logic file in the codebase. Treat that logic file as the primary source of truth for architecture, feature scope, calculations, interaction behavior, content structure, and implementation standards.

MISSION

Build a premium black luxury-style interactive investor presentation portal for a high-level capital raise. The experience must feel like a private capital briefing environment, a digital investment memorandum, and a live scenario model combined into one polished interface. The portal must be visually striking, highly professional, deeply informative, easy to navigate, and able to stand on its own without a presenter.

This is not a simple website. It must function as:

1. an executive-level investment presentation
2. a section-by-section deep dive into each business division
3. a live financial model with adjustable assumptions
4. an explainer environment where every important number can be understood

GLOBAL BUILD RULES

1. Read and follow the main logic file in full before changing anything.
2. Create a new plan file in the logic folder before implementation begins.
3. The new plan file must restate the build scope in milestone form so it can be referenced throughout development.
4. Do not skip steps.
5. Do not leave placeholder logic where real logic can be implemented.
6. Do not hardcode final financial outputs into UI components.
7. All major calculations must come from a structured financial logic layer.
8. Preserve clean architecture and production-grade code quality throughout.
9. Keep the experience premium, elegant, smooth, and investor-grade.
10. At the end, run a full QA pass and resolve all issues found.

FIRST ACTION REQUIRED

Before making implementation changes, create a new file in the logic folder named something like:

logic/investor-portal-implementation-plan.md

This file must include:

* project goal
* core product thesis
* audience
* design direction
* full site map
* section list
* tab structure per section
* data and calculation requirements
* assumptions lab requirements
* explanation system requirements
* chart requirements
* milestone-by-milestone build plan
* QA checklist
* final acceptance standard

This file is mandatory and must be completed first.

MASTER OBJECTIVE

Build the investor portal defined in the main logic file with the following major sections:

* Overview
* Home Services
* Solar and Real Estate
* Aerial Insights
* Financial Model
* Assumptions Lab
* Strategic Impact
* Next Step

Every section must feel polished, substantial, and presentation-ready.

EXPERIENCE STANDARD

The portal must feel:

* luxurious
* black and premium
* cinematic but restrained
* highly visual
* numerically serious
* easy to navigate
* layered so users are never overwhelmed
* dynamic and interactive where it matters
* impressive to high-level investors

VISUAL DESIGN DIRECTION

Use a premium dark design system:

* matte black or near-black background
* dark graphite panel surfaces
* white and warm-gray typography
* subtle accent tones such as muted gold, deep green, platinum, or controlled luminous white
* generous spacing
* elevated cards
* smooth motion
* elegant hover states
* minimal clutter
* institutional polish, not startup gimmicks

Use visuals heavily, but intelligently:

* hero visuals
* refined section banners
* premium photography or cinematic business imagery
* diagrams
* timelines
* charts
* metric cards
* structured content blocks
* subtle transitions

The portal must be exciting and alive, but never messy or flashy.

INFORMATION ARCHITECTURE REQUIREMENTS

The entire experience must follow layered information architecture:

Layer 1
Executive summary and thesis

Layer 2
Division-level overview pages

Layer 3
Detailed internal tabs per division

Layer 4
Financial projections and charts

Layer 5
Assumption definitions, formulas, notes, and explanatory modals

Users must be able to scan quickly, then drill down deeper.

SECTION REQUIREMENTS

1. OVERVIEW PAGE

Build a powerful hero experience with:

* title
* one-sentence thesis
* capital raise summary
* geography
* return window
* intro copy
* strong CTA buttons such as Explore the Platform, View Financial Model, and Adjust Assumptions

Include:

* executive summary metric strip
* platform architecture visual showing how divisions reinforce one another
* why-this-wins section
* high-level capital deployment visual
* section preview cards

2. HOME SERVICES PAGE

This must present the immediate cash flow engine.

Add internal sticky tabs:

* Overview
* Services
* Sales Engine
* Unit Economics
* Grant Integration
* Operations
* Projections

Must include:

* service cards for roofing, insulation, air sealing, HVAC, and water heater
* rep growth visuals
* funnel visuals
* job economics
* margin logic
* grant-backed adoption explanation
* subcontractor execution model
* projections charts

3. SOLAR AND REAL ESTATE PAGE

This must present the long-term asset and appreciation engine.

Add internal sticky tabs:

* Overview
* Solar Installs
* Solar Farms
* Land Acquisition
* Housing Development
* Subdivision
* Revenue Model
* Projections

Must include:

* operating solar revenue section
* land acquisition funnel
* solar farm economics
* acreage and MW explanations
* housing economics
* subdivision logic
* pathway allocation visuals
* long-term revenue activation charts

4. AERIAL INSIGHTS PAGE

This must present the intelligence layer and long-term moat.

Add internal sticky tabs:

* Overview
* Platform Workflow
* Revenue Model
* Accuracy and Data Flywheel
* Strategic Value
* Expansion
* Projections

Must include:

* map intelligence explanation
* AI workflow visuals
* SaaS monetization
* lead monetization
* internal division value explanation
* flywheel diagram
* growth visuals

5. FINANCIAL MODEL PAGE

This must feel like a premium investor analytics center.

Add internal tabs:

* Overview
* Revenue
* Profitability
* Capital Deployment
* Division Breakdown
* Return Timeline
* Assumption Notes

Must include:

* annual revenue charts
* monthly charts where supported
* profitability charts
* stacked division visuals
* revenue mix visuals
* return-timing visual
* ability to filter by division
* soft animations on update

6. ASSUMPTIONS LAB PAGE

This is a core feature and must be implemented seriously.

Layout:

* left side controls
* right side outputs and live charts

Include grouped controls for:

* Sales Inputs
* Service Economics Inputs
* Real Estate Acquisition Inputs
* Solar Inputs
* Housing Inputs
* Aerial Insights Inputs
* Capital Deployment Inputs

Include preset scenario buttons:

* Conservative
* Base Case
* Growth Case
* Aggressive Scale

Changing inputs must update:

* revenue outputs
* profit outputs
* charts
* KPI cards
* mix summaries
* scenario comparison cards

7. STRATEGIC IMPACT PAGE

Include:

* jobs created
* energy impact
* housing impact
* minority inclusion
* regional economic development
* technology advantage
* platform defensibility

8. NEXT STEP PAGE

Include:

* final summary
* capital ask framing
* closing narrative
* contact or next-step CTA area
* polished final impression

CALCULATION REQUIREMENTS

Create a structured financial logic layer and connect it to the UI.

Do not bury formulas inside visual components.

Create dedicated financial logic files for:

* base assumptions
* scenario presets
* formulas
* chart builders
* explanation content
* static section content

Expected architecture should resemble:

* src/data/investorPortal/baseAssumptions.ts
* src/data/investorPortal/scenarioPresets.ts
* src/data/investorPortal/formulas.ts
* src/data/investorPortal/chartBuilders.ts
* src/data/investorPortal/explanations.ts
* src/data/investorPortal/content.ts

Implement all major logic from the main logic file, including:

HOME SERVICES LOGIC

* rep count
* doors per rep per day
* days worked
* conversion logic
* deal flow
* revenue by service line
* upsell logic
* margin logic
* grant-related explanation logic

SOLAR OPERATIONS LOGIC

* install volume
* revenue by install type
* margin structure
* operating solar contribution

LAND AND REAL ESTATE LOGIC

* mail volume
* response rate
* lead qualification rate
* close rate
* acquisitions
* parcel economics
* purchase discount logic
* deal routing by pathway
* wholesale revenue
* solar farm activation logic
* housing development logic
* subdivision value logic

AERIAL INSIGHTS LOGIC

* user growth
* subscription revenue
* lead sales revenue
* add-on revenue
* total MRR and ARR
* key performance metrics

PORTFOLIO-LEVEL LOGIC

* total revenue
* division mix
* profitability
* capital deployment
* return timing
* scenario comparisons

SPREADSHEET INTEGRATION REQUIREMENTS

Use the spreadsheet assumptions and logic from the provided materials as the basis for the financial data layer. Normalize and structure the calculations so they can power live outputs, charts, and scenario changes cleanly.

Every major output shown on screen must be traceable back to:

* an input assumption
* a formula
* an explanation entry

EXPLANATION SYSTEM REQUIREMENTS

Every meaningful number must have an accessible explanation system.

Implement:

* tooltip support where appropriate
* info icons
* click-to-open drawers or modals
* expandable explanation sections where useful

Each explanation must include:

* what the metric means
* why it matters
* what drives it
* plain-English formula logic
* scenario context
* notes or caveats when relevant

Examples include:

* rep count
* close rate
* grant eligibility
* revenue per acre
* SREC value
* build cost per unit
* MRR
* EBITDA
* stabilized units
* active acres

VISUALIZATION REQUIREMENTS

Use premium charting and visual storytelling throughout.

Required chart types include:

* line charts
* stacked bars
* area charts
* donut or radial charts
* KPI summary cards
* timeline visuals
* funnel visuals
* flywheel diagrams
* allocation visuals
* section comparison cards

Charts must:

* load smoothly
* update smoothly
* remain readable on dark backgrounds
* look high-end and presentation-ready
* support scenario changes without visual breakage

COMPONENT REQUIREMENTS

Build reusable components for:

* hero sections
* section banners
* metric cards
* chart cards
* sticky tab navigation
* assumptions control panels
* explanation drawers
* modals
* accordions
* timeline blocks
* image-text split sections
* architecture diagrams
* scenario cards

TECHNICAL REQUIREMENTS

* Keep the codebase clean and modular
* Use production-grade component organization
* Separate data, calculation logic, content, and UI concerns
* Make it responsive
* Preserve performance despite visual richness
* Lazy load heavy media if necessary
* Keep interactivity smooth
* Avoid unnecessary re-renders where possible
* Maintain readable, maintainable code

MILESTONE EXECUTION PLAN

You must execute this build in milestone order and update the implementation plan file as you go.

Milestone 1
Read the main logic file fully and create the logic-folder implementation plan file.

Milestone 2
Audit the current codebase structure and identify exactly where the investor portal should live.

Milestone 3
Set up the route structure, page shell, top navigation, dark theme foundation, and shared layout system.

Milestone 4
Build the financial data layer:

* assumptions
* scenarios
* formulas
* chart builders
* explanations
* content

Milestone 5
Build the Overview page and platform architecture sections.

Milestone 6
Build the Home Services page with all tabs, visuals, and calculations.

Milestone 7
Build the Solar and Real Estate page with all tabs, visuals, and calculations.

Milestone 8
Build the Aerial Insights page with all tabs, visuals, and calculations.

Milestone 9
Build the Financial Model page with filtering and polished charts.

Milestone 10
Build the Assumptions Lab with live-updating controls and outputs.

Milestone 11
Build the Strategic Impact and Next Step pages.

Milestone 12
Implement the explanation system across all major metrics.

Milestone 13
Apply final visual polish, animation tuning, spacing refinement, and luxury UI consistency pass.

Milestone 14
Run a full QA pass:

* verify calculations
* verify chart updates
* verify nav and tabs
* verify responsive behavior
* verify no broken routes
* verify dark theme consistency
* verify explanation links work
* verify no placeholder content remains

Milestone 15
Produce a final summary of what was built, what files were created or updated, and any important implementation notes.

QA STANDARD

Before finishing, verify:

* every major section exists
* every required tab exists
* every required calculation is wired
* assumptions lab updates outputs live
* charts are polished and readable
* explanation system is present across major metrics
* the portal feels premium and complete
* the experience can stand on its own for investors
* there are no half-finished sections
* there are no broken components
* there are no obvious visual inconsistencies

FINAL ACCEPTANCE STANDARD

The finished product must feel like:

* a luxury digital investor briefing portal
* a live model-driven capital presentation
* a visually rich and interactive deal room
* a production-grade experience that can impress serious investors without requiring a presenter

Begin now by reading the main logic file and creating the logic-folder implementation plan file first. Then execute the milestones in order until the entire portal is fully built, polished, and QA’d.
