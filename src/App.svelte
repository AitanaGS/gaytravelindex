<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import ContinentHeatmap from "./lib/components/ContinentHeatmap.svelte"
  import CountryHeatmap from "./lib/components/CountryHeatmap.svelte"
  import Tooltip from "./lib/components/Tooltip.svelte"
  import { scaleBand, scaleSequential } from "d3-scale"
  import { extent, max, min, group } from "d3-array"
  import { interpolateRdBu, interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"
  import { tidy, pivotLonger, pivotWider } from '@tidyjs/tidy'
  import { fly, slide, fade } from "svelte/transition"


  const continents = [... new Set(data.map(d => d.continent))].sort()

  const years = [... new Set(data.map(d => d.year))].sort()

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

  const indicatorLabelsLookup = new Map()

  indicatorLabels.forEach((label, i) => {
    indicatorLabelsLookup.set(indicatorVariables[i], label)
  })




  indicatorLabelsLookup.set("antidiscrimination Legislation", "Antidiscrimination Legislation")


  let selectedContinent

  $: selectedContinentCountries = [... new Set(
    data
      .filter(d => d.continent == selectedContinent)
      // .filter(d => {
      //   if (selectedContinent === "Overview") return true
      //   else return d.continent === selectedContinent
      // })
      .filter(d => d.year === 2021)
      .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      .map(d => d.country)
      )]


  $: console.log("array", selectedContinentCountries)


  let width = 650

  $: countryBandHeight = max([450,  selectedContinentCountries.length * 30])
  
  $: height = selectedCountry ? indicatorVariables.length * 55 : countryBandHeight

  const margin = {
    top: 55,
    right: 10,
    bottom: 60,
    left: 220
  }

  $: innerWidth = width - margin.left - margin.right
  $: innerHeight = height - margin.top - margin.bottom

  $: yearScale = scaleBand()
    .domain(years)
    .range([0, innerWidth])
    .padding(0.05)
    .paddingOuter(0.1)

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


  const totalScale = scaleSequential(interpolateRdYlBu)
    .domain(extent(data.map(d => d.total)))

  const indicatorValueScale = scaleSequential(interpolateRdYlBu)
    .domain(extent(dataLonger.map(d => d.value)))
    // TODO: check if there is another potential max value (3 instead of 2?)


  $: selectedContinentData = group(
    // data.filter(d => {
    //   if (selectedContinent === "Overview") return true
    //   else return d.continent === selectedContinent
    // })
    data
      .filter(d => d.continent === selectedContinent)
      .sort((a, b) => {
        if(a.year !== 2021) return 1;
        else if(b.year !== 2021) return -1;
        else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
      }), d => d.country) 

  
  let selectedCountry = ""

  $: selectedCountryData = dataLonger.filter(d => d.country == selectedCountry).filter(d => d.value !== undefined)

  const handleClick = (e, country) => {
    selectedCountry = country
  }

  let hoveredCountryYear

  const handleHover = (e, d) => {
      hoveredCountryYear = d
  }

  // TODO: scroll up

  // TODO: bandwidth of different continents

  // TODO: tabindex in continentheatmap


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

<button
  on:click={() => {
    selectedCountry = ""
    hoveredCountryYear = null
  }}
  in:slide={{ duration: 400}}
  out:slide={{ duration: 300}}
  style="visibility: {selectedCountry ? "visible" : "hidden"}"
  >Back to {selectedContinent}</button>

<div class="chartWrapper" bind:clientWidth={width}>
  <svg {width} {height}>

    {#if !selectedCountry && selectedContinent}
    <ContinentHeatmap {selectedContinent} {selectedContinentData} {yearScale} {countryScale} {totalScale} {innerWidth} {margin} {handleClick} {handleHover} {hoveredCountryYear}/>
    {/if}
  
    
  {#if selectedCountry}

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
