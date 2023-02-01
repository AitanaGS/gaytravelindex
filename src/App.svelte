<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import ContinentHeatmap from "./lib/components/ContinentHeatmap.svelte"
  // import Tooltip from "./lib/components/Tooltip.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import { scaleBand, scaleSequential } from "d3-scale"
  import { extent, max, min, group } from "d3-array"
  import { interpolateRdBu, interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"
  // import { tidy, pivotLonger, pivotWider } from '@tidyjs/tidy'
  import { fly, slide, fade } from "svelte/transition"


  const continents = [... new Set(data.map(d => d.continent))].sort()

  let selectedContinent
  
  let selectedCountry = ""

  const handleClick = (e, country) => {
    selectedCountry = country
    scrollToTop()
  }

  let hoveredCountryYear

  const handleHover = (e, d) => {
      hoveredCountryYear = d
  }


  // const scrollIntoView = (node) => {
  //       node.scrollIntoView()
  //   }


$: console.log(selectedContinent)
  // TODO: scroll up, check with map

  // TODO: bandwidth of different continents

  // TODO: tabindex in continentheatmap

  // TODO: transition button visibility, check https://github.com/sveltejs/svelte/issues/6336

  // TODO motion sensitivity check

  // TODO accessibility check

  // TODO check if click on continentheatmap only on axis or also 2021 or all heatmap (confusing, because might expect profile from respective year)

  let top

  function scrollToTop() {
		top.scrollIntoView();
	}

  let width = 800


</script>

<main>

  <div class="wrapper" bind:clientWidth={width} style="--width: {width}px;">

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
        hoveredCountryYear = null
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
        <ContinentHeatmap {width} {data} {selectedContinent} {selectedCountry} {handleClick} {handleHover} {hoveredCountryYear}/>
        {/if}
      
        
      {#if selectedCountry}
    
        <IndicatorsChart {width} {data} {selectedCountry}/>
    
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
