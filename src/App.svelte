<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import ContinentHeatmap from "./lib/components/ContinentHeatmap.svelte"
  import { scaleBand, scaleSequential } from "d3-scale"
  import { extent } from "d3-array"
  import { interpolateRdBu, interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"
  // import AxisYears from "./lib/components/AxisYears.svelte"
  // import AxisCountries from "./lib/components/AxisCountries.svelte"



  const continents = [... new Set(data.map(d => d.continent))].sort()

  const years = [... new Set(data.map(d => d.year))].sort()

  // get indicators of a 2021 country (in former years there where fewer indicators)
  let indicators = Object.keys(data.filter(d => d.year == 2021)[0])
    .filter(key => key !== "country" && key != 'continent' && key != 'ranking' && key !='year')
  // ggfs remove 'total'

  let selectedContinent

  $: selectedContinentCountries = [... new Set(
    data
      .filter(d => d.continent == selectedContinent)
      .filter(d => d.year === 2021)
      .sort((a, b) => b.ranking - a.ranking ||  b.country.localeCompare(a.country) )
      //.sort((a, b) => b.ranking - a.ranking)  // data.sort((a, b) => a.city.localeCompare(b.city) || b.price - a.price);
      .map(d => d.country)
      )]

   //$: console.log(selectedContinentCountries)


  let width = 700

  $: height = selectedContinentCountries.length * 50 //?

  const margin = {
    top: 20,
    right: 10,
    bottom: 60,
    left: 200
  }

  $: innerWidth = width - margin.left - margin.right
  $: innerHeight = height - margin.top - margin.bottom

  $: yearScale = scaleBand()
    .domain(years)
    .range([0, innerWidth])
    .padding(0.05)


  $: countryScale = scaleBand()
    .domain(selectedContinentCountries)
    .range([innerHeight, 0])
    .padding(0.05)

  const totalScale = scaleSequential(interpolateRdYlBu) // interpolateRdYlBu  // schemeRdYlBu
    .domain(extent(data.map(d => d.total)))

    
  $: selectedData = data.filter(d => d.continent === selectedContinent).filter(d => selectedContinentCountries.includes(d.country) )




</script>

<main>

  <label for="continent-select">Choose a continent:</label>

<select name="continents" id="continent-select" bind:value={selectedContinent}>
    <option value="">--Please choose a continent--</option>
    {#each continents as continent}
      <option value={continent}>{continent}</option>
    {/each}
</select>
{#if selectedContinent}
  <p>{selectedContinent}</p>
{/if}

<div class="chartWrapper" bind:clientWidth={width}>
  <svg {width} {height}>
    <ContinentHeatmap {selectedData} {yearScale} {countryScale} {totalScale} {margin}/>
  
  </svg>
</div>

</main>

<style>

</style>
