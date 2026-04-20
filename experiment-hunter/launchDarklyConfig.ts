import { LDClient, LDFlagSet, LDUser } from 'launchdarkly-react-client-sdk';

const flagKey = 'eh-desktop-cta-shipping-inline-desktop';

export const initializeLDClient = (user: LDUser): LDClient => {
  const client = new LDClient({
    clientSideID: 'your-client-side-id', // Replace with actual client-side ID
    user,
  });

  return client;
};

export const getFlagVariation = (client: LDClient): boolean => {
  return client.variation(flagKey, false);
};
