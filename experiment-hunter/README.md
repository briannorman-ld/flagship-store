# Best Sellers ATC Experiment

This module implements the A/B test for the visibility of the 'Add to Cart' button on Best Seller cards on the flagship-store homepage for desktop users.

## Experiment Details
- **Flag Key**: `eh-d-best-sellers-atc-visible-desktop`
- **Control**: Button is hidden until hover.
- **Variant**: Button is always visible.

## Usage
Import the `BestSellersATCExperiment` component and include it in the homepage where the Best Sellers section is rendered.

## LaunchDarkly Setup
Ensure that the LaunchDarkly client is properly configured and the flag `eh-d-best-sellers-atc-visible-desktop` is created and managed in the LaunchDarkly dashboard.
