import { readable, derived } from 'svelte/store';
import { selectedContinent } from './selectedContinent';
import { json } from 'd3-fetch';
import { extent, max, min, group } from 'd3-array';
import { tidy, pivotLonger } from '@tidyjs/tidy';
import { scaleBand, scaleSequential } from 'd3-scale';
import gtiData from '../../../data/processed/GTI_2012-2023.json';
import gti2023Data from '../../../data/processed/GTI_2012-2023_data2023.json';

// const dataPath = '../../../data/processed/GTI_2012-2021.json';

// export const data = readable([], async (set) => {
//   const data = await json(dataPath);
//   return data;
// });

export const data = readable(gtiData);

export const data2023 = readable(gti2023Data);

export const data2023Map = derived([data2023], ([$data2021]) => {
  const dataMap = new Map();
  $data2021.forEach((d) => {
    dataMap.set(d.longName, {
      shortName: d.country,
      continent: d.continent,
      ranking: d.ranking,
      total: d.total,
    });
  });

  return dataMap;
});

// export const selectedContinentData = derived(
//   [data, selectedContinent],
//   ([$data, $selectedContinent]) => {
//     return group(
//       $data
//         .filter((d) => {
//           if ($selectedContinent === 'All') return true;
//           else return d.continent === $selectedContinent;
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

// export const selectedContinentCountries = derived(
//   [data, selectedContinent],
//   ([$data, $selectedContinent]) => {
//     return [
//       ...new Set(
//         $data
//           // .filter(d => d.continent == selectedContinent)
//           .filter((d) => {
//             if ($selectedContinent === 'All') return true;
//             else return d.continent === $selectedContinent;
//           })
//           .filter((d) => d.year === 2021)
//           .sort(
//             (a, b) =>
//               a.ranking - b.ranking || a.country.localeCompare(b.country)
//           )
//           .map((d) => d.country)
//       ),
//     ];
//   }
// );

// export const countryScale = derived(
//   [selectedContinentCountries],
//   ([$selectedContinentCountries]) => {
//     return scaleBand()
//       .domain($selectedContinentCountries)
//       .range([0, innerHeight])
//       .paddingInner(0.05)
//       .paddingOuter(0.3);
//   }
// );

// $: countryScale = scaleBand()
// .domain($selectedContinentCountries)
// .range([0, innerHeight])
// .paddingInner(0.05)
// .paddingOuter(0.3)

// $: selectedContinentCountries = [... new Set(
//     $data
//   // .filter(d => d.continent == selectedContinent)
//   .filter(d => {
//     if ($selectedContinent === "All") return true
//     else return d.continent === $selectedContinent
//   })
//   .filter(d => d.year === 2021)
//   .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
//   .map(d => d.country)
//   )]

// export const dataLonger = derived([data], ([$data]) => {
//   return tidy(
//     $data,
//     pivotLonger({
//       cols: indicatorVariables,
//       namesTo: 'indicator',
//       valuesTo: 'value',
//     })
//   );
// });
