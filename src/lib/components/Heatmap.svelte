<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"
    import HeatmapTooltip from "./HeatmapTooltip.svelte"
    // import { chartFontSizeScale } from "../utils/fontSizeScales"
    import { chartFontSize } from "../stores/responsiveFontSize"
    import { chartWidth } from "../stores/dimensions"
    import { prefersReducedMotion } from "../stores/preferesReducedMotion"
    // import { clickedContinentData } from "../stores/clickedContinent"
    import { data, data2021, data2021Map} from "../stores/data"
    import { selectedContinent } from "../stores/selectedContinent"
    import { selectedCountry } from "../stores/selectedCountry"

    import { slide, fade, fly } from "svelte/transition"
    import { extent, max, min, group } from "d3-array"
    import { scaleBand, scaleSequential } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"
    import { onMount } from "svelte";
    import { heatmapLoaded } from "../stores/heatmapLoaded"
    import { beforeUpdate, afterUpdate } from "svelte"

    // export let selectedContinent
    // export let data
    // export let selectedCountry
    // export let width
    export let years
    export let totalScale
    // export let currentWindowWidth

    // afterUpdate(() => {
    //   $heatmapLoaded = true
    // })

    // beforeUpdate(() => {
    //   $heatmapLoaded = false
    // })

    // $: console.log("heatmap loaded", $heatmapLoaded)


    // let chartFontSize

    // $: chartFontSize = chartFontSizeScale(currentWindowWidth)

    // $: console.log("chart", $chartFontSize)


    // $: console.log($data2021, $data2021Map, topContinentCountry, $data2021Map.get(topContinentCountry).total)

    // ${selectedContinentData.get(selectedContinentData.keys().next().value).shift().total

    // let width = 800

    // let selectedContinentData

// clickedContinentData.subscribe(data => {
//   selectedContinentData = data
// })

// $: console.log($clickedContinentData)

    // $: years = yearScale.domain()

    $: height = max([450,  selectedContinentCountries.length * 30])

    // let ready = false
    // let height

    // $: console.log("height", height, "ready", ready, selectedContinent$data)

    // onMount(() => {
    //   setTimeout(() => {
    //       height = max([450,  selectedContinentCountries.length * 30])
    //         ready = true;
    //     }, 1000);
    // })

    $: selectedContinentCountries = [... new Set(
        $data
      // .filter(d => d.continent == selectedContinent)
      .filter(d => {
        if ($selectedContinent === "All") return true
        else return d.continent === $selectedContinent
      })
      .filter(d => d.year === 2021)
      .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      .map(d => d.country)
      )]


    const margin = {
        top: 60, // 60
        right: 10,
        bottom: 5,
        left: 200 //195 //200//210 // 220
  }

  $: innerWidth = $chartWidth - margin.left - margin.right
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

    // const totalScale = scaleSequential(interpolateRdYlBu)
    // .domain(extent(data.map(d => d.total)))


    $: selectedContinentData = group(
    $data.filter(d => {
      if ($selectedContinent === "All") return true
      else return d.continent === $selectedContinent
    })
      .sort((a, b) => {
        if(a.year !== 2021) return 1;
        else if(b.year !== 2021) return -1;
        else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
      }), d => d.country)


      // $: console.log("heatmap", selectedContinentData, $selectedContinent)

      
      let hoveredCountryYear


      const handleHeatmapHover = (d) => {

          hoveredCountryYear = d
          
      }


      // $: console.log($prefersReducedMotion)


      $: transitionToUse = $prefersReducedMotion ? () => {} : slide

      $: topContinentCountry = selectedContinentData.keys().next().value


    // const scrollIntoView = (node) => {
    //     node.scrollIntoView()
    // }

    // $: console.log(selectedContinentData, selectedContinentDataX)

    // $:console.log(selectedContinentData, selectedContinentData.keys().next().value, selectedContinentData.get(selectedContinentData.keys().next().value).shift().total)

</script>

