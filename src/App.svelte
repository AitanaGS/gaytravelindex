<script>
  import data from "../data/processed/GTI_2012-2021.json";
  import Map from "./lib/components/Map.svelte"
  import Heatmap from "./lib/components/Heatmap.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import { clickedCountry } from "./lib/stores/clickedCountry"
  import { clickedContinent } from "./lib/stores/clickedContinent";
  // import { bodyFontSize } from "./lib/stores/responsiveFontSize";
  // import { windowWidth } from "./lib/stores/responsiveFontSize";
  import { width, height, chartWidth, chartGap, desktopBreakpoint } from "./lib/stores/dimensions"; // , mapWidth, continentWidth, countryWidth 
  // import { isDesktop, isMobile, isTablet } from "./lib/stores/devices";
  // import { bodyFontSizeScale } from "./lib/utils/fontSizeScales";
  // import { windowWidth } from "./lib/stores/windowWidth";

  import { onMount, afterUpdate } from "svelte"
  import { scaleDiverging } from "d3-scale"
  import { max, min, group } from "d3-array"
  import { interpolateRdYlBu, schemeRdYlBu } from "d3-scale-chromatic"


  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }



  // onMount(() => {

  //   // const setCurrentWindowWidth = () => width.set(window.innerWidth)
  //   // const setCurrentWindowWidth = () => width.set(window.innerWidth)

  //   // const setCurrentWindowWidth = () => $width

  //   const getDevice = () => {
  //     isMobile.set($width)
  //   }

  //   window.addEventListener('resize', setCurrentWindowWidth)

  //   return () => {
  //     window.removeEventListener("resize", setCurrentWindowWidth)
  //   }

  // })

  // let top

  // afterUpdate(() => {
  //   // top.scrollIntoView()
  //   window.scrollTo(0, 0)

  // })


// $:if (width) {

//   continentWidth = ($width - chartGap) / 2

//   countryWidth = ($width - chartGap) / 2

//   mapWidth = $width * 0.75

// }

  // onMount(() => {
  //   continentWidth = ($width - chartGap) / 2

  //   countryWidth = ($width - chartGap) / 2

  //   mapWidth = $width * 0.75

  // })


  // $: console.log($width, $bodyFontSize)


  
  // let chartGap = 10


// let continentWidth
// let countryWidth
// let mapWidth


  //  $: continentWidth = ($width - $chartGap) / 2

  //  $: countryWidth = ($width - $chartGap) / 2

   // aspect ratio
   $: mapWidth = 800  //800
   $: mapHeight = 400 //400

  //  $: chartGap = $isDesktop
  //   ? 30
  //   : $isTablet
  //     ? 20
  //     : 10

  //  $: continentWidth = $isDesktop
  //     ? ($width - chartGap) / 2
  //     : $width * 0.8

  //   $: countryWidth = $isDesktop
  //     ? ($width - chartGap) / 2
  //     : $width * 0.8

  // $continentWidth = $isDesktop
  //     ? ($width - chartGap) / 2
  //     : $width * 0.8

  // $countryWidth = $isDesktop
  //     ? ($width - chartGap) / 2
  //     : $width * 0.8

  // $: console.log("width", $width)
  // $: console.log("fontsize", $bodyFontSize)
  // $: console.log("destop", $isDesktop)
  // $: console.log("tablet", $isTablet)
  // $: console.log("mobile", $isMobile)


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


  let countryView

  function scrollToCountryView() {
    countryView.scrollIntoView();
  }

  let continentView

  function scrollToContinentView() {
    continentView.scrollIntoView()
  }

  // TODO: bandwidth of different continents

  // TODO: tabindex in continentheatmap, indicatorchart, indicatortooltip, etc.

  // TODO: transition button visibility, check https://github.com/sveltejs/svelte/issues/6336

  // TODO motion sensitivity check

  // TODO accessibility check

  // TODO check if click on continentheatmap only on axis or also 2021 or all heatmap (confusing, because might expect profile from respective year)

  // TODO check data

  // TODO Axis component

  // TODO check if first values for width and innerHeight necessary

  // TODO data2021 u.ä. vorher in r oder in js

  // TODO siehe button onclick

  // TODO smooth scroll

  // TODO map tooltip exit transition

  // TODO map multiple clicks (also on heatmap?)

  // TODO check if multiple fontSizes necessary

  // TODO check if initial width 0 error ok and mapwidth if condition

  // TODO maptooltip after scrolling and reload

  // TODO check body font size, at least 16, maybe more, doesnt have to be responsive, devices handle this, but check for buttons (select already defined, see below)

  // TODO check tooltip position after resizing window

  // TODO check wo h1 in App.svelte

  // let chartSelection

  // function scrollToChartSelection() {
	// 	chartSelection.scrollIntoView();
	// }

  // let width

  // $: width = 1200

  // $width = window.innerWidth


  // $: continentWidth = ($width - chartGap) / 2

  // $: countryWidth = ($width - chartGap) / 2

  // $: mapWidth = $width * 0.75



  // let innerHeight = 500
  
  // let outerHeight

  // $: mapHeight = 0.5 * height

  // $: mapHeight = 0.7 * innerHeight

  // $: mapHeight = width <= 800 ? 400 : 400

  // $: console.log(innerHeight, mapHeight)


