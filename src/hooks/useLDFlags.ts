import { useFlags } from 'launchdarkly-react-client-sdk'

export interface FlagSet {
  'show-promo-banner': boolean
  'enable-express-checkout': boolean
  'show-product-recommendations': boolean
  'enable-new-homepage-hero': boolean
  'show-reviews-tab': boolean
  'enable-wishlist': boolean
  'show-sale-badge': boolean
  'checkout-progress-indicator': boolean
  'free-shipping-threshold': number
  'homepage-hero-variant': string
}

const defaults: FlagSet = {
  'show-promo-banner': true,
  'enable-express-checkout': true,
  'show-product-recommendations': true,
  'enable-new-homepage-hero': false,
  'show-reviews-tab': true,
  'enable-wishlist': true,
  'show-sale-badge': true,
  'checkout-progress-indicator': true,
  'free-shipping-threshold': 75,
  'homepage-hero-variant': 'control',
}

export function useLDFlags(): FlagSet {
  const flags = useFlags()
  return {
    'show-promo-banner': flags['show-promo-banner'] ?? defaults['show-promo-banner'],
    'enable-express-checkout': flags['enable-express-checkout'] ?? defaults['enable-express-checkout'],
    'show-product-recommendations': flags['show-product-recommendations'] ?? defaults['show-product-recommendations'],
    'enable-new-homepage-hero': flags['enable-new-homepage-hero'] ?? defaults['enable-new-homepage-hero'],
    'show-reviews-tab': flags['show-reviews-tab'] ?? defaults['show-reviews-tab'],
    'enable-wishlist': flags['enable-wishlist'] ?? defaults['enable-wishlist'],
    'show-sale-badge': flags['show-sale-badge'] ?? defaults['show-sale-badge'],
    'checkout-progress-indicator': flags['checkout-progress-indicator'] ?? defaults['checkout-progress-indicator'],
    'free-shipping-threshold': flags['free-shipping-threshold'] ?? defaults['free-shipping-threshold'],
    'homepage-hero-variant': flags['homepage-hero-variant'] ?? defaults['homepage-hero-variant'],
  }
}
