import { expect, test } from '@playwright/test'

test.describe('Homepage product cards (desktop)', () => {
  test('Best Sellers “Add to Cart” only appears on card hover', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Best Sellers' })).toBeVisible()

    const bestSellersSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Best Sellers' }),
    })
    const firstCard = bestSellersSection.getByRole('link').first()
    const firstAddToCart = firstCard.getByRole('button', { name: 'Add to Cart' })

    // Hidden (opacity 0) until the card is hovered.
    await expect(firstAddToCart).toHaveCSS('opacity', '0')

    await firstCard.hover()
    await expect(firstAddToCart).toHaveCSS('opacity', '1')
  })
})
