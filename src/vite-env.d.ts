/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When `"true"`, Playwright / CI builds (mode `e2e`) force the desktop visible-ATC treatment without LaunchDarkly. */
  readonly VITE_PLAYWRIGHT_ATC_TREATMENT?: string
  readonly VITE_LD_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
