# Best Sellers ATC Experiment

This module implements the A/B test for the Best Sellers 'Add to Cart' button visibility on the flagship-store homepage for desktop users.

## Experiment Details
- **Flag Key**: `eh-d-best-sellers-atc-visible-desktop`
- **Control**: 'Add to Cart' button is hidden until hover.
- **Variant**: 'Add to Cart' button is always visible.

## Usage
Wrap the Best Sellers component with `BestSellersATCExperiment` to apply the experiment logic based on the LaunchDarkly flag.

```jsx
import BestSellersATCExperiment from './BestSellersATCExperiment';

const BestSellersSection = () => (
  <BestSellersATCExperiment>
    {/* Best Sellers cards here */}
  </BestSellersATCExperiment>
);
```

## Notes
- Ensure the experiment is only applied to desktop viewports.
- Maintain existing hover styles for the 'Add to Cart' button.
