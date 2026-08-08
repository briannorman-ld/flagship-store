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
  homepageBestSellerProductClick: 'eh-suggested-homepage_best_seller_product_click',
  addToCartHomepage: 'add_to_cart_homepage',
  productCardClick: 'product_card_click',
} as const
