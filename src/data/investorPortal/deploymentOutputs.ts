// ─── DEPLOYMENT OUTPUT CONFIGURATION ────────────────────────────────────────
// Maps budget line items to their "What This Buys" output cards.
// Keyed by BudgetCategory.key → BudgetLineItem.label → output definitions.

export interface DeploymentOutput {
  unitCostLabel: string
  unitCost: number
  outputLabel: string
  helperText?: string
  allocationOverride?: number
}

export const DEPLOYMENT_OUTPUTS: Record<string, Record<string, DeploymentOutput[]>> = {
  marketing: {
    'Solar Customer Acquisition': [
      {
        unitCostLabel: 'Average CPL',
        unitCost: 200,
        outputLabel: 'Solar Leads Generated',
      },
    ],
    'PPC (High Intent Only)': [
      {
        unitCostLabel: 'Average CPL',
        unitCost: 120,
        outputLabel: 'High-Intent Grant Leads',
      },
    ],
    'Direct Mail Campaigns (Land Acquisition)': [
      {
        unitCostLabel: 'Average Cost Per Lead',
        unitCost: 200,
        outputLabel: 'Roofing Leads Generated',
        helperText: 'Direct mail roofing lead acquisition',
      },
    ],
    'Commercial Campaigns': [
      {
        unitCostLabel: 'Average Cost Per Lead',
        unitCost: 550,
        outputLabel: 'Commercial Leads Generated',
      },
    ],
    'Retargeting Campaigns': [
      {
        unitCostLabel: 'Average Cost Per Lead',
        unitCost: 50,
        outputLabel: 'Retargeted Leads Recaptured',
      },
    ],
  },

  aerialInsights: {
    'PPC Marketing (Avg. CAC $150)': [
      {
        unitCostLabel: 'Average CAC',
        unitCost: 150,
        outputLabel: 'New User Accounts Acquired',
      },
    ],
    'Data Acquisition (Imagery, APIs)': [
      {
        unitCostLabel: 'Cost Per Data Point',
        unitCost: 0.15,
        outputLabel: 'Leads / Data Records Acquired',
        helperText: 'Expands fast-access property intelligence',
      },
    ],
    'Convention & Influencer Interactions': [
      {
        unitCostLabel: 'Cost Per Convention',
        unitCost: 25000,
        outputLabel: 'Conventions Supported',
        helperText: 'Full booth + team deployments',
      },
    ],
    'AI Detection & Model Accuracy': [
      {
        unitCostLabel: 'Cost Per Annotation',
        unitCost: 2,
        outputLabel: 'New Annotations Generated',
        allocationOverride: 100000,
      },
      {
        unitCostLabel: 'Cost Per Product Image',
        unitCost: 0.50,
        outputLabel: 'Product Images Added to Knowledge Base',
        helperText: 'Knowledge-base expansion for faster analysis',
        allocationOverride: 100000,
      },
    ],
  },

  wholesalePipeline: {
    'Direct Mail Campaigns': [
      {
        unitCostLabel: 'Cost Per Land Deal',
        unitCost: 1200,
        outputLabel: 'Land Deal Conversions',
        helperText: 'Estimated land deals acquired from direct mail',
      },
    ],
    'Paid Leads Campaigns': [
      {
        unitCostLabel: 'Cost Per Paid Lead',
        unitCost: 300,
        outputLabel: 'Paid Leads Generated',
      },
    ],
  },

  lowIncomeHousing: {
    'Construction (Standardized Builds)': [
      {
        unitCostLabel: 'Cost Per Property Constructed',
        unitCost: 200000,
        outputLabel: 'Homes Constructed',
        helperText: 'Estimated homes from allocated capital',
      },
    ],
    'Land Acquisition': [
      {
        unitCostLabel: 'Cost Per Land Acquisition',
        unitCost: 150000,
        outputLabel: 'Parcels / Sites Acquired',
      },
    ],
  },
}
