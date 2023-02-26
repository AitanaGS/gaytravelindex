import { writable, derived } from 'svelte/store';

// export const windowWidth = writable(window.innerWidth);
export const width = writable(0);
export const height = writable(0);

export const minDim = derived([width, height], ([$width, $height]) => {
  return Math.min($width, $height);
});

// export const mapWidth = derived(width, ($width) => {
//   return $width * 0.75;
// });

// let chartGap = 10;

// export const continentWidth = derived(width, ($width) => {
//   return ($width - chartGap) / 2;
// });
// export const countryWidth = derived(width, ($width) => {
//   return ($width - chartGap) / 2;
// });
