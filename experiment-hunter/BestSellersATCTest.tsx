import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

const BestSellersATCTest = () => {
  const { 'eh-d-best-sellers-atc-visible-desktop': isVariantB } = useFlags();

  return (
    <div className="best-sellers">
      {isVariantB ? (
        <button className="add-to-cart visible">Add to Cart</button>
      ) : (
        <button className="add-to-cart hidden">Add to Cart</button>
      )}
    </div>
  );
};

export default BestSellersATCTest;
