import React from 'react';
import { useSizeRecommendationExperiment } from './useSizeRecommendationExperiment';

interface SizeSelectorProps {
  sizes: string[];
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes }) => {
  const showRecommendation = useSizeRecommendationExperiment();
  const mostPopularSize = sizes[0]; // Assume the first size is the most popular for simplicity

  return (
    <div>
      <label htmlFor="size">Choose a size:</label>
      <select id="size" name="size">
        {sizes.map((size) => (
          <option key={size} value={size} selected={showRecommendation && size === mostPopularSize}>
            {size} {showRecommendation && size === mostPopularSize ? '(Most Popular)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeSelector;
