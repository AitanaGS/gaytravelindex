import { writable, derived } from 'svelte/store';
import { scaleLinear } from 'd3-scale';

export const windowWidth = writable(window.innerWidth);

const bodyFontSizeScale = scaleLinear()
  .domain([600, 1000])
  .range([26, 16])
  .clamp(true);

export const bodyFontSize = derived(windowWidth, ($windowWidth) =>
  bodyFontSizeScale($windowWidth)
);

const chartFontSizeScale = scaleLinear()
  .domain([600, 1000])
  .range([26, 16])
  .clamp(true);

// export const chartFontSize = writable(chartFontSizeScale(currentWindowWidth));

export const chartFontSize = derived(windowWidth, ($windowWidth) =>
  chartFontSizeScale($windowWidth)
);

const tooltipFontSizeScale = scaleLinear()
  .domain([600, 1000])
  .range([26, 16])
  .clamp(true);

export const tooltipFontSize = derived(windowWidth, ($windowWidth) =>
  tooltipFontSizeScale($windowWidth)
);
