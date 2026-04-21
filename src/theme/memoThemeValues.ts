// The investor memo uses the same light green theme as the main proposal.
// No overrides are applied — the memo inherits `THEME_VARS` from themeValues.ts.
// This file is retained as a named alias so future memo-specific theme tweaks
// (e.g. print-only adjustments) can be added without touching the layout import path.

export { applyThemeToDOM as applyMemoThemeToDOM, applyThemeToDOM as restoreDefaultTheme } from './themeValues'
