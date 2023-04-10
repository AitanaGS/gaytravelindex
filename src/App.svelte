<script>
  // import data from "../data/processed/GTI_2012-2021.json";
//   import { 
//     data, 
//     continents,
//     activeCountries,
//     activeData
// } from "./lib/stores/data.js"
import { 
    data, 
    continents,
    activeCountries,
    activeData,
    selectedContinentCountries, 
    selectedContinentData, 
    cachedContinentCountries,
    cachedContinentData 
} from "./lib/stores/data.js"
import { 
    selectedContinent} from "./lib/stores/selectedContinent";
  import Map from "./lib/components/Map.svelte"
  import Heatmap from "./lib/components/Heatmap.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import Select from "./lib/components/Select.svelte"
  import Search from "./lib/components/Search.svelte"
  import Button from "./lib/components/Button.svelte"
  import DataInfoTooltip from "./lib/components/DataInfoTooltip.svelte"
  import { selectedCountry } from "./lib/stores/selectedCountry"
  // import { 
  //   selectedContinent, 
  //   selectedContinentCountries, 
  //   selectedContinentData, 
  //   cachedContinentCountries,
  //   cachedContinentData } from "./lib/stores/selectedContinent";
  // import { bodyFontSize } from "./lib/stores/responsiveFontSize";
  // import { windowWidth } from "./lib/stores/responsiveFontSize";
  import { width, height, isSmall, isMobile } from "./lib/stores/dimensions"; // , mapWidth, continentWidth, countryWidth 
  // import { isDesktop, isMobile, isTablet } from "./lib/stores/devices";
  // import { bodyFontSizeScale } from "./lib/utils/fontSizeScales";
  // import { windowWidth } from "./lib/stores/windowWidth";
  import { prefersReducedMotion } from "./lib/stores/preferesReducedMotion.js"

  import { onMount, afterUpdate, tick, beforeUpdate } from "svelte"
  import { scaleDiverging } from "d3-scale"
  import { max, min, group } from "d3-array"
  import { interpolateRdYlBu, schemeRdYlBu, interpolateGreys } from "d3-scale-chromatic"
  import { interpolateHsl } from "d3-interpolate"
  // import { heatmapLoaded } from "./lib/stores/heatmapLoaded.js"
  import { COLORS } from "./lib/utils/constants.js"
  import { query, activeSearch } from "./lib/stores/search"
  import { createEventDispatcher } from "svelte"
  import { SearchIcon, MousePointerIcon, InfoIcon, GithubIcon } from "svelte-feather-icons"

  // import "@fontsource/plus-jakarta-sans"
  // import "@fontsource/plus-jakarta-sans/600.css"
  // import "@fontsource/plus-jakarta-sans/700.css"

  // $: console.log(totalScale())

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

  // const cachedContinentData = new Map();

  // $: console.log(cachedContinentData)


  // here!
  // const continents = [... new Set($data.map(d => d.continent))].sort()
  // const years = [... new Set($data.map(d => d.year))].sort()


  // here!
  // $: selectedContinentCountries = [... new Set(
  //       $data
  //     // .filter(d => d.continent == selectedContinent)
  //     .filter(d => {
  //       if ($selectedContinent === "All") return true
  //       else if ($selectedContinent === "") return false
  //       else return d.continent === $selectedContinent
  //     })
  //     .filter(d => d.year === 2023)
  //     .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
  //     .map(d => d.country)
  //     )]

  //     // here!
  //     $: selectedContinentData = group(
  //   $data.filter(d => {
  //     if ($selectedContinent === "All") return true
  //     else if ($selectedContinent === "") return false
  //     else return d.continent === $selectedContinent
  //   })
  //     .sort((a, b) => {
  //       if(a.year !== 2023) return 1;
  //       else if(b.year !== 2023) return -1;
  //       else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
  //     }), d => d.country)


    // let searchValue
  // $: console.log(search, $query)

    // let selectedValue


    // let activeSearch = false

  function handleSearch() {
    // $query = searchValue
    // $activeSearch = true
    $activeSearch = true
    $selectedContinent = "All"
    $selectedCountry = ""
    // selectedValue = "All"
  }

  // here!
  // function deleteSearchData() {
  //   searchedCountryData = group(
  //     $data.filter(d => {
  //     return d.country === ""
  //   }), d => d.country)

  //   searchedCountries = []
  // }


  // here!
  // function deleteSearchData() {
  //   $searchedCountryData = group(
  //     $data.filter(d => {
  //     return d.country === ""
  //   }), d => d.country)

  //   $searchedCountries = []
  // }

  // function deleteSearchData() {
  //   $searchedCountryData = group(
  //     $data.filter(d => {
  //     return d.country === ""
  //   }), d => d.country)

  //    $searchedCountries = []
  // }

  // function clearSearch() {
    
  //   deleteSearchData()

  //   setTimeout(() => {
  //   $activeSearch = false
  //   searchValue = ""
  //   $selectedCountry = ""
  //   selectedValue = "All"

  //   $selectedContinent = selectedValue
  //   }, 0.1)
  // }

  // let selectedValue

  // const cachedContinentData = {}
  // const cachedContinentCountries = {}


  // here!
  // function handleSelect(event) {
  //   // searchedCountryData = group(
  //   //   $data.filter(d => {
  //   //   return d.country === ""
  //   // }), d => d.country)

  //   // searchedCountries = []
  //   // selectedValue = event.detail

  //   if (!cachedContinentData.hasOwnProperty($selectedContinent)) {
  //     cachedContinentData[$selectedContinent] = selectedContinentData
  //   }

  //   if (!cachedContinentCountries.hasOwnProperty($selectedContinent)) {
  //     cachedContinentCountries[$selectedContinent] = selectedContinentCountries
  //   }

  //   deleteSearchData()

  //   setTimeout(() => {
  //     $activeSearch = false
  //   // searchValue = ""
  //   $query = "" //neu
  //   $selectedCountry = ""
  //   // cachedContinentData.has($selectedContinent) ? null : cachedContinentData.set($selectedContinent, selectedContinentData)

  //   // $selectedContinent = selectedValue//event.detail.selectedValue
  //   }, 0.1)

  // }


  // $: console.log(cachedContinentData)


