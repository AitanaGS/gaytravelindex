<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"
    // import Tooltip from "./Tooltip.svelte"

    export let selectedContinent
    export let selectedContinentData
    export let yearScale
    export let countryScale
    export let totalScale
    export let width
    export let margin
    export let handleClick
    export let handleHover
    export let hoveredCountryYear
    // export let innerWidth

    $: years = yearScale.domain()

    // let hoveredCountryYear
    // $: console.log(hoveredCountryYear)
    // $: console.log(innerWidth)


</script>

<g class="innerChartWrapper">
    <text x={width/2} y= 30 text-anchor=middle dominant-baseline="middle" font-weight="bold">{selectedContinent}</text>
    <g class="heatmap continentHeatmap" transform="translate({margin.left}, {margin.top})">
    <AxisYears {yearScale}/>
    <AxisCountries {countryScale} {handleClick} />
    {#each selectedContinentData as d}
      <g 
        class="countryList"
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
                hoveredCountryYear
                ? hoveredCountryYear === d
                    ? "0.9rem"
                    : "0.8rem"
                : "0.8rem"
                }
      >{d.total}</text> 
       </g>
    {/each}

    </g>


  </g>


  <style>
    .heatmap {
        position: relative;
    }

    .countryList {
        cursor: pointer;
    }

    .total {
        /* font-size: 0.8rem; */
        opacity: 0.7;
    }

    text {
        transition: font-size 300ms ease, font-weight 300ms ease;
    }
  </style>