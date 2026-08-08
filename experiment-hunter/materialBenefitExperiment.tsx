import { useFlags } from 'launchdarkly-react-client-sdk';
import React from 'react';

const MATERIAL_BENEFIT_FLAG = 'eh-desktop-material-guidance-copy-desktop';

const MaterialBenefitExperiment: React.FC = () => {
  const { [MATERIAL_BENEFIT_FLAG]: showMaterialBenefit } = useFlags();

  return (
    <div>
      <h3>Materials</h3>
      <ul>
        <li>
          Nylon
          {showMaterialBenefit && <span> - Outdoor durability</span>}
        </li>
        <li>
          Polyester
          {showMaterialBenefit && <span> - Budget-friendly value</span>}
        </li>
      </ul>
    </div>
  );
};

export default MaterialBenefitExperiment;