function handleSelect() {


    // //deleteSearchData()


    // $activeSearch = false

    // setTimeout(() => {
      // await tick()
      // $activeSearch = false
      $activeSearch = false
      $query = ""
    // $query = "" //neu
    $selectedCountry = ""

    // if (!$cachedContinentData.hasOwnProperty($selectedContinent)) {
    //   $cachedContinentData[$selectedContinent] = selectedContinentData
    // }

    // if (!$cachedContinentCountries.hasOwnProperty($selectedContinent)) {
    //   $cachedContinentCountries[$selectedContinent] = selectedContinentCountries
    // }

    if (!$cachedContinentData.has($selectedContinent)) {
      $cachedContinentData.set($selectedContinent, $selectedContinentData)
    }

    if (!$cachedContinentCountries.has($selectedContinent)) {
      $cachedContinentCountries.set($selectedContinent, $selectedContinentCountries)
    }



    // }, 0.001)

  }

  // beforeUpdate(() => {
  //   $query = ""
  // })



  // here!
      // let searchedCountries
      // let searchedCountryData

      // $: if ($activeSearch) {

      //   searchedCountries = [... new Set(
      //   $data
      // // .filter(d => d.continent == selectedContinent)
      // .filter(d => {
      //   return d.country.toLowerCase().includes($query.toLowerCase())
      // })
      // .filter(d => d.year === 2023)
      // .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      // .map(d => d.country)
      // )]

      //   // searchedCountry = selectedContinentCountries.filter(country => {
      //   //   return country.toLowerCase().includes($query.toLowerCase())
      //   // })

      //   searchedCountryData = group(
      //       $data.filter(d => {
      //       return d.country.toLowerCase().includes($query.toLowerCase())
      // // if ($selectedContinent === "All") return true
      // // else return d.continent === $selectedContinent
      //     })
      //     .sort((a, b) => {
      //       if(a.year !== 2023) return 1;
      //       else if(b.year !== 2023) return -1;
      //       else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
      //     }), d => d.country)

      // }

// here!
// $: activeData = $activeSearch 
//   ? searchedCountryData 
//   : cachedContinentData[$selectedContinent] ?? selectedContinentData

// $: activeCountries = $activeSearch 
//   ? searchedCountries
//   : cachedContinentCountries[$selectedContinent] ?? selectedContinentCountries

  // $:console.log("here", cachedContinentCountries[$selectedContinent] ?? "bla")

// $: activeData = $activeSearch ? $searchedCountryData : $selectedContinentData

// $: activeCountries = $activeSearch ? $searchedCountries: $selectedContinentCountries

// $: console.log($activeSearch, activeData, activeCountries)

// $: console.log($cachedContinentCountries)

function clearCountry() {
  $selectedCountry = ""
  scrollToContinentView()
  // if ($activeSearch) {
  //   clearSearch()
  // }
}

// $: showDataInfo = false

