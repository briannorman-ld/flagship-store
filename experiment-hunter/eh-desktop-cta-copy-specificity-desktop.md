# A/B Test Plan - briannorman-ld.github.io/flagship-store/cart empty cart CTA copy

**Flag key:** `eh-desktop-cta-copy-specificity-desktop`  
**Experiment key:** `eh-desktop-cta-copy-specificity-desktop-exp`

## Hypothesis

If the primary button names a concrete next step with category-led shopping language, then flagship-store-plp-view will increase with higher downstream flagship-store-add-to-cart, because specific action language reduces hesitation and clarifies the destination.

## Arms

- **Control:** The current copy reads "The main button says Continue Shopping.".
- **Treatment:** Change the copy from "The main button says Continue Shopping." to "Shop Best-Selling Flags".

## Metrics

- **Primary:** flagship-store-plp-view — flagship-store-plp-view (LD metric key: `flagship-store-pdp-view`)
- **Secondaries (LD keys):** `flagship-store-add-to-cart`, `flagship-store-order-confirmation`

## Next steps

1. Review the generated code in this branch and the draft experiment in LaunchDarkly.
2. Start the experiment iteration in LaunchDarkly when the implementation is ready.

## Saved test plan

This run used the test plan saved in Experiment Hunter. Edit that plan before **Test Idea** to change hypothesis, metrics wording, arms, or implementation notes.

### Hypothesis

If the primary button names a concrete next step with category-led shopping language, then flagship-store-plp-view will increase with higher downstream flagship-store-add-to-cart, because specific action language reduces hesitation and clarifies the destination.

### Problem

The current Continue Shopping CTA is vague and does not reinforce what products or next step are available.

### Control (plan)

The current copy reads "The main button says Continue Shopping.".

### Treatment (plan)

Change the copy from "The main button says Continue Shopping." to "Shop Best-Selling Flags".

### What is changing

Only the copy changes.

### Audience (included)

Desktop viewport only for this test.
Desktop visitors who reach the empty cart page.

### Primary metric (wording)

flagship-store-plp-view — flagship-store-plp-view

### Secondary metrics (wording)

flagship-store-add-to-cart: Monitor downstream add-to-cart behavior after visitors re-enter shopping from the empty cart page.
flagship-store-cart-view: Monitor follow-on cart view behavior as an additional indicator of recovery flow engagement.
empty_cart_continue_shopping_click: Track clicks on the primary empty-cart CTA to measure direct interaction with the tested element.

### Guardrails

Suggested supporting event instrumentation is provided in the brief; confirm availability in the analytics stack.
Measure whether empty-cart visitors click through into product listing page discovery at a higher rate from the tested CTA copy.

### Implementation notes

Final approved variant CTA string is TBD.

Confirm whether the CTA destination remains the same as the current button destination.

Ensure desktop-only targeting for this experiment.

Confirm whether analytics events already exist for empty-cart CTA interactions.

Dev specs:
Implement a copy-only CTA text change on the desktop empty cart page without altering page structure unless required for deployment. Preserve existing tracking and destination behavior unless otherwise approved.

Dev / LOE:
Low effort based on the experiment brief.

Targeting:
Show only to desktop users on the empty cart page. Exclude tablet and mobile from this experiment scope.

Tracking:
Primary suggested event: empty_cart_continue_shopping_click. Relevant existing or suggested contextual events include empty_cart_category_link_click, empty_cart_search_submit, and promo_banner_interaction for diagnostic analysis, though only the primary CTA event is directly tied to this copy test.

Audience URL targeting:
Target the empty cart URL: https://briannorman-ld.github.io/flagship-store/cart

### Risks

- Exact variant copy has not been finalized, so implementation cannot proceed until approved wording is provided.
- If the CTA destination changes along with the copy, results may reflect both message and destination effects rather than copy alone.
- Because navigation and search are also available on desktop, visitors may continue to recover through other paths that dilute CTA impact.
- Promo banner messaging may influence behavior independently of the CTA copy.
