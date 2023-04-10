import { writable, readable, derived } from 'svelte/store';

export const width = writable(0);
export const height = writable(0);

const mobileBreakpoint = readable(500);

const smallBreakpoint = readable(700);

export const isMobile = derived(
  [width, mobileBreakpoint],
  ([$width, $mobileBreakpoint]) => {
    return $width < $mobileBreakpoint;
  }
);

export const isSmall = derived(
  [width, smallBreakpoint],
  ([$width, $smallBreakpoint]) => {
    return $width < $smallBreakpoint;
  }
);
