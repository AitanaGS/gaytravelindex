<script>
  import Header from "./lib/components/Header.svelte"
  import Map from "./lib/components/Map.svelte"
  import Heatmap from "./lib/components/Heatmap.svelte"
  import IndicatorsChart from "./lib/components/IndicatorsChart.svelte"
  import Select from "./lib/components/Select.svelte"
  import Search from "./lib/components/Search.svelte"
  import Button from "./lib/components/Button.svelte"
  import Footer from "./lib/components/Footer.svelte"

  import { 
    data, 
    continents,
    selectedContinentCountries, 
    selectedContinentData, 
    cachedContinentCountries,
    cachedContinentData 
  } from "./lib/stores/data.js"
  import { selectedContinent } from "./lib/stores/selectedContinent"
  import { selectedCountry } from "./lib/stores/selectedCountry"
  import { width, height } from "./lib/stores/dimensions"
  import { prefersReducedMotion } from "./lib/stores/preferesReducedMotion.js"
  import { query, activeSearch } from "./lib/stores/search"

  import { COLORS } from "./lib/utils/constants.js"

  import { onMount } from "svelte"
  import { scaleDiverging } from "d3-scale"
  import { max, min } from "d3-array"
  import { interpolateRdYlBu } from "d3-scale-chromatic"
  import { MousePointerIcon } from "svelte-feather-icons"

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

   // aspect ratio
   $: mapWidth = 800
   $: mapHeight = 400


  const totalScale = scaleDiverging(interpolateRdYlBu)
    .domain([min($data, d => d.total), 0, max($data, d => d.total)])


  let countryView

  $: countryInfoTabIndex = ""

  function scrollToCountryView() {
    countryInfoTabIndex = "0"
    countryView.scrollIntoView({block: "start"});
    countryView.focus()
  }

  let continentView

  function scrollToContinentView() {
    countryInfoTabIndex = "-1"
    continentView.scrollIntoView({block: "start"})
    continentView.focus()
  }

  function handleSearch() {
    $activeSearch = true
    $selectedContinent = "All"
    $selectedCountry = ""
  }

  function clearSearch() {
    $activeSearch = false
    $query = ""
    $selectedCountry = ""
  }

  function handleSelect() {

      $activeSearch = false
      $query = ""
      $selectedCountry = ""

      if (!$cachedContinentData.has($selectedContinent)) {
        $cachedContinentData.set($selectedContinent, $selectedContinentData)
      }

      if (!$cachedContinentCountries.has($selectedContinent)) {
        $cachedContinentCountries.set($selectedContinent, $selectedContinentCountries)
      }

    }

  function clearCountry() {
    $selectedCountry = ""
    scrollToContinentView()
  }

</script>


<div
  class="wrapper"
  bind:clientWidth={$width}
  bind:clientHeight={$height}
>
  <Header />
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
          </p>
        </div>

      </section>

      <section>
    <div class="chartWrapper">
        
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div class="continentChartWrapper"> 
            <p bind:this={continentView} tabindex="0" role="region" aria-describedby="Heatmap Intro">
              The heatmap below displays the Gay Travel Index for all countries and years, sorted by the 2023 ranking. 
              The Gay Travel Index is determined by ratings from various categories, including anti-discrimination laws, 
              transgender rights, and violence against the LGBTQIA+ community. In recent years, the index has become more comprehensive with the inclusion of new categories.
             </p>


  
              <p>
                <Select continents={$continents} on:selectContinent={handleSelect} />

            or search for a country
            <Search on:searchCountry={handleSearch} on:clearSearch={clearSearch}/>.
          </p>

          <p> 
            Click on a country's name for information about its ratings in different categories.
          </p>
          <p class="note">Note: There is no data for 2022.</p>
             <Heatmap on:countryClick={scrollToCountryView} {totalScale} />

      </div>
        
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div class="countryChartWrapper" tabindex={countryInfoTabIndex} bind:this={countryView} role="region" aria-describedby="Indicator Chart Intro"> 
        {#if !$selectedCountry}
          <p>Click on a country’s name for its individual ratings.</p>
        {/if}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div  style="min-height: 1px;">
          {#if $selectedCountry}
          <p >
            Positive developments are credited as plus points, and negative ones are marked as minus points. 
            A rating of zero is given if a country lacks in a category. 
            Countries where executions still occur receive five negative points to ensure they rank lowest.
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
              Hover over the circles for ratings from other years.
            </span>
          </p>
  
          {#if $selectedCountry === "United States of America"}
          <p>For a more detailed analysis of the different states, please check <a href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/" target="_blank" rel="noreferrer">the Gay Travel Index USA on the Spartacus Website</a>.</p>
          {/if}
          <Button on:buttonClick={clearCountry}>
            Clear Country
          </Button>
          {/if}
        </div>
          <IndicatorsChart  />
    </div>
    </div>

</section>
</main>

<Footer />

</div>

<style>
  
  .wrapper {
    padding: 40px;
    width: 100%;
    max-width: 900px;
  }

  p {
    margin-right: auto;
    margin-left: auto;
  }

  .mapWrapper {
    margin: 40px 0;
  }

  .continentChartWrapper {
    margin-bottom: 20px;
  }

  .dataInfo {
    font-size: 1rem;
  }

  .note {
    font-size: 1rem;
  }

  .circleSvgWrapper {
    display: inline-block;
  }

  .mousePointerIconWrapper {
    top: 10px;
    left: 0px;
    margin-left: -15px;
    position: relative;
    color: var(--mousePointerColor);
    display: inline-block;
    margin-right: 2px;
  }

  .hoverInfo {
    left: 15px;
  }

</style>
