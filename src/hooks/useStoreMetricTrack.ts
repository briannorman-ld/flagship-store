import { useLDClient } from 'launchdarkly-react-client-sdk'
import { useCallback } from 'react'

/**
 * Sends custom events to LaunchDarkly for funnel / experiment metrics.
 * No-ops when the client is not ready.
 */
export function useStoreMetricTrack() {
  const client = useLDClient()

  return useCallback(
    (eventKey: string, data?: Record<string, unknown>) => {
      try {
        client?.track(eventKey, data)
      } catch {
        /* ignore */
      }
    },
    [client],
  )
}
