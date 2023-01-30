<script>
    import AxisContinentYears from "./AxisContinentYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"
    import { slide, fade, fly } from "svelte/transition"

    export let selectedContinent
    export let selectedContinentData
    export let yearScale
    export let countryScale
    export let totalScale
    export let margin
    export let handleClick
    export let handleHover
    export let hoveredCountryYear
    export let innerWidth

    $: years = yearScale.domain()

    // const scrollIntoView = (node) => {
    //     node.scrollIntoView()
    // }


</script>

<g class="innerChartWrapper">
    <text class="continentName" x={innerWidth/2 + margin.left} y= 30 text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-size="1rem">{selectedContinent}</text>
    <!-- use:scrollIntoView -->
    <g class="heatmap continentHeatmap" transform="translate({margin.left}, {margin.top})">
    <AxisContinentYears {yearScale}/>
    <AxisCountries {countryScale} {handleClick} {selectedContinent}/>
    <!-- {#each Array.from(selectedContinentData.keys()) as country, i (country)}  -->
    {#each Array.from(selectedContinentData.keys()) as country, i (`${selectedContinent}${country}`)} 
    <g 
        class="country"
        in:slide={{ duration: 200, delay: 50 + 50 * i}} 
        >  
    {#each selectedContinentData.get(country).sort((a, b) => a.year - b.year) as d}
      <g 
        class="year"
        on:click={(e) => handleClick(e, d.country)}
        on:keypress={(e) => handleClick(e, d.country)}
        on:mouseover={(e) => handleHover(e, d)}
        on:focus={(e) => handleHover(e, d)}
        on:mouseleave={(e) => handleHover(e, null)}
        >
        <!-- tabindex="0" -->
      <rect
      x={yearScale(d.year)}
      y={countryScale(d.country)}
      width={yearScale.bandwidth()}
      height={countryScale.bandwidth()}
      fill={totalScale(d.total)}
      rx=5
      ry=5
      />

      
      <text
      class="total"
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
                d === hoveredCountryYear
                ? "0.9rem"
                : "0.8rem"
                }
      >{d.total}</text> 
                      <!-- font-size={
                    d.year === 2021 || hoveredCountryYear
                    ? d.year === 2021 || hoveredCountryYear === d
                        ? "0.9rem"
                        : "0.8rem"
                    : "0.8rem"
                    } -->
       </g>
    {/each}
</g>
        {/each}
    </g>

  </g>


  <style>
    .heatmap {
        position: relative;
    }

    /* .continentName {
        transition: font-size 2000ms ease font-weight 2000ms ease;
    } */

    /* .country {
        transition: fill 800ms ease, font-size 800ms ease font-weight 800ms ease;
    } */

    .year {
        cursor: pointer;
    }

    .total {
        /* font-size: 0.8rem; */
        opacity: 0.7;
    }

    text {
        transition: font-size 100ms ease, font-weight 100ms ease;
    }
  </style>

