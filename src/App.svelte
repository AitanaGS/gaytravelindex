<script>
  // import data from "../data/processed/GTI_2012-2021.json";
  import { data } from "./lib/stores/data.js"
  import Map from "./lib/components/Map.svelte"
  import Heatmap from "./lib/components/Heatmap.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import { selectedCountry } from "./lib/stores/selectedCountry"
  import { selectedContinent } from "./lib/stores/selectedContinent";
  // import { bodyFontSize } from "./lib/stores/responsiveFontSize";
  // import { windowWidth } from "./lib/stores/responsiveFontSize";
  import { width, height, desktopBreakpoint, isDesktop, isTablet, isMobile, isSmallMobile } from "./lib/stores/dimensions"; // , mapWidth, continentWidth, countryWidth 
  // import { isDesktop, isMobile, isTablet } from "./lib/stores/devices";
  // import { bodyFontSizeScale } from "./lib/utils/fontSizeScales";
  // import { windowWidth } from "./lib/stores/windowWidth";
  import { prefersReducedMotion } from "./lib/stores/preferesReducedMotion.js"

  import { onMount, afterUpdate } from "svelte"
  import { scaleDiverging } from "d3-scale"
  import { max, min, group } from "d3-array"
  import { interpolateRdYlBu, schemeRdYlBu, interpolateGreys } from "d3-scale-chromatic"
  import { interpolateHsl } from "d3-interpolate"
  import { heatmapLoaded } from "./lib/stores/heatmapLoaded.js"
  import { COLORS } from "./lib/utils/colors.js"
  import { searchResult, activeSearch, cleanData } from "./lib/stores/search"
  import { createEventDispatcher } from "svelte"
  import { SearchIcon, MousePointerIcon } from "svelte-feather-icons"

  // import "@fontsource/plus-jakarta-sans"
  // import "@fontsource/plus-jakarta-sans/600.css"
  // import "@fontsource/plus-jakarta-sans/700.css"

  // $: console.log(COLORS.gray["100"])

  // window.onbeforeunload = function () {
  //   window.scrollTo(0, 0)
  // }

  // $: console.log(data, dataX)

  // $: console.log("ismobile", $isMobile, "issmall", $isSmallMobile, "istablet", $isTablet)

  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)')

  const getInitialState = () => !window.matchMedia('(prefers-reduced-motion: no-preference)').matches

  const preferesReducedMotionListener = (event) => {
    $prefersReducedMotion = !event.matches
  }


  onMount(() => {

  mediaQueryList.addEventListener("change", preferesReducedMotionListener)
  $prefersReducedMotion = getInitialState()
  // $width = 

  return () => {
    mediaQueryList.removeEventListener("change", preferesReducedMotionListener)
  }
  })


  // $: console.log($width)


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


  const continents = [... new Set($data.map(d => d.continent))].sort()

  const years = [... new Set($data.map(d => d.year))].sort()

  // console.log(years)

  // let selectedContinent = ""

  // let selectedCountry = ""

  // clickedCountry.subscribe(country => {
  //   selectedCountry = country
  // })

  // clickedContinent.subscribe(continent => {
  //   selectedContinent = continent
  // })


  const totalScale = scaleDiverging(interpolateRdYlBu)
    .domain([min($data, d => d.total), 0, max($data, d => d.total)])

  // const interpolatedGrays = interpolateHsl(COLORS.gray["100"], COLORS.gray["900"])

  // console.log(interpolatedGrays(0.1))

  // const totalFontColorScale = scaleDiverging()
  //   .domain([min($data, d => d.total), 0, max($data, d => d.total)])
  //   .range([COLORS.gray["100"], COLORS.gray["900"], COLORS.gray["100"]])

    // console.log(totalFontColorScale(0))



  let countryView

  $: countryInfoTabIndex = ""

  function scrollToCountryView() {
    countryInfoTabIndex = "0"
    countryView.scrollIntoView({block: "start"});
    countryView.focus()

    // setTimeout(() => {
    //   countryInfoTabIndex = "0"
    // countryView.scrollIntoView({block: "start"});
    // countryView.focus()
    // }, 500)
  }

  let continentView

  function scrollToContinentView() {
    countryInfoTabIndex = "-1"
    continentView.scrollIntoView({block: "start"})
    continentView.focus()
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

  // TODO disabled button
  // https://uxplanet.org/disabled-buttons-in-user-interface-4dafda3e6fe7

  // TODO font color as scale dependent from background color

  // TODO flavicon

  // TODO h1 fontsize scale

  // TODO Transition countryView

  // TODO scroll design

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

  // $: console.log("desktop", $isDesktop, $width)
  // $: console.log("tablet", $isTablet, $width)
  // $: console.log("mobile", $isMobile, $width)
  // $: console.log("small mobile", $isSmallMobile, $width)

  // $: pWidth = $isDesktop
  //   ? 700
  //   : 0.8 * $width


  $: selectedContinentCountries = [... new Set(
        $data
      // .filter(d => d.continent == selectedContinent)
      .filter(d => {
        if ($selectedContinent === "All") return true
        else if ($selectedContinent === "") return false
        else return d.continent === $selectedContinent
      })
      .filter(d => d.year === 2023)
      .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      .map(d => d.country)
      )]

      $: selectedContinentData = group(
    $data.filter(d => {
      if ($selectedContinent === "All") return true
      else if ($selectedContinent === "") return false
      else return d.continent === $selectedContinent
    })
      .sort((a, b) => {
        if(a.year !== 2023) return 1;
        else if(b.year !== 2023) return -1;
        else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
      }), d => d.country)


    let searchValue
  // $: console.log(search, $searchResult)


  function handleSearch() {
    $searchResult = searchValue
    $activeSearch = true
    $selectedContinent = "All"
    $selectedCountry = ""
  }

  function deleteSearchData() {
    searchedCountryData = group(
      $data.filter(d => {
      return d.country === ""
    }), d => d.country)

    searchedCountries = []
  }

  function clearSearch() {
    
    deleteSearchData()

    setTimeout(() => {
    $activeSearch = false
    searchValue = ""
    $selectedCountry = ""
    selectedValue = "All"

    $selectedContinent = selectedValue
    }, 0.1)
  }

  let selectedValue

  function handleSelect() {
    // searchedCountryData = group(
    //   $data.filter(d => {
    //   return d.country === ""
    // }), d => d.country)

    // searchedCountries = []

    deleteSearchData()

    setTimeout(() => {
      $activeSearch = false
    searchValue = ""
    $selectedCountry = ""

    $selectedContinent = selectedValue
    }, 0.1)

  }


      let searchedCountries
      let searchedCountryData

      $: if ($activeSearch) {

        searchedCountries = [... new Set(
        $data
      // .filter(d => d.continent == selectedContinent)
      .filter(d => {
        return d.country.toLowerCase().includes($searchResult.toLowerCase())
      })
      .filter(d => d.year === 2023)
      .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      .map(d => d.country)
      )]

        // searchedCountry = selectedContinentCountries.filter(country => {
        //   return country.toLowerCase().includes($searchResult.toLowerCase())
        // })

        searchedCountryData = group(
            $data.filter(d => {
            return d.country.toLowerCase().includes($searchResult.toLowerCase())
      // if ($selectedContinent === "All") return true
      // else return d.continent === $selectedContinent
          })
          .sort((a, b) => {
            if(a.year !== 2023) return 1;
            else if(b.year !== 2023) return -1;
            else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
          }), d => d.country)

      }


      $: activeData = $activeSearch ? searchedCountryData : selectedContinentData

$: activeCountries = $activeSearch ? searchedCountries: selectedContinentCountries

// $: console.log($activeSearch, activeData, activeCountries)

function clearCountry() {
  selectedCountry.set("")
  scrollToContinentView()
  // if ($activeSearch) {
  //   clearSearch()
  // }
}


</script>

<div
class="wrapper"
bind:clientWidth={$width}
bind:clientHeight={$height}
style="
  --bodyColor: {COLORS.gray["700"]};
  --linkColor: {COLORS.secondary["500"]};
  --linkHoverColor: {COLORS.secondary["900"]};
  
  "
>
    
      <header>
              <h1>Gay Travel Index 2023</h1>
      <div class="intro">
          <p>
            In many countries, lesbian, gay, bisexual, transgender, and intersex people still have to fear 
            for their safety and happiness. Every year, the Spartacus International Gay Guide publishes 
            the Gay Travel Index (GTI). It monitors the status and rights of the local LGBTQ+ community 
            in each country and serves as a first guide to help tourists travel safely.
          </p>

        </div>
      </header>
  
    <main>

      <section>
        <div class="mapWrapper">
          {#if mapWidth > 0}
          <Map {mapWidth} {mapHeight} {totalScale} on:countryClick={scrollToCountryView}/>
          {/if}
          <p class="dataInfo">
            Data: 
            <a 
              href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
              target="_blank" rel="noreferrer">Spartacus International Gay Guide</a>
          </p>
        </div>

      </section>

      <section>
    <div class="chartWrapper" >
      <!-- style="--gap: {$chartGap}px;" -->
        
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="continentChartWrapper"> 
            <p bind:this={continentView} tabindex="0" role="region" aria-describedby="Heatmap Intro">
              The heatmap below shows the Gay Travel Index for all countries and years, sorted by the 2023 ranking.
              The Gay Travel Index is based on ratings from various categories including anti-discrimination laws, 
              transgender rights and violence against the LGBTQ+ community. In recent years the index has become 
              more diverse with the addition of new categories.
             </p>
            <!-- </div> -->
             <!-- <div class="selectContinentWrapper"> -->

              <p>
              <label for="continent-select">Select a continent</label>
              <select 
              name="continents" 
              id="continent-select" 
              bind:value={selectedValue}
              style="
              --selectBackgroundColor: {COLORS.secondary["100"]};
              --selectColor: {COLORS.secondary["600"]};
              "
              on:change={() => handleSelect()}
              >
              <!-- on:change={() => selectedContinent.set("")} -->
                <option value="All">All</option>
                {#each continents as continent}
                  <option value={continent}>{continent}</option>
                {/each}
            </select> or search for a country
            <label
              role="search"
              class="searchWrapper"
              style="
              --searchBackgroundColor: {COLORS.secondary["100"]};
              --searchColor: {COLORS.secondary["600"]};
              ">
              <div class="searchIconWrapper"><SearchIcon size="24"/></div>
              <input 
                type="search" 
                placeholder="Country"
                id="search"
                bind:value={searchValue} 
                on:keyup={() => handleSearch()}
                on:search={() => clearSearch()}
                >
              <!-- <button 
                type="submit" 
                on:click={() => handleSearch()}
                on:keypress={() => handleSearch()}
                ><SearchIcon size="24"/></button> -->
            </label>
          </p>
          <p>
            <span class="mousePointerIconWrapper" style="--mousePointerColor: {COLORS.secondary["600"]};"><MousePointerIcon size="24"/></span> 
            Click on a country’s name for information about its ratings in the different categories.
          </p>
          <p class="note">Note: There is no data for 2022.</p>
          <!-- </div> -->
             <Heatmap on:countryClick={scrollToCountryView} {totalScale}  {years} width={$width} {activeData} {activeCountries}/>


      </div>
        
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="countryChartWrapper" tabindex={countryInfoTabIndex} bind:this={countryView} role="region" aria-describedby="Indicator Chart Intro"> 
      <!-- tabindex="0" role="region" aria-describedby="Country Info" -->
        {#if !$selectedCountry}
          <p>Click on a country’s name for its individual ratings.</p>
        {/if}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div  style="min-height: 1px;">
          {#if $selectedCountry}
          <p >
            Positive developments count as plus points, and negative ones as minus points. 
            A rating of zero is assigned if a country is lacking in a category. Countries in which people are still executed receive five negative points to ensure that they are at the bottom of the ranking.
          </p>
          <p>Pass your mouse over the circles or access them with the tab key for the ratings from other years.
          </p>
  
          {#if $selectedCountry === "United States of America"}
          <p>For a more detailed analysis of the different states, please check <a href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/" target="_blank" rel="noreferrer">the Gay Travel Index USA on the Spartacus Website</a>.</p>
          {/if}
          <button
          class="countryButton"
          style="
          --buttonBackgroundColor: {COLORS.secondary["200"]};
          --buttonColor: {COLORS.secondary["700"]};
            
            "
          on:click={() => clearCountry()}
          >Clear Country</button>
          <!-- // // selectedCountry = ""
          // selectedCountry.set("")
          // scrollToContinentView()
          // // hoveredCountryYear = null // TODO: check if necessary (after refactor handleHeatmapHover to ContinentHeatmap)
          // // scrollToTop() // here scrolling -->
          <!-- class="countryButton {selectedCountry ? "visibleButton" : "hiddenButton"}" -->
          {/if}
          <!-- --buttonBackgroundColor: {COLORS.secondary["100"]};
          --buttonColor: {COLORS.secondary["600"]};
          --buttonHoverBackgroundColor: {COLORS.secondary["50"]};
          --buttonHoverColor: {COLORS.secondary["500"]};
           -->
        </div>
          <IndicatorsChart {years} width={$width} />
      <!-- {selectedCountry} width={$countryWidth} --> 
    </div>




    </div>

</section>
  <!-- </div> -->

</main>
</div>

<style>

/* #searchBar {
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  width: 300px;
} */

  .wrapper {
    padding: 40px;
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--bodyColor);
    /* font-family: "Plus Jakarta Sans", sans-serif; */
  }

  a {
  font-weight: 500;
  color: var(--linkColor);
  text-decoration: inherit;
}
a:hover {
  color: var(--linkHoverColor);
}

  /* .chartWrapper {
    width: 1000px;
  } */

  /* p {
    line-height: 1.5;
  } */

  /* .wrapper {
    max-width: 700px;
      margin: 0 auto;
  } */

  p {
      max-width: 800px;
      /* width: var(--pWidth); */
      /* margin: 0 auto; */
      margin-right: auto;
      margin-left: auto;
      /* max-width: 1000px; */
      /* max-width: 65ch; */
    }

/* @media (max-width: 1150px){ 
    p {
      width: 400px;
    }

  } */


  .mapWrapper {
      margin: 40px 0;
    }

  .continentChartWrapper {
    margin-bottom: 20px;
  }

  /* .intro {
    flex: 1;
  }

  .mapWrapper {
    flex: 2;
  } */

  h1 {
  /* font-size: 1.5rem; */
  line-height: 1.3;
  margin-bottom: 20px;
  /* margin-bottom: 20px; */
  /* font-size: clamp(2rem, 2vw + 2rem, 2.5rem); */
  /* min-height: 0vh; */
  /* font-size: 2.5rem; */
}


.dataInfo {
  font-size: 1rem;
}

.note {
  font-size: 1rem;
}

/* 
.selectContinentWrapper {
  max-width: var(--pWidth);
      margin-right: auto;
      margin-left: auto;
} */

.mousePointerIconWrapper {
  /* position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto 0; */
  /* height: 24px; */
  color: var(--mousePointerColor);
  display: inline-block;
}

select {
    font-size: 1.2rem;
    background-color: var(--selectBackgroundColor);
    color: var(--selectColor);
    border: 2px solid var(--selectColor);
    border-radius: 8px;
    padding: 3px 5px;
    margin: 4px 2px;
    /* color: var(--bodyColor); */
    /* display: block; */
}

.searchWrapper {
  display: inline-block;
  position: relative;
}

.searchIconWrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto 0;
  height: 24px;
  color: var(--searchColor);

}

#search {
  font-size: 1.2rem;
  height: 2.2rem;
  color: var(--searchColor);
  width: 250px;
  border: 2px solid var(--searchColor);
  border-radius: 8px;
  /* display: block; */
  padding: 3px 5px 3px 40px;
  background-color: var(--searchBackgroundColor);
  margin: 4px 2px;
  /* background: var(--searchBackgroundColor) url("./assets/search.svg") no-repeat 10px center; */
}

#search::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: var(--searchColor);
  opacity: 1; /* Firefox */
}

#search:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: var(--searchColor);
}

#search::-ms-input-placeholder { /* Microsoft Edge */
  color: var(--searchColor);
}

