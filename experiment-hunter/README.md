# CTA Experiment

This module implements an A/B test for the CTA button on the empty cart page using LaunchDarkly.

## Experiment Details
- **Flag Key**: eh-desktop-cta-copy-specificity-desktop
- **Control**: Button text is 'Continue Shopping'.
- **Variant**: Button text is 'Shop Best-Selling Flags'.

## Audience
- Desktop users only.
- Target URL: `https://briannorman-ld.github.io/flagship-store/cart`

## Metrics
- **Primary**: `flagship-store-plp-view`
- **Secondary**: `flagship-store-add-to-cart`, `flagship-store-cart-view`, `empty_cart_continue_shopping_click`

## Implementation Notes
- Ensure the CTA destination remains unchanged unless otherwise specified.
- Verify existing analytics events for CTA interactions.
