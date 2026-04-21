# Best Sellers ATC Visibility Experiment

This module implements an A/B test for the flagship-store homepage to evaluate the impact of making 'Add to Cart' buttons always visible on Best Seller cards for desktop users.

## Implementation Details

- **Flag Key**: `eh-d-best-sellers-atc-visible-desktop`
- **Control (A)**: 'Add to Cart' button is hidden until hover (opacity 0).
- **Variant (B)**: 'Add to Cart' button is visible by default with clear hierarchy.

## Usage

Import `BestSellersATCTest` into your homepage component and ensure LaunchDarkly is properly configured in your application.

```jsx
import BestSellersATCTest from './experiment-hunter/BestSellersATCTest';

const HomePage = () => (
  <div>
    <BestSellersATCTest />
    {/* Other homepage components */}
  </div>
);
```

## Notes

- Ensure this test runs only on desktop viewports.
- The primary metric is `best_seller_add_to_cart_click` to track engagement.
