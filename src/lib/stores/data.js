import { readable, derived, writable } from 'svelte/store';
import { selectedContinent } from './selectedContinent';
import { json } from 'd3-fetch';
import { extent, max, min, group } from 'd3-array';
import { tidy, pivotLonger } from '@tidyjs/tidy';
import { scaleBand, scaleSequential } from 'd3-scale';
import gtiData from '../../../data/processed/GTI_2012-2023.json';
import gti2023Data from '../../../data/processed/GTI_2012-2023_data2023.json';
import { query, activeSearch } from './search';
// import {
//   selectedContinent,
//   selectedContinentData,
//   selectedContinentCountries,
//   cachedContinentCountries,
//   cachedContinentData,
// } from './selectedContinent';

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

export const continents = derived([data], ([$data]) => {
  return [...new Set($data.map((d) => d.continent))].sort();
});

export const years = derived([data], ([$data]) => {
  return [...new Set($data.map((d) => d.year))].sort();
});

export const selectedContinentCountries = derived(
  [data, selectedContinent],
  ([$data, $selectedContinent]) => {
    return [
      ...new Set(
        $data
          // .filter(d => d.continent == selectedContinent)
          .filter((d) => {
            if ($selectedContinent === 'All') return true;
            else if ($selectedContinent === '') return false;
            else return d.continent === $selectedContinent;
          })
          .filter((d) => d.year === 2023)
          .sort(
            (a, b) =>
              a.ranking - b.ranking || a.country.localeCompare(b.country)
          )
          .map((d) => d.country)
      ),
    ];
  }
);

export const selectedContinentData = derived(
  [data, selectedContinent],
  ([$data, $selectedContinent]) => {
    return group(
      $data
        .filter((d) => {
          if ($selectedContinent === 'All') return true;
          else if ($selectedContinent === '') return false;
          else return d.continent === $selectedContinent;
        })
        .sort((a, b) => {
          if (a.year !== 2023) return 1;
          else if (b.year !== 2023) return -1;
          else
            return a.ranking - b.ranking || a.country.localeCompare(b.country);
        }),
      (d) => d.country
    );
  }
);

export const cachedContinentData = writable(new Map());

export const cachedContinentCountries = writable(new Map());

const searchedCountries = derived(
  [data, query, activeSearch],
  ([$data, $query, $activeSearch]) => {
    const countries = $activeSearch
      ? [
          ...new Set(
            $data
              .filter((d) => {
                return d.country.toLowerCase().includes($query.toLowerCase());
              })
              .filter((d) => d.year === 2023)
              .sort(
                (a, b) =>
                  a.ranking - b.ranking || a.country.localeCompare(b.country)
              )
              .map((d) => d.country)
          ),
        ]
      : [];
    return countries;
  }
);

const searchedCountryData = derived(
  [data, query, activeSearch],
  ([$data, $query, $activeSearch]) => {
    const data = $activeSearch
      ? group(
          $data
            .filter((d) => {
              return d.country.toLowerCase().includes($query.toLowerCase());
              // if ($selectedContinent === "All") return true
              // else return d.continent === $selectedContinent
            })
            .sort((a, b) => {
              if (a.year !== 2023) return 1;
              else if (b.year !== 2023) return -1;
              else
                return (
                  a.ranking - b.ranking || a.country.localeCompare(b.country)
                );
            }),
          (d) => d.country
        )
      : null;

    //  group($data, (d) => d.country)

    // : group(
    //   $data.filter((d) => {
    //     return false;
    //     // return d.country === '';
    //   }),
    //   (d) => d.country
    // );

    return data;
  }
);

// export const activeData = derived(
//   [activeSearch, searchedCountryData, selectedContinentData],
//   ([$activeSearch, $searchedCountryData, $selectedContinentData]) => {
//     return $activeSearch ? $searchedCountryData : $selectedContinentData;
//   }
// );

// export const activeCountries = derived(
//   [activeSearch, searchedCountries, selectedContinentCountries],
//   ([$activeSearch, $searchedCountries, $selectedContinentCountries]) => {
//     return $activeSearch ? $searchedCountries : $selectedContinentCountries;
//   }
// );

