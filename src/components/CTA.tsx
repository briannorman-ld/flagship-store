import React from 'react';
import { initializeLDClient, getFlagVariation } from '../../experiment-hunter/launchDarklyConfig';
import { LDUser } from 'launchdarkly-react-client-sdk';

const user: LDUser = { key: 'user-key' }; // Replace with actual user identification
const ldClient = initializeLDClient(user);

const CTA: React.FC = () => {
  const showInlineShipping = getFlagVariation(ldClient);

  return (
    <div className="cta-container">
      {showInlineShipping ? (
        <div className="cta-inline-shipping">
          <p>Free shipping on orders over $50!</p>
          <p>Save more with current promotions!</p>
        </div>
      ) : null}
      <button className="add-to-cart">Add to Cart</button>
      <button className="wishlist">Add to Wishlist</button>
      {!showInlineShipping && (
        <div className="shipping-info">
          <p>Shipping and return benefits are listed below.</p>
        </div>
      )}
    </div>
  );
};

export default CTA;
