import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

const StickyBuyBoxExperiment: React.FC = () => {
  const { 'eh-desktop-sticky-buy-box-desktop': isStickyBuyBoxEnabled } = useFlags();

  return (
    <div>
      {isStickyBuyBoxEnabled ? (
        <div className="sticky-buy-box">
          {/* Variant: Compact sticky buy box implementation */}
          <h2>Buy Now</h2>
          <button>Add to Cart</button>
        </div>
      ) : (
        <div className="standard-buy-box">
          {/* Control: Standard buy box at the top */}
          <h2>Buy Now</h2>
          <button>Add to Cart</button>
        </div>
      )}
    </div>
  );
};

export default StickyBuyBoxExperiment;
