import { useFlags } from 'launchdarkly-react-client-sdk'

import { STATE_CATALOG_PRODUCT_IDS, type StateCatalogProductId } from '../data/usStateCatalog'

/** LD keys for state SKUs: `show-state-{postal}` (e.g. `show-state-ca`). */
type StateShowFlagKey = `show-${StateCatalogProductId}`

type StateShowFlags = { [K in StateShowFlagKey]: boolean }

const stateShowDefaults: StateShowFlags = Object.fromEntries(
  STATE_CATALOG_PRODUCT_IDS.map((id) => [`show-${id}`, true]),
) as StateShowFlags

export const BESTSELLER_ATC_VISIBLE_DESKTOP_FLAG_KEY = 'eh-desk-bestseller-atc-visible-desktop' as const

export interface FlagSet extends StateShowFlags {
  'show-promo-banner': boolean
  'enable-express-checkout': boolean
  'show-product-recommendations': boolean
  'enable-new-homepage-hero': boolean
  'show-reviews-tab': boolean
  'enable-wishlist': boolean
  'show-sale-badge': boolean
  /** When true, all product card "Add to Cart" CTAs are visible without hovering the card. */
  'show-product-card-add-to-cart': boolean
  /** Experiment: desktop homepage Best Seller cards show the Add to Cart CTA without hover. */
  [BESTSELLER_ATC_VISIBLE_DESKTOP_FLAG_KEY]: boolean
  'checkout-progress-indicator': boolean
  'free-shipping-threshold': number
  'homepage-hero-variant': string
}

const defaults: Omit<FlagSet, keyof StateShowFlags> & StateShowFlags = {
  ...stateShowDefaults,
  'show-promo-banner': true,
  'enable-express-checkout': true,
  'show-product-recommendations': true,
  'enable-new-homepage-hero': false,
  'show-reviews-tab': true,
  'enable-wishlist': true,
  'show-sale-badge': true,
  'show-product-card-add-to-cart': false,
  [BESTSELLER_ATC_VISIBLE_DESKTOP_FLAG_KEY]: false,
  'checkout-progress-indicator': true,
  'free-shipping-threshold': 75,
  'homepage-hero-variant': 'control',
}

function stateShowFromFlags(flags: ReturnType<typeof useFlags>): StateShowFlags {
  const out = { ...stateShowDefaults }
  for (const id of STATE_CATALOG_PRODUCT_IDS) {
    const key = `show-${id}` as StateShowFlagKey
    out[key] = (flags[key] as boolean | undefined) ?? defaults[key]
  }
  return out
}

export function useLDFlags(): FlagSet {
  const flags = useFlags()
  /** E2E / CI only (`vite build --mode e2e` loads `.env.e2e`) — avoids needing a real LD client for Playwright. */
  const playwrightAtcTreatment = import.meta.env.VITE_PLAYWRIGHT_ATC_TREATMENT === 'true'

  return {
    ...stateShowFromFlags(flags),
    'show-promo-banner': flags['show-promo-banner'] ?? defaults['show-promo-banner'],
    'enable-express-checkout': flags['enable-express-checkout'] ?? defaults['enable-express-checkout'],
    'show-product-recommendations': flags['show-product-recommendations'] ?? defaults['show-product-recommendations'],
    'enable-new-homepage-hero': flags['enable-new-homepage-hero'] ?? defaults['enable-new-homepage-hero'],
    'show-reviews-tab': flags['show-reviews-tab'] ?? defaults['show-reviews-tab'],
    'enable-wishlist': flags['enable-wishlist'] ?? defaults['enable-wishlist'],
    'show-sale-badge': flags['show-sale-badge'] ?? defaults['show-sale-badge'],
    'show-product-card-add-to-cart': playwrightAtcTreatment
      ? true
      : (flags['show-product-card-add-to-cart'] ?? defaults['show-product-card-add-to-cart']),
    [BESTSELLER_ATC_VISIBLE_DESKTOP_FLAG_KEY]: playwrightAtcTreatment
      ? true
      : (flags[BESTSELLER_ATC_VISIBLE_DESKTOP_FLAG_KEY] ?? defaults[BESTSELLER_ATC_VISIBLE_DESKTOP_FLAG_KEY]),
    'checkout-progress-indicator': flags['checkout-progress-indicator'] ?? defaults['checkout-progress-indicator'],
    'free-shipping-threshold': flags['free-shipping-threshold'] ?? defaults['free-shipping-threshold'],
    'homepage-hero-variant': flags['homepage-hero-variant'] ?? defaults['homepage-hero-variant'],
  }
}
