/**
 * Custom event keys for LaunchDarkly metrics (project: flagship-store).
 * Keep in sync with `scripts/create-flagship-store-metrics.mjs`.
 */
export const STORE_METRIC_EVENTS = {
  pdpView: 'flagship-store-pdp-view',
  plpView: 'flagship-store-plp-view',
  addToCart: 'flagship-store-add-to-cart',
  cartView: 'flagship-store-cart-view',
  checkoutStart: 'flagship-store-checkout-start',
  orderConfirmation: 'flagship-store-order-confirmation',
  pdpQuantityStepperUsed: 'pdp_quantity_stepper_used',
  pdpShippingTabOpened: 'pdp_shipping_tab_opened',
  pdpReviewsTabOpened: 'pdp_reviews_tab_opened',
  pdpRecommendationClicked: 'pdp_recommendation_clicked',
  pdpWishlistClicked: 'pdp_wishlist_clicked',
} as const
