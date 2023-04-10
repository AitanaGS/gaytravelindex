<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"
    import HeatmapTooltip from "./HeatmapTooltip.svelte"

    import { 
      data2023Map,
      years,
      activeCountries,
      activeData} from "../stores/data"
    import { chartFontSize } from "../stores/responsiveFontSize"
    import { isMobile, isSmall, width } from "../stores/dimensions"
    import { prefersReducedMotion } from "../stores/preferesReducedMotion"
    import { selectedContinent } from "../stores/selectedContinent"
    import { activeSearch } from "../stores/search"

    import { COLORS } from "../utils/constants"

    import { slide } from "svelte/transition"
    import { scaleBand } from "d3-scale"

    export let totalScale

    $: chartWidth = $width * 0.8

    $: height = $activeCountries.length * 30 + 100


    $: margin = {
        top: 60,
        right: $isSmall ? 5 : 10,
        bottom: 5,
        left: $isSmall ? 130 : 200
    }


    $: innerWidth = chartWidth - margin.left - margin.right
    $: innerHeight = height - margin.top - margin.bottom

    $: yearScale = scaleBand()
      .domain($years)
      .range([0, innerWidth])
      .padding(0.05)
      .paddingOuter(0.1)

    $: countryScale = scaleBand()
      .domain($activeCountries)
      .range([0, innerHeight])
      .paddingInner(0.05)
      .paddingOuter(0.3)

      
    let hoveredCountryYear


    const handleHeatmapHover = (d) => {

      hoveredCountryYear = d
          
    }

    $: transitionToUse = $prefersReducedMotion || $activeSearch ? () => {} : slide

    $: topContinentCountry = !$activeSearch && $activeData.keys().next().value

    $: console.log(topContinentCountry)

</script>


{#key $activeSearch}
<div class="continentHeatmap wrapper">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg width={chartWidth} height={height} tabindex="0" role="figure" aria-describedby="heatmapDescription">
      <desc id="heatmapDescription">
        {
        !$activeSearch
        ? `
          Heatmap of the Gay Travel Index for different countries ${$selectedContinent === "All" ? "" : `in ${$selectedContinent}`}, from 2012 to 2023.
          ${$selectedContinent === "All" 
          ? `Among all countries, Canada has the best policies for LGBTQ+ people, with a total rating of 13.
          At the bottom of the list is Chechnya, with a rating of -19.`
          : `Considering only countries in ${$selectedContinent}, the country with the highest ranking is ${topContinentCountry}, with a rating of ${$data2023Map.get(topContinentCountry).total}.
          `}`
        : $activeData.size === 0
          ? "No results found."
          : ""
          }
      </desc>
        <text 
          class="continentName" 
          x={innerWidth/2 + margin.left} 
          y= 30 
          text-anchor="middle" 
          dominant-baseline="middle" 
          fill={COLORS.gray["800"]}
          font-weight="bold" 
          font-size={`${$chartFontSize}rem`}
          role="presentation"
          aria-hidden="true"
          >
          {`${$selectedContinent === "All" ? "All continents" : $selectedContinent}`}
        </text>
        <AxisYears {yearScale} {margin}/>
        <AxisCountries on:countryClick {margin} {countryScale} />
    
        <g class="chart continentHeatMap" transform="translate({margin.left}, {margin.top})">
            <g class="innerChart innerContinentHeatmap">
            {#each Array.from($activeData.keys()) as country, i (`${country}`)} 
            <g 
                class="country"
                in:transitionToUse={{ duration: 300, delay: 100 + 50 * i}}
                >
            {#each $activeData.get(country).sort((a, b) => a.year - b.year) as d}
              <g 
                class="year"
                id={`${country}.${d.year}`}
                >
              <rect
              class="totalRect"
              x={yearScale(d.year)}
              y={countryScale(d.country)} 
              width={yearScale.bandwidth()}
              height={countryScale.bandwidth()}
              fill={totalScale(d.total)}
              rx=5
              ry=5
              on:mouseenter={() => handleHeatmapHover(d)}
              on:focus={() => handleHeatmapHover(d)}
              on:mouseleave={() => handleHeatmapHover(null)}
              on:blur={() => handleHeatmapHover(null)}
              on:keydown={(e) => {e.key === "Escape" ? handleHeatmapHover(null) : null}}
              tabindex="-1"
              />
              <text
              class="totalText"
              fill={
                d.total < 9 && d.total > -17 ? COLORS.gray["900"] : COLORS.gray["50"]
              }
              x={yearScale(d.year)}
              y={countryScale(d.country)}
              dx={yearScale.bandwidth()/2}
              dy={countryScale.bandwidth()/2}
              text-anchor="middle"
              dominant-baseline="middle"
              font-weight={
                d.year === 2023 || hoveredCountryYear
                ? d.year === 2023 || hoveredCountryYear === d 
                    ? "bold"
                    : "normal"
                : "normal"
                }
                font-size={
                    $isMobile 
                      ? `${0.75 * $chartFontSize}rem`
                      : d.year === 2023 && d === hoveredCountryYear
                        ? `${1 * $chartFontSize}rem`
                        : d.year === 2023 || d === hoveredCountryYear
                        ? `${0.95 * $chartFontSize}rem`
                        : `${0.85 * $chartFontSize}rem`
                    }
              role="presentation"
              aria-hidden="true"
              >{d.total}</text> 
               </g>
            {/each}
        </g>
                {/each}
            
            </g>
            {#if $activeSearch === true && $activeData.size === 0}

            <text
              fill={COLORS.gray["800"]}
              x={innerWidth / 2}
              y={innerHeight / 2 + 10}
              text-anchor="middle"
              dominant-baseline="middle"
              font-weight="normal"
                font-size={`${0.9 * $chartFontSize}rem`}
            
            >No results found.</text>
  
            {/if}
        
          </g>  
    </svg>

    {#if hoveredCountryYear}
    <HeatmapTooltip tooltipData={hoveredCountryYear} {yearScale} {totalScale} {margin} {innerWidth} {countryScale}/>
    {/if}
</div>
{/key}

  <style>
    .wrapper {
      position: relative;
    }

    .year {
        cursor: pointer;
    }

    .totalText {
        opacity: 0.7;
        pointer-events: none;
    }

    text {
        transition: font-size 200ms ease, font-weight 200ms ease;
    }

  </style>

