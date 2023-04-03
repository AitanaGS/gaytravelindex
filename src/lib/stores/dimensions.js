import { writable, readable, derived } from 'svelte/store';
// import { isMobile, isTablet, isDesktop } from './devices';

// export const windowWidth = writable(window.innerWidth);
export const width = writable(0);
export const height = writable(0);

export const smallMobileBreakpoint = readable(450);
export const mobileBreakpoint = readable(650); // 600
export const desktopBreakpoint = readable(1100);

export const minDim = derived([width, height], ([$width, $height]) => {
  return Math.min($width, $height);
});

export const isSmallMobile = derived(
  [width, smallMobileBreakpoint],
  ([$width, $smallMobileBreakpoint]) => {
    return $width <= $smallMobileBreakpoint; // < 520
  }
);

export const isMobile = derived(
  [width, mobileBreakpoint],
  ([$width, $mobileBreakpoint]) => {
    return $width <= $mobileBreakpoint; // < 520
  }
);

export const isTablet = derived(
  [width, mobileBreakpoint, desktopBreakpoint],
  ([$width, $mobileBreakpoint, $desktopBreakpoint]) => {
    return $width > $mobileBreakpoint && $width <= $desktopBreakpoint;
  }
);

export const isDesktop = derived(
  [width, desktopBreakpoint],
  ([$width, $desktopBreakpoint]) => {
    return $width > $desktopBreakpoint; // > 1024
  }
);

// export const chartGap = writable(0);

// export const chartGap = derived(
//   [isMobile, isTablet, isDesktop],
//   ([$isMobile, $isTablet, $isDesktop]) => {
//     return $isDesktop ? 30 : $isTablet ? 10 : 0;
//   }
// );

// export const chartWidth = derived([width], ([$width]) => {
//   return $width * 0.8; // 0.9 0.85
// });

// export const chartWidth = derived([width], ([$width]) => {
//   return $width * 0.8; // 0.9 0.85
// });

// export const chartWidth = derived(
//   [isDesktop, width, chartGap],
//   ([$isDesktop, $width, $chartGap]) => {
//     return $isDesktop ? (($width - $chartGap) / 2) * 0.8 : $width * 0.8; // 0.9 0.85
//   }
// );

// export const continentWidth = derived(
//   [isDesktop, width, chartGap],
//   ([$isDesktop, $width, $chartGap]) => {
//     return $isDesktop ? (($width - $chartGap) / 2) * 0.9 : $width * 0.85;
//   }
// );

// export const countryWidth = derived(
//   [isDesktop, width, chartGap],
//   ([$isDesktop, $width, $chartGap]) => {
//     return $isDesktop ? (($width - $chartGap) / 2) * 0.9 : $width * 0.85;
//   }
// );

// export const chartGap = derived(
//   [isMobile, isTablet, isDesktop],
//   ([$isMobile, $isTablet, $isDesktop]) => {
//     return $isDesktop ? 10 : $isTablet ? 5 : 3;
//   }
// );

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
