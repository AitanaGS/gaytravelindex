<script>
    import AxisYears from "./AxisYears.svelte"
    import AxisCountries from "./AxisCountries.svelte"
    import HeatmapTooltip from "./HeatmapTooltip.svelte"
    import { slide, fade, fly } from "svelte/transition"
    import { extent, max, min, group } from "d3-array"
    import { scaleBand, scaleSequential } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"

    export let selectedContinent
    export let handleClick
    export let handleHover
    export let hoveredCountryYear
    export let data
    export let selectedCountry
    export let width
    export let years
    export let totalScale



    // let width = 800

    // const years = [... new Set(data.map(d => d.year))].sort()


    // $: years = yearScale.domain()

    $: height = max([450,  selectedContinentCountries.length * 30])

    $: selectedContinentCountries = [... new Set(
        data
      // .filter(d => d.continent == selectedContinent)
      .filter(d => {
        if (selectedContinent === "Overview") return true
        else return d.continent === selectedContinent
      })
      .filter(d => d.year === 2021)
      .sort((a, b) => a.ranking - b.ranking ||  a.country.localeCompare(b.country) )
      .map(d => d.country)
      )]


    const margin = {
        top: 60,
        right: 10,
        bottom: 60,
        left: 210 // 220
  }

  $: innerWidth = width - margin.left - margin.right
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
    data.filter(d => {
      if (selectedContinent === "Overview") return true
      else return d.continent === selectedContinent
    })
      .sort((a, b) => {
        if(a.year !== 2021) return 1;
        else if(b.year !== 2021) return -1;
        else return a.ranking - b.ranking ||  a.country.localeCompare(b.country)
      }), d => d.country)




    // const scrollIntoView = (node) => {
    //     node.scrollIntoView()
    // }

</script>

<div>
    <svg {width} {height}>
        <text class="continentName" x={innerWidth/2 + margin.left} y= 30 text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-size="1rem">{selectedContinent}</text>
        <!-- use:scrollIntoView -->
        <AxisYears {yearScale} {margin}/>
        <AxisCountries {countryScale} {handleClick} {selectedContinent} {margin}/>
    
        <g class="chart continentHeatMap" transform="translate({margin.left}, {margin.top})">
            <g class="innerChart innerContinentHeatmap">
            <!-- {#each Array.from(selectedContinentData.keys()) as country, i (country)}  -->
            {#each Array.from(selectedContinentData.keys()) as country, i (`${selectedContinent}${country}`)} 
            <g 
                class="country"
                in:slide={{ duration: 300, delay: 50 + 30 * i}} 
                >  
            {#each selectedContinentData.get(country).sort((a, b) => a.year - b.year) as d}
              <g 
                class="year"
                on:mouseover={(e) => handleHover(e, d)}
                on:focus={(e) => handleHover(e, d)}
                on:mouseleave={(e) => handleHover(e, null)}
                >
                <!-- tabindex="0" -->
                <!-- on:click={(e) => handleClick(e, d.country)}
                on:keypress={(e) => handleClick(e, d.country)} -->
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
                    d.year === 2021 && d === hoveredCountryYear
                    ? "1rem"
                    : d.year === 2021 || d === hoveredCountryYear
                    ? "0.9rem"
                    : "0.8rem"
                    }
              >{d.total}</text> 
                 
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

    {#if hoveredCountryYear && !selectedCountry}
    <HeatmapTooltip data={hoveredCountryYear} {yearScale} {countryScale} {totalScale} {margin} {innerWidth}/>
    {/if}
</div>


  <style>
    .innerContinentHeatmap {
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

