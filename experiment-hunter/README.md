# Experiment Hunter

This directory contains experiments implemented using LaunchDarkly for feature flagging.

## Sticky Buy Box Experiment

### Overview

The `StickyBuyBoxExperiment` component determines the visibility and behavior of the buy box on the desktop product detail page. It uses the LaunchDarkly flag `eh-desktop-sticky-buy-box-desktop` to toggle between the control and variant experiences.

### Implementation

- **Control**: The buy box is only visible at the top of the page.
- **Variant**: A compact sticky buy box remains visible while scrolling through product details.

### Usage

Import and use the `StickyBuyBoxExperiment` component in the product detail page to enable the experiment.

```jsx
import StickyBuyBoxExperiment from './experiment-hunter/StickyBuyBoxExperiment';

const ProductDetailPage = () => (
  <div>
    {/* Other components */}
    <StickyBuyBoxExperiment />
    {/* Other components */}
  </div>
);
```
