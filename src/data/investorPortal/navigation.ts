// Top navigation structure — single source of truth for desktop dropdowns
// and mobile accordion menu.

export interface NavLeaf {
  label: string
  path: string
}

export interface NavGroup {
  label: string
  items: NavLeaf[]
}

export type NavEntry = NavLeaf | NavGroup

export const isNavGroup = (entry: NavEntry): entry is NavGroup =>
  (entry as NavGroup).items !== undefined

export const NAV_GROUPS: NavEntry[] = [
  { label: 'Overview', path: '/' },
  {
    label: 'Operations',
    items: [
      { label: 'Operating Structure', path: '/operating-structure' },
      { label: 'Strategic Impact', path: '/strategic-impact' },
    ],
  },
  {
    label: 'Divisions',
    items: [
      { label: 'Home Services', path: '/home-services' },
      { label: 'Real Estate', path: '/solar-real-estate' },
      { label: 'Aerial Insights', path: '/aerial-insights' },
    ],
  },
  {
    label: 'Financials',
    items: [
      { label: 'Financial Model', path: '/financial-model' },
      { label: 'Assumptions Lab', path: '/assumptions-lab' },
    ],
  },
  { label: 'Qualifications', path: '/qualifications' },
]