export const activeData = derived(
  [
    activeSearch,
    searchedCountryData,
    cachedContinentData,
    selectedContinent,
    selectedContinentData,
  ],
  ([
    $activeSearch,
    $searchedCountryData,
    $cachedContinentData,
    $selectedContinent,
    $selectedContinentData,
  ]) => {
    return $activeSearch
      ? $searchedCountryData
      : $cachedContinentData.get($selectedContinent) ?? $selectedContinentData;
  }
);

export const activeCountries = derived(
  [
    activeSearch,
    searchedCountries,
    cachedContinentCountries,
    selectedContinent,
    selectedContinentCountries,
  ],
  ([
    $activeSearch,
    $searchedCountries,
    $cachedContinentCountries,
    $selectedContinent,
    $selectedContinentCountries,
  ]) => {
    return $activeSearch
      ? $searchedCountries
      : $cachedContinentCountries.get($selectedContinent) ??
          $selectedContinentCountries;
  }
);

// export const activeData = derived(
//   [
//     activeSearch,
//     searchedCountryData,
//     cachedContinentData,
//     selectedContinent,
//     selectedContinentData,
//   ],
//   ([
//     $activeSearch,
//     $searchedCountryData,
//     $cachedContinentData,
//     $selectedContinent,
//     $selectedContinentData,
//   ]) => {
//     return $activeSearch
//       ? $searchedCountryData
//       : $cachedContinentData.has($selectedContinent)
//       ? $cachedContinentData.get($selectedContinent)
//       : $selectedContinentData;
//   }
// );

// export const activeCountries = derived(
//   [
//     activeSearch,
//     searchedCountries,
//     cachedContinentCountries,
//     selectedContinent,
//     selectedContinentCountries,
//   ],
//   ([
//     $activeSearch,
//     $searchedCountries,
//     $cachedContinentCountries,
//     $selectedContinent,
//     $selectedContinentCountries,
//   ]) => {
//     return $activeSearch
//       ? $searchedCountries
//       : $cachedContinentCountries.has($selectedContinent)
//       ? $cachedContinentCountries.get($selectedContinent)
//       : $selectedContinentCountries;
//   }
// );

// export const activeData = derived(
//   [
//     activeSearch,
//     searchedCountryData,
//     cachedContinentData,
//     selectedContinent,
//     selectedContinentData,
//   ],
//   ([
//     $activeSearch,
//     $searchedCountryData,
//     $cachedContinentData,
//     $selectedContinent,
//     $selectedContinentData,
//   ]) => {
//     return $activeSearch
//       ? $searchedCountryData
//       : $cachedContinentData[$selectedContinent] ?? $selectedContinentData;
//   }
// );

// export const activeCountries = derived(
//   [
//     activeSearch,
//     searchedCountries,
//     cachedContinentCountries,
//     selectedContinent,
//     selectedContinentCountries,
//   ],
//   ([
//     $activeSearch,
//     $searchedCountries,
//     $cachedContinentCountries,
//     $selectedContinent,
//     $selectedContinentCountries,
//   ]) => {
//     return $activeSearch
//       ? $searchedCountries
//       : $cachedContinentCountries[$selectedContinent] ??
//           $selectedContinentCountries;
//   }
// );

// $: activeData = $activeSearch
//   ? searchedCountryData
//   : cachedContinentData[$selectedContinent] ?? selectedContinentData

// $: activeCountries = $activeSearch
//   ? searchedCountries
//   : cachedContinentCountries[$selectedContinent] ?? selectedContinentCountries

// alt
// export const activeData = derived([data], ([$data]) => {
//   group(
//     $data.filter((d) => {
//       return d.country === '';
//     }),
//     (d) => d.country
//   );
// });

// export const activeCountries = writable([]);

//         activeData = group(
//   $data.filter(d => {
//   return d.country === ""
// }), d => d.country)

//   activeCountries = []

// export const activeData = writable();

// export const activeCountries = writable(['test1', 'test2']);

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
