<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import ContinentHeatmap from "./lib/components/ContinentHeatmap.svelte"
  import CountryHeatmap from "./lib/components/CountryHeatmap.svelte"
  import Tooltip from "./lib/components/Tooltip.svelte"
  import { scaleBand, scaleSequential } from "d3-scale"
  import { extent, max, min } from "d3-array"
  import { interpolateRdBu, interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"
  import { tidy, pivotLonger } from '@tidyjs/tidy'
  // import AxisYears from "./lib/components/AxisYears.svelte"
  // import AxisCountries from "./lib/components/AxisCountries.svelte"


  // TODO: check data calculations, when


  const continents = [... new Set(data.map(d => d.continent))].sort()

  const years = [... new Set(data.map(d => d.year))].sort()

  // get indicators of a 2021 country (in former years there where fewer indicators)
  // const indicators = Object.keys(data.filter(d => d.year == 2021)[0])
  //   .filter(key => key !== "country" && key != 'continent' && key != 'ranking' && key !='year' && key !='total')

  const indicatorLabels = [
    "Antidiscrimination Legislation",
    "Marriage / Civil Partnership",
    "Adoption Allowed",
    "Transgender Rights",
    "Intersex / 3rd Option",
    "Equal Age of Consent",
    "'Conversion Therapy'",
    "LGBT Marketing",
    "Religious Influence",
    "HIV Travel Restrictions",
    "Anti-Gay Laws",
    "Homosexuality Illegal",
    "Pride Banned",
    "Locals Hostile",
    "Prosecution",
    "Murders",
    "Death Sentence"
  ]

  const camelize = (str) => str.toLowerCase().replaceAll("'", '').replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

  const indicatorVariables = indicatorLabels.map(label => label === "Intersex / 3rd Option" ? label = "intersex3RdOption"
                                                      : label ===  "Transgender Rights" ? label = "transGenderRights" 
                                                      : camelize(label))
  // console.log(indicatorVariables)

  const indicatorLabelsLookup = new Map()

  indicatorLabels.forEach((label, i) => {
    indicatorLabelsLookup.set(indicatorVariables[i], label)
  })




  indicatorLabelsLookup.set("antidiscrimination Legislation", "Antidiscrimination Legislation")


  let selectedContinent

  $: selectedContinentCountries = [... new Set(
    data
      .filter(d => d.continent == selectedContinent)
      .filter(d => d.year === 2021)
      .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      .map(d => d.country)
      )]

  //  $: console.log(selectedContinentCountries)


  let width = 650

  // $: height = selectedCountry ? indicatorVariables.length * 55 : selectedContinentCountries.length * 
  
  $: height = selectedCountry ? indicatorVariables.length * 55 : selectedContinentCountries.length * 30

  const margin = {
    top: 55,
    right: 10,
    bottom: 60,
    left: 220
  }

  $: innerWidth = width - margin.left - margin.right
  $: innerHeight = height - margin.top - margin.bottom

  // $: yearScale = scaleBand()
  //   .domain(years)
  //   .range([0, innerWidth])
  //   .padding(0.1)
  $: yearScale = scaleBand()
    .domain(years)
    .range([0, innerWidth])
    .padding(0.05)


  // $: countryScale = scaleBand()
  //   .domain(selectedContinentCountries)
  //   .range([0, innerHeight])
  //   .paddingInner(0.1)
  //   .paddingOuter(0.2)

  $: countryScale = scaleBand()
    .domain(selectedContinentCountries)
    .range([0, innerHeight])
    .paddingInner(0.05)
    .paddingOuter(0.3)

    const dataLonger = tidy(data, pivotLonger({
      cols: indicatorVariables,
      namesTo: 'indicator',
      valuesTo: 'value'
    }))


  $: indicatorScale = scaleBand()
    .domain(indicatorVariables)
    .range([0, innerHeight])
    .paddingInner(0.1)
    .paddingOuter(0.2)

   //$: console.log(indicatorScale.domain())

  const totalScale = scaleSequential(interpolateRdYlBu) // interpolateRdYlBu  // schemeRdYlBu
    .domain(extent(data.map(d => d.total)))

  const indicatorValueScale = scaleSequential(interpolateRdYlBu)
    .domain(extent(dataLonger.map(d => d.value)))
    // TODO: check if there is another potential max value (3 instead of 2?)

    
  $: selectedContinentData = data.filter(d => d.continent === selectedContinent).filter(d => selectedContinentCountries.includes(d.country) )
    // TODO: check if last filter necessary


  // $: console.log(selectedContinentData)
  
  let selectedCountry = ""

  $: selectedCountryData = dataLonger.filter(d => d.country == selectedCountry).filter(d => d.value !== undefined)

  // $: console.log(selectedCountryData)

  const handleClick = (e, country) => {
    // console.log(e)
    // console.log(country)
    selectedCountry = country
    //console.log(selectedCountry)
  }

  // TODO: scroll up

  // TODO: Transition Heatmap

  let hoveredCountryYear
    $: console.log(hoveredCountryYear)

    const handleHover = (e, d) => {
      hoveredCountryYear = d
    }


</script>

<main>

  <label for="continent-select">Choose a continent:</label>

<select 
  name="continents" 
  id="continent-select" 
  bind:value={selectedContinent}
  on:change={() => selectedCountry = ''}>
    <option value="">Overview</option>
    {#each continents as continent}
      <option value={continent}>{continent}</option>
    {/each}
</select>

{#if selectedCountry}
<button
  on:click={() => selectedCountry = ""}
  >Back to {selectedContinent}</button>
{/if}

<div class="chartWrapper" bind:clientWidth={width}>
  <svg {width} {height}>

    {#if !selectedCountry}
    <ContinentHeatmap {selectedContinent} {selectedContinentData} {yearScale} {countryScale} {totalScale} {width} {margin} {innerWidth} {handleClick} {handleHover} {hoveredCountryYear}/>
    {/if}
  
    
  {#if selectedCountry}
  <!-- <text x=100 y=100>{selectedCountry}</text> -->
  <CountryHeatmap {selectedCountry} {selectedCountryData} {yearScale} {indicatorScale} {indicatorValueScale} {indicatorVariables} {indicatorLabelsLookup} {width} {margin} />
  {/if}
  </svg>
    {#if hoveredCountryYear && !selectedCountry}
    <Tooltip data={hoveredCountryYear} {yearScale} {countryScale} {totalScale} {margin} {innerWidth}/>
    {/if}

</div>

</main>

<style>
  .chartWrapper {
    position: relative;
  }
</style>
