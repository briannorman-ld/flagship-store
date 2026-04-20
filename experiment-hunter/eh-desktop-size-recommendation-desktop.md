# Recommend the most common size in the selector

**Flag key:** `eh-desktop-size-recommendation-desktop`  
**Experiment key:** `eh-desktop-size-recommendation-desktop-exp`

## Hypothesis

If [one size is labeled Most Popular and preselected], then [flagship-store-add-to-cart rises and option abandonment falls], because [a default anchor speeds decisions for undecided shoppers].

## Arms

- **Control:** All sizes appear equally weighted and none is explicitly recommended.
- **Treatment:** A commonly purchased size is preselected and marked Most Popular within the size selector.

## Metrics

- **Primary:** flagship-store-add-to-cart (LD metric key: `flagship-store-pdp-view`)


## Next steps

1. Review the generated code in this branch and the draft experiment in LaunchDarkly.
2. Start the experiment iteration in LaunchDarkly when the implementation is ready.
