import type { Product } from '../types'

/** All 50 US states (postal order). `slug` matches `states/{slug}.svg` → Wikimedia Commons `Flag_of_{Title_Case}.svg`. */
export const US_STATE_DEFINITIONS = [
  { postal: 'al', slug: 'alabama', name: 'Alabama' },
  { postal: 'ak', slug: 'alaska', name: 'Alaska' },
  { postal: 'az', slug: 'arizona', name: 'Arizona' },
  { postal: 'ar', slug: 'arkansas', name: 'Arkansas' },
  { postal: 'ca', slug: 'california', name: 'California' },
  { postal: 'co', slug: 'colorado', name: 'Colorado' },
  { postal: 'ct', slug: 'connecticut', name: 'Connecticut' },
  { postal: 'de', slug: 'delaware', name: 'Delaware' },
  { postal: 'fl', slug: 'florida', name: 'Florida' },
  { postal: 'ga', slug: 'georgia', name: 'Georgia' },
  { postal: 'hi', slug: 'hawaii', name: 'Hawaii' },
  { postal: 'id', slug: 'idaho', name: 'Idaho' },
  { postal: 'il', slug: 'illinois', name: 'Illinois' },
  { postal: 'in', slug: 'indiana', name: 'Indiana' },
  { postal: 'ia', slug: 'iowa', name: 'Iowa' },
  { postal: 'ks', slug: 'kansas', name: 'Kansas' },
  { postal: 'ky', slug: 'kentucky', name: 'Kentucky' },
  { postal: 'la', slug: 'louisiana', name: 'Louisiana' },
  { postal: 'me', slug: 'maine', name: 'Maine' },
  { postal: 'md', slug: 'maryland', name: 'Maryland' },
  { postal: 'ma', slug: 'massachusetts', name: 'Massachusetts' },
  { postal: 'mi', slug: 'michigan', name: 'Michigan' },
  { postal: 'mn', slug: 'minnesota', name: 'Minnesota' },
  { postal: 'ms', slug: 'mississippi', name: 'Mississippi' },
  { postal: 'mo', slug: 'missouri', name: 'Missouri' },
  { postal: 'mt', slug: 'montana', name: 'Montana' },
  { postal: 'ne', slug: 'nebraska', name: 'Nebraska' },
  { postal: 'nv', slug: 'nevada', name: 'Nevada' },
  { postal: 'nh', slug: 'new-hampshire', name: 'New Hampshire' },
  { postal: 'nj', slug: 'new-jersey', name: 'New Jersey' },
  { postal: 'nm', slug: 'new-mexico', name: 'New Mexico' },
  { postal: 'ny', slug: 'new-york', name: 'New York' },
  { postal: 'nc', slug: 'north-carolina', name: 'North Carolina' },
  { postal: 'nd', slug: 'north-dakota', name: 'North Dakota' },
  { postal: 'oh', slug: 'ohio', name: 'Ohio' },
  { postal: 'ok', slug: 'oklahoma', name: 'Oklahoma' },
  { postal: 'or', slug: 'oregon', name: 'Oregon' },
  { postal: 'pa', slug: 'pennsylvania', name: 'Pennsylvania' },
  { postal: 'ri', slug: 'rhode-island', name: 'Rhode Island' },
  { postal: 'sc', slug: 'south-carolina', name: 'South Carolina' },
  { postal: 'sd', slug: 'south-dakota', name: 'South Dakota' },
  { postal: 'tn', slug: 'tennessee', name: 'Tennessee' },
  { postal: 'tx', slug: 'texas', name: 'Texas' },
  { postal: 'ut', slug: 'utah', name: 'Utah' },
  { postal: 'vt', slug: 'vermont', name: 'Vermont' },
  { postal: 'va', slug: 'virginia', name: 'Virginia' },
  { postal: 'wa', slug: 'washington', name: 'Washington' },
  { postal: 'wv', slug: 'west-virginia', name: 'West Virginia' },
  { postal: 'wi', slug: 'wisconsin', name: 'Wisconsin' },
  { postal: 'wy', slug: 'wyoming', name: 'Wyoming' },
] as const

