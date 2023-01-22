<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisIndicators from "./AxisIndicators.svelte"

    export let selectedCountry
    export let selectedCountryData
    export let yearScale
    export let indicatorScale
    export let indicatorValueScale
    export let indicatorVariables
    export let indicatorLabelsLookup
    export let width
    export let margin
    // export let handleClick

    $: years = yearScale.domain()
    // $: indicators = indicatorScale.domain()


</script>

 <g
    class="innerChartWrapper">
    <text x={width/2} y= 30 text-anchor=middle dominant-baseline="middle" font-weight="bold">{selectedCountry}</text>
    <g class="heatmap countryHeatmap" transform="translate({margin.left}, {margin.top})">
        <AxisYears {yearScale} />
        <AxisIndicators {indicatorScale} {indicatorVariables} {indicatorLabelsLookup}/>
        {#each selectedCountryData as d}
          {#each years as year}
          <g 
            class="indicatorList"
            >
          <rect
          x={yearScale(d.year)}
          y={indicatorScale(d.indicator)}
          width={yearScale.bandwidth()}
          height={indicatorScale.bandwidth()}
          fill={indicatorValueScale(d.value)}
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
                    <!-- stroke={d.year === 2021 ? "white" : "none"}
          stroke-width={d.year === 2021 ? 5 : 1}
          paint-order="stroke" -->
          <text
          fill="black"
          x={yearScale(d.year)}
          y={indicatorScale(d.indicator)}
          dx={yearScale.bandwidth()/2}
          dy={indicatorScale.bandwidth()/2}
          text-anchor="middle"
          dominant-baseline="middle"
          font-weight={d.year === 2021 ? "bold" : "normal"}
          >{d.value}</text> 
           </g>
          {/each}
    
        {/each}
    </g>

  </g>