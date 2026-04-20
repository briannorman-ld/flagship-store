import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

const CTAExperiment = () => {
  const { 'eh-desktop-cta-copy-specificity-desktop': ctaCopySpecificity } = useFlags();

  const buttonText = ctaCopySpecificity ? 'Shop Best-Selling Flags' : 'Continue Shopping';

  return (
    <button>{buttonText}</button>
  );
};

export default CTAExperiment;