// function handleDataInfoHover(e) {
//   if (e.type === "mouseover" || e.type === "focus") {

//   } else {

//   }
//   console.log(e)
// }

// const toggleShowDataInfo = () => showDataInfo = !showDataInfo

// $: console.log(showDataInfo)

// $: console.log("small Mobile", $isSmallMobile)
// $: console.log("Mobile", $isMobile)
// $: console.log("tablet", $isTablet)
// $: console.log("desktop", $isDesktop)


</script>

<div
class="wrapper"
bind:clientWidth={$width}
bind:clientHeight={$height}
style="
  --bodyColor: {COLORS.gray["700"]};
  --linkColor: {COLORS.primary["500"]};
  --linkHoverColor: {COLORS.primary["900"]};
  
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
              target="_blank" rel="noreferrer">Spartacus International Gay Guide
            </a>
              <!-- <span 
                class="infoIconWrapper" 
                style="--infoColor: {COLORS.primary["600"]};"
                on:mouseover={() => showDataInfo = true}
                on:focus={() => showDataInfo = true}
                on:mouseleave={() => showDataInfo = false}
                on:blur={() => showDataInfo = false}
                on:keydown={(e) => {e.key === "Escape" ? showDataInfo = false : null}}
              >
                <InfoIcon size="22"/>
                {#if showDataInfo}
                <DataInfoTooltip />
                {/if}
              </span> -->
          </p>
        </div>

      </section>

      <section>
    <div class="chartWrapper">
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
                <Select continents={$continents} on:selectContinent={handleSelect} />
              <!-- <label for="continent-select">Select a continent</label>
              <select 
              name="continents" 
              id="continent-select" 
              bind:value={selectedValue}
              style="
              --selectBackgroundColor: {COLORS.primary["100"]};
              --selectColor: {COLORS.primary["600"]};
              "
              on:change={() => handleSelect()}
              >
                <option value="All">All</option>
                {#each continents as continent}
                  <option value={continent}>{continent}</option>
                {/each}
            </select>  -->

            or search for a country
            <Search on:searchCountry={handleSearch}/>.
            <!-- <label
              role="search"
              class="searchWrapper"
              style="
              --searchBackgroundColor: {COLORS.primary["100"]};
              --searchColor: {COLORS.primary["600"]};
              ">
              <div class="searchIconWrapper"><SearchIcon size="24"/></div>
              <input 
                type="search" 
                placeholder="Country"
                id="search"
                bind:value={searchValue} 
                on:keyup={() => handleSearch()}
                on:search={() => handleSearch()} 
                >
            </label>. -->
          </p>

          <p> 
            Click on a country’s name for information about its ratings in the different categories.
          </p>
          <p class="note">Note: There is no data for 2022.</p>
          <!-- </div> -->
             <Heatmap on:countryClick={scrollToCountryView} {totalScale} />
             <!-- years={$years} width={$width} activeData={$activeData} activeCountries={$activeCountries} -->


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
          <p>
            <span class="circleSvgWrapper">
              <svg width=20 height=20>
              <circle
              cx=10
              cy=10
              r=8
              fill="hsla(58, 85%, 87%, 1)"
              stroke={COLORS.gray["700"]}
              />
              </svg>
            </span>
            <span 
              class="mousePointerIconWrapper" 
              style="--mousePointerColor: {COLORS.primary["600"]};">
              <MousePointerIcon size="24"/>
            </span>
            <span class="hoverInfo">
              Hover over the circles for the ratings from other years.
            </span>
          </p>
  
          {#if $selectedCountry === "United States of America"}
          <p>For a more detailed analysis of the different states, please check <a href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/" target="_blank" rel="noreferrer">the Gay Travel Index USA on the Spartacus Website</a>.</p>
          {/if}
          <Button on:buttonClick={clearCountry}>
            Clear Country
          </Button>
          <!-- <button
          class="countryButton"
          style="
          --buttonBackgroundColor: {COLORS.primary["100"]};
          --buttonColor: {COLORS.primary["600"]};
          --buttonHoverBackgroundColor: {COLORS.primary["200"]};
          --buttonHoverColor: {COLORS.primary["800"]};
            
            "
          on:click={() => clearCountry()}
          >Clear Country</button> -->
          <!-- // // selectedCountry = ""
          // selectedCountry.set("")
          // scrollToContinentView()
          // // hoveredCountryYear = null
          // // scrollToTop() // here scrolling -->
          <!-- class="countryButton {selectedCountry ? "visibleButton" : "hiddenButton"}" -->
          {/if}
          <!-- --buttonBackgroundColor: {COLORS.primary["100"]};
          --buttonColor: {COLORS.primary["600"]};
          --buttonHoverBackgroundColor: {COLORS.primary["50"]};
          --buttonHoverColor: {COLORS.primary["500"]};
           -->
        </div>
          <IndicatorsChart  />
          <!-- years={$years} width={$width} -->
      <!-- {selectedCountry} width={$countryWidth} --> 
    </div>

    <footer>
      <div class="dataSources">
        <h5>Data</h5>
        <p><strong>2012 - 2021 data:</strong> <br>             
          <a 
          href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
          target="_blank" rel="noreferrer">Spartacus International Gay Guide
          </a> 
          via 
          <a 
          href="https://www.makeovermonday.co.uk/"
          target="_blank" rel="noreferrer">Makeover Monday.
          </a> <br>
          The Makeover Monday data contained some missing values, which were filled in manually using information from the original reports.
      </p>
      <p><strong>2023 data:</strong><br>  
          <a 
          href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
          target="_blank" rel="noreferrer">Spartacus International Gay Guide</a>,
          scraped from the report.
      </p>
      <p><strong>Geographical Data:</strong><br>  
          <a 
          href="https://www.naturalearthdata.com/"
          target="_blank" rel="noreferrer">Natural Earth
          </a>
      </p>
      </div>
      <div class="codeInfo">
        <h5>Code</h5>
        <p> 
          <span 
          class="githubIconWrapper" 
          style="
          --githubColor: {COLORS.primary["600"]};
          --githubHoverColor: {COLORS.primary["800"]};
          ">
          <a href="https://github.com/AitanaGS/gaytravelindex" target="_blank" rel="noreferrer">
            <GithubIcon size="24"/>
          </a>
        </span>
        </p>
      </div>

    </footer>
    



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
    width: 100%;
    max-width: 900px;
    /* max-width: 996px; */
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
      /* max-width: 800px; */
      /* margin: 0 auto; */
      margin-right: auto;
      margin-left: auto;
            /* width: var(--pWidth); */
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
  margin-bottom: 30px;
  margin-top: 10px;
  /* margin-bottom: 20px; */
  /* font-size: clamp(2rem, 2vw + 2rem, 2.5rem); */
  /* min-height: 0vh; */
  /* font-size: 2.5rem; */
}


.dataInfo {
  font-size: 1rem;
  /* display: flex;
  align-items: center;
  gap: 5px; */
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

/* .pointerWrapper {
  position: relative;
} */

/* .infoIconWrapper {
  color: var(--infoColor);
  display: inline-block;
  margin-left: 3px;
  padding: 3px;
  cursor: pointer;
  position: relative;
} */

/* .countrySelectSearch {
  display: flex;
} */

.circleSvgWrapper {
  /* position: absolute; */
  display: inline-block;

}

.mousePointerIconWrapper {
  /* position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto 0; */
  /* height: 24px; */
  top: 10px;
  left: 0px;
  margin-left: -15px;
  position: relative;
  color: var(--mousePointerColor);
  display: inline-block;
  margin-right: 2px;
}

.hoverInfo {
  /* position: absolute; */
  left: 15px;
  /* top: 8px; */
}

/* select {
    font-size: 1.2rem;
    background-color: var(--selectBackgroundColor);
    color: var(--selectColor);
    border: 2px solid var(--selectColor);
    border-radius: 8px;
    padding: 3px 5px;
    margin: 4px 2px;
} */



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

 /* }  */



footer {
  margin-top: 30px;
  font-size: 1rem;
  overflow-wrap: word-wrap; /* IE */
  overflow-wrap: break-word;
  hyphens: auto; 
   -webkit-hyphens: auto; /* Prefix for Safari */
   max-width: 500px;
   margin-bottom: 30px;
}

footer h5 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.codeInfo {
  margin-top: 40px;

}

/* .codeInfo h5 {
  font-size: 1.2rem;
  margin-bottom: 5px;
} */

.githubIconWrapper {
  /* position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto 0; */
  /* height: 24px; */
  /* top: 10px;
  left: 0px;
  margin-left: -15px;
  position: relative; */
  color: var(--githubColor);
  display: inline-block;
  /* margin-right: 2px; */
  cursor: pointer;
  margin-left: 2px;
}
.githubIconWrapper:hover {
  /* background-color: var(--buttonHoverBackgroundColor); */
  color: var(--githubHoverColor);
  /* border: 2px solid var(--buttonHoverColor); */

  /* border: 2px solid var(--buttonColor); */
}
.githubIconWrapper:focus,
.githubIconWrapper:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
  outline-color: var(--githubHoverColor);
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


</style>