<div class="continentHeatmap wrapper">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg width={$chartWidth} {height} tabindex="0" role="figure" aria-describedby="heatmapDescription">
      <!-- <title id="heatmapTitle">{`Heatmap of the Gay Travel Index in different countries ${selectedContinent === "All" ? "" : `in ${selectedContinent}`} from 2012 to 2021`}</title> -->
      <desc id="heatmapDescription">
        <!-- {`
        Heatmap of the Gay Travel Index in different countries ${selectedContinent === "All" ? "" : `in ${selectedContinent}`} from 2012 to 2021.
        ${selectedContinent === "All" 
        ? `Among all countries, Canada has the best policies for LGBTQ+ people, with a total rating of 13.
        At the bottom of the list is Chechnya, with a rating of -19.`
        : `Considering only countries in ${selectedContinent}, the country with the highest ranking is ${selectedContinentData.keys().next().value}, with a rating of ${selectedContinentData.get(selectedContinentData.keys().next().value).shift().total}.
        `}`} -->
        {`
          Heatmap of the Gay Travel Index in different countries ${$selectedContinent === "All" ? "" : `in ${$selectedContinent}`} from 2012 to 2021.
          ${$selectedContinent === "All" 
          ? `Among all countries, Canada has the best policies for LGBTQ+ people, with a total rating of 13.
          At the bottom of the list is Chechnya, with a rating of -19.`
          : `Considering only countries in ${$selectedContinent}, the country with the highest ranking is ${topContinentCountry}, with a rating of ${$data2021Map.get(topContinentCountry).total}.
          `}`}
      </desc>
        <text 
          class="continentName" 
          x={innerWidth/2 + margin.left} 
          y= 30 
          text-anchor="middle" 
          dominant-baseline="middle" 
          font-weight="bold" 
          font-size={`${$chartFontSize}rem`}
          role="presentation"
          aria-hidden="true"
          >
          {`${$selectedContinent === "All" ? "All continents" : $selectedContinent}`}
        </text>
        <!-- font-size="1rem" -->
        <!-- use:scrollIntoView -->
        <!-- <text x=0 y=60 text-anchor="start" dominant-baseline="middle" font-size="0.9rem">Click on country for more information.</text> -->
        <AxisYears {yearScale} {margin}/>
        <AxisCountries on:countryClick {margin} {countryScale} {selectedContinentData}/>
    
        <g class="chart continentHeatMap" transform="translate({margin.left}, {margin.top})">
            <g class="innerChart innerContinentHeatmap">
            <!-- {#each Array.from(selectedContinentData.keys()) as country, i (country)}  -->
            {#each Array.from(selectedContinentData.keys()) as country, i (`${$selectedContinent}${country}`)} 
            <g 
                class="country"
                in:transitionToUse={{ duration: 300, delay: 50 + 50 * i}} 
                >  
                <!-- in:slide={{ duration: 300, delay: 50 + 50 * i}}  -->
            {#each selectedContinentData.get(country).sort((a, b) => a.year - b.year) as d}
              <g 
                class="year"
                id={`${country}.${d.year}`}
                >
                <!-- <g 
                class="year"
                on:mouseover={() => handleHeatmapHover(d)}
                on:focus={() => handleHeatmapHover(d)}
                on:mouseleave={() => handleHeatmapHover(null)}
                > -->
                <!-- tabindex="0" -->
                <!-- on:click={(e) => handleClick(e, d.country)}
                on:keypress={(e) => handleClick(e, d.country)} -->
              <rect
              class="totalRect"
              x={yearScale(d.year)}
              y={countryScale(d.country)} 
              width={yearScale.bandwidth()}
              height={countryScale.bandwidth()}
              fill={totalScale(d.total)}
              rx=5
              ry=5
              on:mouseover={() => handleHeatmapHover(d)}
              on:focus={() => handleHeatmapHover(d)}
              on:mouseleave={() => handleHeatmapHover(null)}
              on:blur={() => handleHeatmapHover(null)}
              on:keydown={(e) => {e.key === "Escape" ? handleHeatmapHover(null) : null}}
              tabindex="-1"
              />
              <!-- tabindex={i + 1} -->
              
              <text
              class="totalText"
              fill={
                d.total < 8 && d.total > -15 ? "black" : "white"
              }
              x={yearScale(d.year)}
              y={countryScale(d.country)}
              dx={yearScale.bandwidth()/2}
              dy={countryScale.bandwidth()/2}
              text-anchor="middle"
              dominant-baseline="middle"
              font-weight={
                d.year === 2021 || hoveredCountryYear
                ? d.year === 2021 || hoveredCountryYear === d 
                    ? "bold"
                    : "normal"
                : "normal"
                }
                font-size={
                    d.year === 2021 && d === hoveredCountryYear
                    ? `${0.95 * $chartFontSize}rem`
                    : d.year === 2021 || d === hoveredCountryYear
                    ? `${0.85 * $chartFontSize}rem`//`${chartFontSize * 0.9}px`
                    : `${0.75 * $chartFontSize}rem`
                    }
              role="presentation"
              aria-hidden="true"
              >{d.total}</text> 
<!-- 
              font-size={
                d.year === 2021 && d === hoveredCountryYear
                ? "1rem"
                : d.year === 2021 || d === hoveredCountryYear
                ? "0.9rem"
                : "0.8rem"
                } -->
                 
              <!-- font-size={
                d === hoveredCountryYear
                ? "0.9rem"
                : "0.8rem"
                } -->
        
                <!-- font-size={
                    d.year === 2021 || hoveredCountryYear
                    ? d.year === 2021 || hoveredCountryYear === d
                        ? "1rem"
                        : "0.8rem"
                    : "0.8rem"
                    } -->
               </g>
            {/each}
        </g>
                {/each}
            </g>
        
          </g>
        
    
    
    </svg>

    <!-- {#if hoveredCountryYear && !selectedCountry}
    <HeatmapTooltip data={hoveredCountryYear} {yearScale} {countryScale} {totalScale} {margin} {innerWidth}/>
    {/if} -->

    {#if hoveredCountryYear}
    <HeatmapTooltip tooltipData={hoveredCountryYear} {yearScale} {totalScale} {margin} {innerWidth} {countryScale}/>
    {/if}
</div>


  <style>
    .wrapper {
      position: relative;
    }

    /* .innerContinentHeatmap {
        position: relative;
    } */
    /* .continentHeatmap {
      position: relative;
    } */

    /* .continentName {
        transition: font-size 2000ms ease font-weight 2000ms ease;
    } */

    /* .country {
        transition: fill 800ms ease, font-size 800ms ease font-weight 800ms ease;
    } */

    .year {
        cursor: pointer;
    }

    .totalText {
        /* font-size: 0.8rem; */
        opacity: 0.7;
        pointer-events: none;
    }

    /* .totalRect {
      pointer-events: none;
    } */

    text {
        transition: font-size 200ms ease, font-weight 200ms ease;
    }
  </style>

