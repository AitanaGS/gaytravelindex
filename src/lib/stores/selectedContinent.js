import { writable, derived } from 'svelte/store';
// import data from '../../../data/processed/GTI_2012-2021.json';

import { extent, max, min, group } from 'd3-array';
import { tidy, pivotLonger } from '@tidyjs/tidy';
import { scaleBand, scaleSequential } from 'd3-scale';

import { query, activeSearch } from './search';

import { data } from './data';

export const selectedContinent = writable('All');

// export const selectedValue = writable('All');

// export const selectedContinentCountries = derived(
//   [data, selectedContinent],
//   ([$data, $selectedContinent]) => {
//     return [
//       ...new Set(
//         $data
//           // .filter(d => d.continent == selectedContinent)
//           .filter((d) => {
//             if ($selectedContinent === 'All') return true;
//             else if ($selectedContinent === '') return false;
//             else return d.continent === $selectedContinent;
//           })
//           .filter((d) => d.year === 2023)
//           .sort(
//             (a, b) =>
//               a.ranking - b.ranking || a.country.localeCompare(b.country)
//           )
//           .map((d) => d.country)
//       ),
//     ];
//   }
// );

// export const selectedContinentData = derived(
//   [data, selectedContinent],
//   ([$data, $selectedContinent]) => {
//     return group(
//       $data
//         .filter((d) => {
//           if ($selectedContinent === 'All') return true;
//           else if ($selectedContinent === '') return false;
//           else return d.continent === $selectedContinent;
//         })
//         .sort((a, b) => {
//           if (a.year !== 2023) return 1;
//           else if (b.year !== 2023) return -1;
//           else
//             return a.ranking - b.ranking || a.country.localeCompare(b.country);
//         }),
//       (d) => d.country
//     );
//   }
// );

// export const cachedContinentData = writable(new Map());

// export const cachedContinentCountries = writable(new Map());

// export const clickedContinentData = derived(
//   [data, clickedContinent],
//   ([data, $clickedContinent]) => {
//     return group(
//       data
//         .filter((d) => {
//           if (selectedContinent === 'All') return true;
//           else return d.continent === $clickedContinent;
//         })
//         .sort((a, b) => {
//           if (a.year !== 2021) return 1;
//           else if (b.year !== 2021) return -1;
//           else
//             return a.ranking - b.ranking || a.country.localeCompare(b.country);
//         }),
//       (d) => d.country
//     );
//   }
// );

// export const isSmallMobile = derived(
//     [width, smallMobileBreakpoint],
//     ([$width, $smallMobileBreakpoint]) => {
//       return $width <= $smallMobileBreakpoint; // < 520
//     }
//   );

// selectedContinentData = group(
//     data.filter(d => {
//       if (selectedContinent === "All") return true
//       else return d.continent === selectedContinent
//     })
//       .sort((a, b) => {
//         if(a.year !== 2021) return 1;
//         else if(b.year !== 2021) return -1;
//         else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
//       }), d => d.country)
