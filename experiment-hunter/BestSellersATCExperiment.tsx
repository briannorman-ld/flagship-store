import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

const FLAG_KEY = 'eh-d-best-sellers-atc-visible-desktop';

const BestSellersATCExperiment = ({ children }) => {
  const { [FLAG_KEY]: isVariant } = useFlags();

  return (
    <div className={isVariant ? 'atc-visible' : 'atc-hidden'}>
      {children}
    </div>
  );
};

export default BestSellersATCExperiment;
