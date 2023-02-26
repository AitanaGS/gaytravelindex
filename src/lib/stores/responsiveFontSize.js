// import { windowWidth } from './windowWidth';
import { width } from './dimensions';

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
  .domain([600, 1000])
  .range([2, 1]) //.range([26, 16])
  .clamp(true);

// export const chartFontSize = writable(chartFontSizeScale(currentwidth));

export const chartFontSize = derived(width, ($width) =>
  chartFontSizeScale($width)
);

const tooltipFontSizeScale = scaleLinear()
  .domain([600, 1000])
  .range([2, 1]) //.range([26, 16])
  .clamp(true);

export const tooltipFontSize = derived(width, ($width) =>
  tooltipFontSizeScale($width)
);
