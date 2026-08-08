import { useFlags } from 'launchdarkly-react-client-sdk';

export const SIZE_RECOMMENDATION_FLAG = 'eh-desktop-size-recommendation-desktop';

/**
 * Hook to determine if the 'Most Popular' size recommendation should be shown.
 *
 * @returns {boolean} - True if the variant should be shown, false if control.
 */
export function useSizeRecommendationExperiment(): boolean {
  const { [SIZE_RECOMMENDATION_FLAG]: isVariant } = useFlags();
  return isVariant;
}
