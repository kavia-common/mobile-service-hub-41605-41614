# UI refinements: Spare Parts, Accessories, Brand Selection

This document captures the UI intent implemented in the codebase for:
- Spare Parts & Accessories cards (Home)
- Brand selection cards (Home + item pages)

Note: The orchestrator-provided attachment path was not present in the workspace during implementation, so the following describes the applied refinements based on the task summary.

## Implemented refinements

### Spare Parts & Accessories (Home)
- Clear section heading and helper copy.
- Uniform modern item cards:
  - Left icon “badge”
  - Label
  - Right arrow indicator
  - Hover lift + subtle highlight
  - Responsive 4/3/2 column grid

### Brand selection (Home + item page)
- Consistent “brand big cards”:
  - Brand logo/initial
  - Brand name row with right-arrow
  - Helper text line under the name
  - Secondary action button (e.g., “Browse”, “View”) that does not interfere with the main click area
- Navigation:
  - Clicking card navigates to `/services?brand=<brand>`
  - Selection is persisted via `persistSelectedBrand()` so Booking can default the same brand

## Files touched
- `src/components/BrandCard.js`
- `src/pages/Home.js`
- `src/pages/SpareAccessoryItem.js`
- `src/App.css`
