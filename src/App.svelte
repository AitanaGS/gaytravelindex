<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import Map from "./lib/components/Map.svelte"
  import Heatmap from "./lib/components/Heatmap.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import { scaleBand, scaleSequential, scaleDiverging } from "d3-scale"
  import { extent, max, min, group } from "d3-array"
  import { interpolateRdBu, interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"
  // import { tidy, pivotLonger, pivotWider } from '@tidyjs/tidy'
  import { fly, slide, fade } from "svelte/transition"


  const continents = [... new Set(data.map(d => d.continent))].sort()

  const years = [... new Set(data.map(d => d.year))].sort()

  let selectedContinent
  
  let selectedCountry = ""

  const handleCountryClick = (event) => {
    selectedCountry = event.detail.country
    selectedContinent = event.detail.continent
    scrollToTop()
  }


  const totalScale = scaleDiverging(interpolateRdYlBu)
    .domain([min(data, d => d.total), 0, max(data, d => d.total)])


  // const scrollIntoView = (node) => {
  //       node.scrollIntoView()
  //   }


  // TODO: scroll up, check with map

  // TODO: bandwidth of different continents

  // TODO: tabindex in continentheatmap, indicatorchart, indicatortooltip, etc.

  // TODO: transition button visibility, check https://github.com/sveltejs/svelte/issues/6336

  // TODO motion sensitivity check

  // TODO accessibility check

  // TODO check if click on continentheatmap only on axis or also 2021 or all heatmap (confusing, because might expect profile from respective year)

  // TODO color scale manuell setzen (mittelpunkt)

  // TODO check data

  // TODO Tooltip component

  // TODO Axis component

  // TODO check if first values for width and innerHeight necessary

  // TODO responsive Map

  // TODO data2021 u.ä. vorher in r oder in js

  // TODO siehe button onclick


  let top

  function scrollToTop() {
		top.scrollIntoView();
	}

  let width = 1200


  // let innerHeight = 500
  
  // let outerHeight

  // $: mapHeight = 0.5 * height

  // $: console.log(height, mapHeight)

  // $: console.log(innerHeight)

  // $: mapHeight = 0.7 * innerHeight

  // $: mapHeight = width <= 800 ? 400 : 400
  $: mapHeight = 400

  // $: console.log(innerHeight, mapHeight)


</script>

<!-- <svelte:window bind:innerHeight/> -->

<main>

  <div 
    class="wrapper" 
    bind:clientWidth={width} 
    style="--width: {width}px;">

    <div class="mapWrapper">
      <Map on:countryClick={handleCountryClick} {width} {mapHeight} {totalScale}/>
    </div>

    <label for="continent-select" bind:this={top}>Choose a continent:</label>

    <select 
      name="continents" 
      id="continent-select" 
      bind:value={selectedContinent}
      on:change={() => selectedCountry = ''}>
        <option value="Overview">Overview</option>
        {#each continents as continent}
          <option value={continent}>{continent}</option>
        {/each}
    </select>
    
    <button
      class="continentButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
      on:click={() => {
        selectedCountry = ""
        // hoveredCountryYear = null // TODO: check if necessary (after refactor handleHeatmapHover to ContinentHeatmap)
        scrollToTop()
      }}
      >Back to {selectedContinent}</button>
        <!--
            style="visibility: {selectedCountry ? "visible" : "hidden"}"
            style="visibility: {selectedCountry ? "visible" : "hidden"}"
            in:slide={{ duration: 400}}
    out:slide={{ duration: 300}} 
    class="continentButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
    style="opacity: {selectedCountry ? "1" : "0"}"
    
         -->
    
    <div class="chartWrapper"> 
      <!-- bind:clientWidth={width} -->
      <!-- <svg {width} {height}> -->
    
        {#if !selectedCountry && selectedContinent}
        <Heatmap on:countryClick={handleCountryClick} {totalScale} {width} {data} {years} {selectedContinent} {selectedCountry} />
        {/if}
        
      {#if selectedCountry}
    
        <IndicatorsChart {width} {data} {selectedCountry} {years}/>
    
      {/if}
    
    </div>

  </div>


</main>

<style>
  .wrapper {
    width: var(--width);
  }

  .chartWrapper {
    position: relative;
  }

/* .continentButton { */
    /* transition: visibility 100ms ease ; */

  /* } */


  .visibleButton {
    /* visibility: visible; */
    /* transition: visibility 200ms ease; */
    /* opacity: 1;
    transition: opacity 100ms ease-in; */

    visibility: visible;
    opacity: 1;
    transition: visibility 0s linear 0s, opacity 300ms;

      /* visibility cannot be transitioned, because its 0/1
      https://stackoverflow.com/questions/27900053/css-transition-with-visibility-not-working
    */

 } 

 .hiddenButton {
    /* visibility: hidden; */
    /* transition: visibility 100ms ease; */
    /* opacity: 0;
    transition: opacity 100ms ease-out; */

    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 300ms, opacity 300ms;

    /* 
      visibility cannot be transitioned, because its 0/1
      https://stackoverflow.com/questions/27900053/css-transition-with-visibility-not-working
    */
 } 


  /* https://stackoverflow.com/questions/30855985/pure-css-animation-visibility-with-delay */
</style>
