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
style="
  --bodyColor: {COLORS.gray["700"]};
  --linkColor: {COLORS.primary["500"]};
  --linkHoverColor: {COLORS.primary["900"]};
  
  "
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
              The heatmap below shows the Gay Travel Index for all countries and years, sorted by the 2023 ranking.
              The Gay Travel Index is based on ratings from various categories including anti-discrimination laws, 
              transgender rights and violence against the LGBTQ+ community. In recent years the index has become 
              more diverse with the addition of new categories.
             </p>


  
              <p>
                <Select continents={$continents} on:selectContinent={handleSelect} />

            or search for a country
            <Search on:searchCountry={handleSearch}/>.
          </p>

          <p> 
            Click on a country’s name for information about its ratings in the different categories.
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
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--bodyColor);
    width: 100%;
    max-width: 900px;
  }

  a {
    font-weight: 500;
    color: var(--linkColor);
    text-decoration: inherit;
  }

  a:hover {
    color: var(--linkHoverColor);
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
