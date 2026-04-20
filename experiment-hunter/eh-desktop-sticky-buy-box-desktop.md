# Sticky buy box while scrolling product details

**Flag key:** `eh-desktop-sticky-buy-box-desktop`  
**Experiment key:** `eh-desktop-sticky-buy-box-desktop-exp`

## Hypothesis

If [the buy box remains sticky beside details on desktop], then [flagship-store-add-to-cart and flagship-store-cart-view increase], because [purchase controls stay visible during evaluation and reduce return scrolling].

## Arms

- **Control:** The desktop PDP shows the purchase module only at the top of the page. Scrolling to tabs or related products moves the CTA out of view.
- **Treatment:** The desktop PDP keeps a compact sticky buy box visible in the right column while the shopper scrolls through tabs and recommendations.

## Metrics

- **Primary:** flagship-store-add-to-cart (LD metric key: `flagship-store-pdp-view`)


## Next steps

1. Review the generated code in this branch and the draft experiment in LaunchDarkly.
2. Start the experiment iteration in LaunchDarkly when the implementation is ready.

