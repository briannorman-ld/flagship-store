import React from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { FLAG_KEY } from './ExperimentConfig';

const ShippingCTAExperiment: React.FC = () => {
  const ldClient = useLDClient();
  const showInlineShippingInfo = ldClient?.variation(FLAG_KEY, false);

  return (
    <div className="cta-container">
      {showInlineShippingInfo ? (
        <div className="promo-info">Free shipping on orders over $50! Save more with our ongoing promotions.</div>
      ) : null}
      <button className="add-to-cart">Add to Cart</button>
      <button className="wishlist">Add to Wishlist</button>
      {!showInlineShippingInfo && (
        <div className="shipping-info">Shipping and return benefits are listed below the buttons.</div>
      )}
    </div>
  );
};

export default ShippingCTAExperiment;
