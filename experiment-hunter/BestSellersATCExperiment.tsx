import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

export const BestSellersATCExperiment = () => {
  const { 'eh-d-best-sellers-atc-visible-desktop': isVisible } = useFlags();

  return (
    <div className="best-sellers">
      <div className="product-card">
        <button
          className={`add-to-cart-button ${isVisible ? 'visible' : 'hidden'}`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
