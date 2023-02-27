// import { windowWidth } from './windowWidth';
import { width, chartWidth } from './dimensions';

import { derived } from 'svelte/store';
import { scaleLinear } from 'd3-scale';

// const bodyFontSizeScale = scaleLinear()
//   .domain([600, 1000])
//   .range([26, 16])
//   .clamp(true);

// export const bodyFontSize = derived(width, ($width) =>
//   bodyFontSizeScale($width)
// );

const chartFontSizeScale = scaleLinear()
  .domain([300, 1000])
  .range([0.9, 1]) //.range([26, 16])
  .clamp(true);

// export const chartFontSize = writable(chartFontSizeScale(currentwidth));

export const chartFontSize = derived(chartWidth, ($chartWidth) =>
  chartFontSizeScale($chartWidth)
);

const tooltipFontSizeScale = scaleLinear()
  .domain([300, 2000])
  .range([1.4, 1]) //.range([26, 16])
  .clamp(true);

export const tooltipFontSize = derived(width, ($width) =>
  tooltipFontSizeScale($width)
);
