<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import Map from "./lib/components/Map.svelte"
  import Heatmap from "./lib/components/Heatmap.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import { clickedCountry } from "./lib/stores/clickedCountry"
  import { clickedContinent } from "./lib/stores/clickedContinent";

  import { scaleBand, scaleSequential, scaleDiverging } from "d3-scale"
  import { extent, max, min, group } from "d3-array"
  import { interpolateRdBu, interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"
  // import { tidy, pivotLonger, pivotWider } from '@tidyjs/tidy'
  import { fly, slide, fade } from "svelte/transition"

  const continents = [... new Set(data.map(d => d.continent))].sort()

  const years = [... new Set(data.map(d => d.year))].sort()

  let selectedContinent = ""

  let selectedCountry = ""

  clickedCountry.subscribe(country => {
    selectedCountry = country
  })

  clickedContinent.subscribe(continent => {
    selectedContinent = continent
  })


  const totalScale = scaleDiverging(interpolateRdYlBu)
    .domain([min(data, d => d.total), 0, max(data, d => d.total)])

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

  // TODO smooth scroll

  // TODO country click as store

  // TODO map tooltip exit transition

  // TODO map tooltip position

  // TODO map multiple clicks (also on heatmap?)


  let chartSelection

  function scrollToChartSelection() {
		chartSelection.scrollIntoView();
	}

  let width

  $: width = 1200

  let chartGap = 10

  $: continentWidth = (width - chartGap) / 2

  $: countryWidth = (width - chartGap) / 2

  $: mapWidth = width * 0.75




  // let innerHeight = 500
  
  // let outerHeight

  // $: mapHeight = 0.5 * height

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
    style="--width: {width}px;"
    >
    <div class="topWrapper">
      <div class="intro">

        <h1>Gay Travel Index 2021</h1>

        <p class="introText">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor 
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. 
        </p>
      </div>
  
      <div class="mapWrapper">
        <Map {mapWidth} {mapHeight} {totalScale} on:countryClick={scrollToChartSelection}/>
        <!-- on:countryClick={handleCountryClick}  -->
      </div>

    </div>

    <div class="selectContinentCountryWrapper" bind:this={chartSelection}>
      <div class="selectContinentWrapper">

        <label for="continent-select">Choose a continent</label>

        <!-- <select 
          name="continents" 
          id="continent-select" 
          bind:value={$clickedContinent}
          on:change={() => selectedCountry = ''}>
            <option value="Overview">Overview</option>
            {#each continents as continent}
              <option value={continent}>{continent}</option>
            {/each}
        </select> -->
        <!-- bind:value={selectedContinent} -->
        <select 
        name="continents" 
        id="continent-select" 
        bind:value={$clickedContinent}
        on:change={() => clickedCountry.set("")}>
          <option value="All">All</option>
          {#each continents as continent}
            <option value={continent}>{continent}</option>
          {/each}
      </select>
      </div>
      <div class="selectCountryWrapper">

        <p>and click on a country for more information.</p>
        <button
          class="countryButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
          on:click={() => {
            // selectedCountry = ""
            clickedCountry.set("")
            // hoveredCountryYear = null // TODO: check if necessary (after refactor handleHeatmapHover to ContinentHeatmap)
            // scrollToTop() // here scrolling
          }}
          >Clear Country</button>
      </div>
        
        <!-- <button
          class="continentButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
          on:click={() => {
            selectedCountry = ""
            // hoveredCountryYear = null // TODO: check if necessary (after refactor handleHeatmapHover to ContinentHeatmap)
            // scrollToTop() // here scrolling
          }}
          >Back to {selectedContinent}</button> -->

            <!--
                style="visibility: {selectedCountry ? "visible" : "hidden"}"
                style="visibility: {selectedCountry ? "visible" : "hidden"}"
                in:slide={{ duration: 400}}
        out:slide={{ duration: 300}} 
        class="continentButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
        style="opacity: {selectedCountry ? "1" : "0"}"
        
             -->
    </div>

    <div class="chartWrapper" style="--gap: {chartGap}px;">
        
        <div class="continentChartWrapper"> 
          <!-- bind:clientWidth={width} -->
          <!-- <svg {width} {height}> -->
        
            <!-- {#if !selectedCountry && selectedContinent}
            <Heatmap on:countryClick={handleCountryClick} {totalScale} width={continentWidth} {data} {years} {selectedContinent} {selectedCountry} />
            {/if}
             -->
             <Heatmap {totalScale} width={continentWidth} {data} {years} {selectedContinent} {selectedCountry} on:countryClick={scrollToChartSelection}  />
             
             <!-- on:countryClick={handleCountryClick}  -->


      </div>
        

    <div class="countryChartWrapper"> 
      <!-- bind:clientWidth={width} -->
      <!-- <svg {width} {height}> -->
    
      <!-- {#if selectedCountry}
    
        <IndicatorsChart width={countryWidth} {data} {selectedCountry} {years}/>
    
      {/if} -->

    
      <IndicatorsChart width={countryWidth} {data} {years}/>
      <!-- {selectedCountry} -->
    </div>


    </div>


  </div>


</main>

<style>

  /* main {
    margin: 10 10 10 40;
  } */
  main {
    padding: 40px;
  }

  .wrapper {
    width: var(--width);
    position: relative;
  }

  .topWrapper {
    display: flex;
    margin-bottom: 20px;
  }

  h1 {
  font-size: 1.7rem;
  line-height: 1.5;
  margin: 0;
}

.introText {
  font-size: 1rem;
  line-height: 1.5;

}

  .selectContinentCountryWrapper {
    /* position: absolute;
    left: 100; */
    /* position: absolute; */
    /* left: 210px; */
    /* margin-bottom: 20px; */
    display: flex;
    /* flex-direction: column;
    align-items: flex-start;  */
    justify-content: flex-start;
     align-items: baseline;
    /* justify-content: baseline; */
    gap: 10px;
  }

  .selectContinentWrapper {
    display: flex;
    gap: 10px;
  }

  .selectCountryWrapper {
    display: flex;
    gap: 20px;
  }

  .chartWrapper {
    display: flex;
    gap: var(--gap);

  }

  .continentChartWrapper {
    position: relative;
    /* margin-top: 20px; */
  }

  .countryChartWrapper {
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
    /* transition: visibility 0s linear 0s, opacity 300ms; */
    /* transition: all 2000ms ease; */

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
    /* transition: visibility 0s linear 300ms, opacity 300ms; */
    /* transition: all 2000ms ease; */

    /* 
      visibility cannot be transitioned, because its 0/1
      https://stackoverflow.com/questions/27900053/css-transition-with-visibility-not-working
    */
 } 

 .countryButton {
  border-radius: 5px;
  border: 1px solid transparent;
  /* padding: 0.6em 1.2em; */
  padding: 0px 20px;
  font-size: 0.9rem;
  font-weight: 400;
  font-family: inherit;
  /* background-color: #1a1a1a; */
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}


  /* https://stackoverflow.com/questions/30855985/pure-css-animation-visibility-with-delay */
</style>