export type USStatePostal = (typeof US_STATE_DEFINITIONS)[number]['postal']

export type StateCatalogProductId = `state-${USStatePostal}`

export const STATE_CATALOG_PRODUCT_IDS: readonly StateCatalogProductId[] = US_STATE_DEFINITIONS.map(
  (s) => `state-${s.postal}` as StateCatalogProductId,
)

const FEATURED_POSTALS = new Set<USStatePostal>(['ca', 'tx', 'co', 'az', 'fl', 'ny'])

const DESCRIPTION_OVERRIDES: Partial<Record<USStatePostal, string>> = {
  ca: 'The Bear Republic flag featuring the iconic grizzly bear and lone star. Printed on durable nylon with vivid colors that hold up in coastal conditions.',
  tx: 'The Lone Star flag of Texas. Bold single star on blue and red fields — one of the most recognized state flags in the nation.',
  ny: 'Features the state coat of arms on a deep blue field. A distinguished flag representing the Empire State.',
  fl: "Florida's distinctive red saltire with the state seal on a white field. A bold design that stands out on any flagpole.",
  co: 'One of the most visually striking state flags — bold horizontal stripes of blue, white, and blue with the iconic red C and golden disk.',
  ak: "The Big Dipper and North Star shine on a deep blue field. Designed by a 13-year-old in 1927, Alaska's flag is one of the most beloved in the nation.",
  hi: "The only US state flag to feature the Union Jack, honoring Hawaii's historic ties with Britain. Eight stripes represent the eight main islands.",
  mt: "Montana's blue flag features the state seal above the state name in gold — a classic design representing Big Sky Country.",
  az: "Arizona's stunning copper star radiates red and gold rays over a blue lower half — one of the most visually dynamic state flags in America.",
  or: 'The only US state flag with different designs on each side. The front features the state shield; the reverse shows a beaver. Navy blue and gold.',
  nc: "North Carolina's classic flag features the state initials and dates of the Mecklenburg Declaration and Halifax Resolves on a rich red, white, and blue design.",
  ga: "Georgia's flag features the state seal with three pillars representing the three branches of government, surrounded by 13 stars, on a bold blue and red design.",
  wa: "The only state flag with a green field and a president's portrait — George Washington's likeness on a dark green background. A unique and striking design.",
  vt: "Vermont's deep blue flag features the state coat of arms with pine tree, cow, and sheaves of wheat — symbols of the Green Mountain State's natural heritage.",
  va: "Virginia's deep blue flag features the state seal with the Roman goddess Virtus standing victorious — and the state motto 'Sic Semper Tyrannis.'",
}

function defaultDescription(name: string, i: number): string {
  const lines = [
    `Official ${name} state flag with vivid, fade-resistant colors. Available in multiple sizes in nylon or polyester with a canvas header and brass grommets.`,
    `Fly the ${name} flag with pride — durable construction, sharp detail, and sizes from compact 2×3 ft up to 4×6 ft for larger poles.`,
    `Represent ${name} at home, school, or the office. This state flag is printed on weather-ready nylon or polyester with a reinforced fly end.`,
  ]
  return lines[i % lines.length]
}

export const usStateProducts: Product[] = US_STATE_DEFINITIONS.map((s, i) => ({
  id: `state-${s.postal}`,
  name: `${s.name} State Flag`,
  category: 'state',
  price: 22.99 + (i % 5) * 0.5,
  description: DESCRIPTION_OVERRIDES[s.postal] ?? defaultDescription(s.name, i),
  sizes: ['2×3 ft', '3×5 ft', '4×6 ft'],
  material: ['Nylon', 'Polyester'],
  rating: 4.3 + ((i * 3) % 12) * 0.05,
  reviewCount: 40 + (i * 47) % 200,
  inStock: true,
  featured: FEATURED_POSTALS.has(s.postal),
  flagImagePath: `states/${s.slug}.svg`,
}))