/* .countryChartWrapper {
  scroll-margin-top: 100px;
} */

  /* .chartWrapper {
    display: flex;
    flex-wrap: wrap;

  } */


  /* .continentChartWrapper {
    flex: 1;
  } */


  /* .countryChartWrapper {
    flex: 1;
  } */

/* .continentButton { */
    /* transition: visibility 100ms ease ; */

  /* } */


  /* .visibleButton { */
    /* visibility: visible; */
    /* transition: visibility 200ms ease; */
    /* opacity: 1;
    transition: opacity 100ms ease-in; */

    /* visibility: visible;
    opacity: 1; */
    /* transition: visibility 0s linear 0s, opacity 300ms; */
    /* transition: all 2000ms ease; */

      /* visibility cannot be transitioned, because its 0/1
      https://stackoverflow.com/questions/27900053/css-transition-with-visibility-not-working
    */

 /* }  */

 /* .hiddenButton { */
    /* visibility: hidden; */
    /* transition: visibility 100ms ease; */
    /* opacity: 0;
    transition: opacity 100ms ease-out; */

    /* visibility: hidden;
    opacity: 0; */
    /* transition: visibility 0s linear 300ms, opacity 300ms; */
    /* transition: all 2000ms ease; */

    /* 
      visibility cannot be transitioned, because its 0/1
      https://stackoverflow.com/questions/27900053/css-transition-with-visibility-not-working
    */
 /* }  */

 .countryButton {
  border-radius: 8px;
  border: 2px solid transparent;
  /* border: 1px solid var(--buttonColor); */
  color: var(--buttonColor);
  /* padding: 0.6em 1.2em; */
  padding: 8px 15px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  background-color: var(--buttonBackgroundColor);
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, font-weight 200ms ease;
  /* transition: border-color 0.25s; */
  /* font-size: var(--bodyFontSize); */
}
button:hover {
  /* border-color: #646cff; */
  /* background-color: var(--buttonHoverBackgroundColor); */
  /* color: var(--buttonColor); */
  border: 2px solid var(--buttonColor);
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
  outline-color: var(--buttonColor);
}


/* @media (max-width: 1150px){ */
    /* .topWrapper {
      flex-direction: column;
    } */

    /* .intro {
      display: flex;
    } */

    /* .selectContinentCountryWrapper {
      flex-direction: column;
      gap: 0px;
    } */

    /* .selectCountryWrapper {
      gap: 2px;
    } */

    /* .chartWrapper {
      flex-direction: column;
    } */

    /* .selectContinentWrapper {
      /* max-width: 600px; */
      /* margin: 0; */
      /* display: flex;
      justify-content: center; */
      /* padding: 20px 0; */
    /* } */ 

    /* .countryInfo {
      max-width: 600px;
      margin: 0 auto;
    } */
  /* } */


  /* https://stackoverflow.com/questions/30855985/pure-css-animation-visibility-with-delay */
</style>
