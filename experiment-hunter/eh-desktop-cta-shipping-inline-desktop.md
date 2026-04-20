# Bring shipping threshold context into the main CTA area

**Flag key:** `eh-desktop-cta-shipping-inline-desktop`  
**Experiment key:** `eh-desktop-cta-shipping-inline-desktop-exp`

## Hypothesis

If [the CTA area includes shipping and promo savings context inline], then [flagship-store-add-to-cart increases for PDP visitors], because [value perception strengthens at the exact decision moment].

## Arms

- **Control:** Shipping and return benefits are listed below the Add to Cart and Wishlist buttons.
- **Treatment:** A short line above or inside the CTA region highlights free shipping threshold and available promo savings before the click.

## Metrics

- **Primary:** flagship-store-add-to-cart (LD metric key: `flagship-store-pdp-view`)


## Next steps

1. Review the generated code in this branch and the draft experiment in LaunchDarkly.
2. Start the experiment iteration in LaunchDarkly when the implementation is ready.
