import { writable, derived } from 'svelte/store';
import data from '../../../data/processed/GTI_2012-2021.json';

export const selectedContinent = writable('All');

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
