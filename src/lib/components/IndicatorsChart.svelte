<script>

    import AxisIndicators from './AxisIndicators.svelte'
    import AxisIndicatorValues from './AxisIndicatorValues.svelte'
    import IndicatorTooltip from './IndicatorTooltip.svelte'
    import { clickedCountry } from '../stores/clickedCountry'
    import { slide, fly } from "svelte/transition"
    import { extent, min, max } from "d3-array"
    import { tidy, pivotLonger } from '@tidyjs/tidy'
    import { scaleBand, scaleLinear, scaleSequential, scaleDiverging } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"
    import { chartFontSize } from '../stores/responsiveFontSize'


    export let data
    // export let selectedCountry
    export let width
    export let years


    let selectedCountry = ""

    clickedCountry.subscribe(country => {
    selectedCountry = country
  })


    const indicatorLabels = [
        "Antidiscrimination Legislation",
        "Marriage / Civil Partnership",
        "Adoption Allowed",
        "Transgender Rights",
        "Intersex / 3rd Option",
        "Equal Age of Consent",
        "'Conversion Therapy'",
        "LGBT Marketing",
        "Religious Influence",
        "HIV Travel Restrictions",
        "Anti-Gay Laws",
        "Homosexuality Illegal",
        "Pride Banned",
        "Locals Hostile",
        "Prosecution",
        "Murders",
        "Death Sentence"
    ] 

    const camelize = (str) => str.toLowerCase().replaceAll("'", '').replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

    const indicatorVariables = indicatorLabels.map(label => label === "Intersex / 3rd Option" ? label = "intersex3RdOption"
                                                        : label ===  "Transgender Rights" ? label = "transGenderRights" 
                                                        : camelize(label))

    const indicatorLabelsLookup = new Map()

    indicatorLabels.forEach((label, i) => {
        indicatorLabelsLookup.set(indicatorVariables[i], label)
    })




  indicatorLabelsLookup.set("antidiscrimination Legislation", "Antidiscrimination Legislation")


  $: height = indicatorVariables.length * 40 // 50

  $: innerWidth = width - margin.left - margin.right
  $: innerHeight = height - margin.top - margin.bottom


  const margin = {
    top: 60, // 80
    right: 10,
    bottom: 60,
    left: 210
  }

  const dataLonger = tidy(data, pivotLonger({
      cols: indicatorVariables,
      namesTo: 'indicator',
      valuesTo: 'value'
    }))


  $: indicatorScale = scaleBand()
    .domain(indicatorVariables)
    .range([0, innerHeight])
    .paddingInner(0.1)
    .paddingOuter(0.2)

// const indicatorValueColorScale = scaleSequential(interpolateRdYlBu)
//     .domain(extent(dataLonger.map(d => d.value)))

const indicatorValueColorScale = scaleDiverging(interpolateRdYlBu)
    .domain([min(dataLonger, d => d.value), 0, max(dataLonger, d => d.value)])



$: indicatorValueScale = scaleLinear()
    .domain(extent(dataLonger.map(d => d.value)))
    .range([20, innerWidth - 20])


$: selectedCountryData = dataLonger.filter(d => d.country == selectedCountry).filter(d => d.value !== undefined)

$: selectedCountryData2021 = selectedCountryData.filter(d => d.year === 2021)


let hoveredIndicator

const handleIndicatorHover = (e, d) => {
    hoveredIndicator = d
}

// TODO: check grid

</script>

<div class="wrapper">
    <svg {width} {height}>
        {#if selectedCountry}
        <text
            class="countryName"
            x={innerWidth / 2 + margin.left}
            y=30
            text-anchor=middle
            dominant-baseline="middle"
            font-weight="bold"
            font-size={`${$chartFontSize}rem`}>
            <!-- y=10 -->
                {selectedCountry} 2021
        </text>
        {/if}
        <!-- {#if !selectedCountry}
            <text
            class="countryName"
            x={innerWidth / 2 + margin.left}
            y=50
            text-anchor=middle
            dominant-baseline="middle"
            font-weight="bold"
            font-size="1rem">
                Country Information
        </text>
        {/if} -->
        <AxisIndicators {indicatorScale} {indicatorVariables} {indicatorLabelsLookup} {margin}/>
        <AxisIndicatorValues {indicatorValueScale} {margin} {innerHeight}/>
        <g
        class="chart indicatorsChart" 
        transform="translate({margin.left}, {margin.top})"
         >
            <g
            class="innerChart innerIndicatorsChart">
                    {#each selectedCountryData2021 as d, i (`${d.country}${d.indicator}`)}
                    <g 
                        transform="translate(0, {indicatorScale.bandwidth()/2})"
                    >
                    <circle
                        cx={indicatorValueScale(d.value)}
                        cy={indicatorScale(d.indicator)}
                        r={hoveredIndicator === d ? 12 : 10}
                        fill={indicatorValueColorScale(d.value)}
                        stroke="dimgray"
                        class="indicator"
                        in:fly={{ x: d.value < 0 ? 100 : d.value === 0 ? 0 : -100, duration: 200, delay: 0}}
                        on:mouseover={(e) => handleIndicatorHover(e, d)}
                        on:focus={(e) => handleIndicatorHover(e, d)}
                        on:mouseleave={(e) => handleIndicatorHover(e, null)}
                        on:keydown={(e) => {e.key === "Escape" ? handleIndicatorHover(e, null) : null}}
                        />
                    {#if d.value !== 0}
                    <line 
                        x1={indicatorValueScale(0)}
                        x2={indicatorValueScale(d.value)}
                        y1={indicatorScale(d.indicator)}
                        y2={indicatorScale(d.indicator)}
                        stroke={indicatorValueColorScale(d.value)}
                        stroke-width=2
                    />
                    {/if}
                </g>
                {/each}
        
            </g>
        
        </g>

        
    </svg>

    {#if hoveredIndicator}
    <IndicatorTooltip indicator2021Data={hoveredIndicator} data={selectedCountryData} {years} {indicatorScale} {indicatorValueScale} {indicatorLabelsLookup} {indicatorValueColorScale} {margin} {innerWidth}/>
    {/if}
</div>

<style>
    .wrapper {
        position: relative;
    }

    /* .innerIndicatorsChart {
        position: relative;
    } */

    .countryName {
        transition: all 100ms ease;
    }

    .indicator {
        cursor: pointer;
        transition: r 100ms ease;
    }
</style>