</script>

<!-- <svelte:window bind:innerHeight/> -->
<!-- <main style="--bodyFontSize: {$bodyFontSize}px;"     
> -->
<main
bind:clientWidth={$width}
bind:clientHeight={$height}
>
  <h1>Gay Travel Index 2021</h1>
  <div 
    class="wrapper" 
    >
    <!-- style="--width: {$width}px;" -->
    <!-- bind:clientHeight={$height} bind:clientWidth={$width} -->
    
    <div class="topWrapper">
      <div class="intro">
        <!-- <h1>Gay Travel Index 2021</h1> -->
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
        {#if mapWidth > 0}
        <Map {mapWidth} {mapHeight} {totalScale} on:countryClick={scrollToCountryView}/>
        <!-- on:countryClick={handleCountryClick}  -->
        {/if}
      </div>

    </div>

    <!-- <div class="selectContinentCountryWrapper" > -->
      <!-- bind:this={chartSelection} -->
      <div class="selectContinentWrapper" bind:this={continentView}>

        <p class="selectContinent">
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
      </select> and click on a country for more information.
    </p>
      </div>
      <!-- <div class="selectCountryWrapper"> -->

        <!-- <p>and click on a country for more information.</p> -->
        <!-- <button
          class="countryButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
          on:click={() => {
            // selectedCountry = ""
            clickedCountry.set("")
            // hoveredCountryYear = null // TODO: check if necessary (after refactor handleHeatmapHover to ContinentHeatmap)
            // scrollToTop() // here scrolling
          }}
          >Clear Country</button> -->
      <!-- </div> -->
        
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
    <!-- </div> -->

    <div class="chartWrapper" style="--gap: {$chartGap}px;">
        
        <div class="continentChartWrapper"> 
          <!-- bind:clientWidth={width} -->
          <!-- <svg {width} {height}> -->
        
            <!-- {#if !selectedCountry && selectedContinent}
            <Heatmap on:countryClick={handleCountryClick} {totalScale} width={continentWidth} {data} {years} {selectedContinent} {selectedCountry} />
            {/if}
             -->
             <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
              sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
              sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
             </p>
             <Heatmap on:countryClick={scrollToCountryView} {totalScale}  {data} {years} {selectedContinent} {selectedCountry} />
             
             <!-- on:countryClick={handleCountryClick}   width={$continentWidth} -->


      </div>
        

    <div class="countryChartWrapper" bind:this={countryView}> 
      <!-- bind:clientWidth={width} -->
      <!-- <svg {width} {height}> -->
    
      <!-- {#if selectedCountry}
    
        <IndicatorsChart width={countryWidth} {data} {selectedCountry} {years}/>
    
      {/if} -->

      <div class="countryInfo">
        <p>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, 
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, 
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </p>
        <button
        class="countryButton {selectedCountry ? "visibleButton" : "hiddenButton"}"
        on:click={() => {
          // selectedCountry = ""
          clickedCountry.set("")
          scrollToContinentView()
          // hoveredCountryYear = null // TODO: check if necessary (after refactor handleHeatmapHover to ContinentHeatmap)
          // scrollToTop() // here scrolling
        }}
        >Clear Country</button>
      </div>
      <IndicatorsChart {data} {years}/>
      <!-- {selectedCountry} width={$countryWidth} --> 
    </div>


    </div>


  </div>


</main>

<style>

  main {
    padding: 40px;
  }

  /* p {
    line-height: 1.5;
  } */

  .wrapper {
    /* width: var(--width); */
    position: relative;
  }

  .topWrapper {
    display: flex;
    margin-bottom: 20px;
    /* flex-direction: column; */
  }

  .intro {
    flex: 1;
  }

  .mapWrapper {
    flex: 2;
  }

  h1 {
  /* font-size: 2rem; */
  line-height: 1.3;
  margin: 0;
  font-size: clamp(1.5rem, 2vw + 1.5rem, 2.2rem);
  min-height: 0vh;
}

/* .introText {
  font-size: 1rem;
  line-height: 1.5;

} */

  /* .selectContinentCountryWrapper { */
    /* position: absolute;
    left: 100; */
    /* position: absolute; */
    /* left: 210px; */
    /* margin-bottom: 20px; */
    /* display: flex; */
    /* flex-direction: column;
    align-items: flex-start;  */
    /* justify-content: flex-start;
     align-items: baseline; */
    /* justify-content: baseline; */
    /* gap: 10px; */
    /* font-size: var(--bodyFontSize); */
  /* } */

  /* @media (max-width: 1100px){
    .selectContinentCountryWrapper {
      flex-direction: column;
      gap: 0px;
    }
  } */

  /* select {
    font-size: var(--bodyFontSize);
  } */

  .selectContinentWrapper {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    /* flex: 1; */
  }

  /* .selectCountryWrapper { */
    /* display: flex; */
    /* gap: 20px; */
    /* flex: 1; */
  /* } */

  /* @media (max-width: 1100px){
    .selectCountryWrapper {
      gap: 2px;
    }
  } */

  select {
    font-size: 1rem;
  }

  .chartWrapper {
    display: flex;
    gap: var(--gap);
    flex-wrap: wrap;

  }

  /* @media (max-width: 1100px){
    .chartWrapper {
      flex-direction: column;
    }
  } */


  .continentChartWrapper {
    flex: 1;
  }

  .countryChartWrapper {
    flex: 1;
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
  /* font-size: var(--bodyFontSize); */
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (max-width: 1100px){
    .topWrapper {
      flex-direction: column;
    }

    .mapWrapper {
      margin-top: 10px;
    }

    .intro {
      display: flex;
      justify-content: center;
    }

    /* .selectContinentCountryWrapper {
      flex-direction: column;
      gap: 0px;
    } */

    /* .selectCountryWrapper {
      gap: 2px;
    } */

    .chartWrapper {
      flex-direction: column;
      /* align-items: center; */
    }

    p {
      max-width: 600px;
      margin: 0 auto;
      padding: 10px 0;
      /* padding-top: 10px; */
    }

    .selectContinentWrapper {
      max-width: 600px;
      margin: 0 auto;
      /* display: flex;
      justify-content: center; */
      padding: 20px 0;
    }

    h1 {
      text-align: center;
      margin-bottom: 10px;
    }

    .countryInfo {
      max-width: 600px;
      margin: 0 auto;
    }
  }


  /* https://stackoverflow.com/questions/30855985/pure-css-animation-visibility-with-delay */
</style>
