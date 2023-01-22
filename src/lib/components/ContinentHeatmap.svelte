<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"

    export let selectedContinent
    export let selectedContinentData
    export let yearScale
    export let countryScale
    export let totalScale
    export let width
    export let margin
    export let handleClick

    $: years = yearScale.domain()


</script>

<g class="innerChartWrapper">
    <text x={width/2} y= 30 text-anchor=middle dominant-baseline="middle" font-weight="bold">{selectedContinent}</text>
    <g class="heatmap continentHeatmap" transform="translate({margin.left}, {margin.top})">
    <AxisYears {yearScale} />
    <AxisCountries {countryScale} {handleClick}/>
    {#each selectedContinentData as d}
      {#each years as year}
      <g 
        class="countryList"
        on:click={(e) => handleClick(e, d.country)}
        on:keypress={(e) => handleClick(e, d.country)}>
      <rect
      x={yearScale(d.year)}
      y={countryScale(d.country)}
      width={yearScale.bandwidth()}
      height={countryScale.bandwidth()}
      fill={totalScale(d.total)}
      rx=5
      ry=5
      />
      <!-- <text 
      fill="black"
      x={yearScale(d.year)}
      y={countryScale(d.country)}
      dy={countryScale.bandwidth()/2}
      >{d.country}</text> -->
      <!-- <text 
      fill="black"
      x={yearScale(d.year)}
      y={countryScale(d.country)}
      dy={countryScale.bandwidth()/2}
      >{d.year}</text> -->
      <text
      fill="black"
      x={yearScale(d.year)}
      y={countryScale(d.country)}
      dx={yearScale.bandwidth()/2}
      dy={countryScale.bandwidth()/2}
      text-anchor="middle"
      dominant-baseline="middle"
      font-weight={d.year === 2021 ? "bold" : "normal"}
      >{d.total}</text> 
       </g>
      {/each}

    {/each}
    </g>

  </g>