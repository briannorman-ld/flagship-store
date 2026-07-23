import { expect, test } from '@playwright/test'

test.describe('Homepage product cards (desktop)', () => {
  test('Best Sellers “Add to Cart” is visible without hover', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Best Sellers' })).toBeVisible()

    const bestSellersSection = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Best Sellers' }),
    })
    const firstAddToCart = bestSellersSection.getByRole('button', { name: 'Add to Cart' }).first()

    await expect(firstAddToCart).toBeVisible()
    await expect(firstAddToCart).toHaveCSS('opacity', '1')
  })
})
