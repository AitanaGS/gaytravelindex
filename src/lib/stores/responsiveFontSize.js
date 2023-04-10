import { width } from './dimensions';

import { derived } from 'svelte/store';
import { scaleLinear } from 'd3-scale';

const chartFontSizeScale = scaleLinear()
  .domain([300, 1000])
  .range([0.9, 1])
  .clamp(true);

export const chartFontSize = derived(width, ($width) =>
  chartFontSizeScale($width * 0.8)
);
