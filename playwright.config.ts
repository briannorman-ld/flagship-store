import { defineConfig, devices } from '@playwright/test'

/** Must match `BrowserRouter` basename and Vite `base` in vite.config.ts */
const baseURL = (process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173/flagship-store').replace(/\/$/, '')

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `${baseURL}/`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run build:e2e && npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
        url: `${baseURL}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
})
