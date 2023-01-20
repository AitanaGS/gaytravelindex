<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"

    export let selectedData
    export let yearScale
    export let countryScale
    export let totalScale
    export let margin

    $: years = yearScale.domain()


</script>

 <g
    class="heatmap continentHeatmap"
    transform="translate({margin.left}, {margin.top})">
    <AxisYears {yearScale} />
    <AxisCountries {countryScale} />
    {#each selectedData as d}
      {#each years as year}
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
      >{d.total}</text> 

      {/each}

    {/each}

  </g>