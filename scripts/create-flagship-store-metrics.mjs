#!/usr/bin/env node
/**
 * Creates custom conversion metrics in the LaunchDarkly project `flagship-store`.
 *
 * The configured Cursor LaunchDarkly MCP does not expose metric APIs, so this
 * script uses the REST API instead.
 *
 * Usage:
 *   export LAUNCHDARKLY_API_ACCESS_TOKEN="api-..."   # Account settings → Authorization → Access tokens
 *   node scripts/create-flagship-store-metrics.mjs
 *
 * @see https://launchdarkly.com/docs/api/metrics/post-metric
 */

const PROJECT_KEY = 'flagship-store'
const API_BASE = 'https://app.launchdarkly.com/api/v2'

const token =
  process.env.LAUNCHDARKLY_API_ACCESS_TOKEN ||
  process.env.LAUNCHDARKLY_API_TOKEN ||
  process.env.LD_API_ACCESS_TOKEN

const metrics = [
  {
    key: 'flagship-store-pdp-view',
    name: 'FlagShip - PDP view',
    description: 'Product detail page viewed (flagship-store app).',
    eventKey: 'flagship-store-pdp-view',
  },
  {
    key: 'flagship-store-plp-view',
    name: 'FlagShip - PLP view',
    description: 'Category / product listing page viewed (flagship-store app).',
    eventKey: 'flagship-store-plp-view',
  },
  {
    key: 'flagship-store-add-to-cart',
    name: 'FlagShip - Add to cart',
    description: 'User added an item to the cart (flagship-store app).',
    eventKey: 'flagship-store-add-to-cart',
  },
  {
    key: 'flagship-store-cart-view',
    name: 'FlagShip - Cart view',
    description: 'Shopping cart page viewed (flagship-store app).',
    eventKey: 'flagship-store-cart-view',
  },
  {
    key: 'flagship-store-checkout-start',
    name: 'FlagShip - Checkout start',
    description: 'Checkout flow started with a non-empty cart (flagship-store app).',
    eventKey: 'flagship-store-checkout-start',
  },
  {
    key: 'flagship-store-order-confirmation',
    name: 'FlagShip - Order confirmation',
    description: 'Order confirmation page viewed after purchase (flagship-store app).',
    eventKey: 'flagship-store-order-confirmation',
  },
]

async function createMetric(body) {
  const res = await fetch(`${API_BASE}/metrics/${PROJECT_KEY}`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { ok: res.ok, status: res.status, json }
}

async function main() {
  if (!token) {
    console.error(
      'Missing API token. Set LAUNCHDARKLY_API_ACCESS_TOKEN (recommended) or LAUNCHDARKLY_API_TOKEN.',
    )
    process.exit(1)
  }

  // Omit tags unless needed: some token/scopes or LD versions reject certain
  // characters; tags are optional on metric create.
  for (const m of metrics) {
    const payload = {
      key: m.key,
      name: m.name,
      description: m.description,
      kind: 'custom',
      isNumeric: false,
      eventKey: m.eventKey,
      successCriteria: 'HigherThanBaseline',
    }

    const { ok, status, json } = await createMetric(payload)
    if (ok) {
      console.log(`✓ Created metric ${m.key} (${status})`)
      continue
    }
    if (status === 409) {
      console.log(`· Skipped ${m.key} (already exists)`)
      continue
    }
    console.error(`✗ ${m.key} (${status}):`, json)
    process.exitCode = 1
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
