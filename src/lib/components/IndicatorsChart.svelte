<script>

    import AxisIndicators from './AxisIndicators.svelte'
    import AxisIndicatorValues from './AxisIndicatorValues.svelte'
    import IndicatorTooltip from './IndicatorTooltip.svelte'
    import { selectedCountry} from '../stores/selectedCountry'
    import { slide, fly } from "svelte/transition"
    import { extent, min, max } from "d3-array"
    import { tidy, pivotLonger } from '@tidyjs/tidy'
    import { scaleBand, scaleLinear, scaleSequential, scaleDiverging } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"
    import { chartFontSize } from '../stores/responsiveFontSize'
    import { isDesktop, isMobile, isTablet, isSmallMobile, chartWidth } from '../stores/dimensions'
    import { data } from "../stores/data"


    // export let data
    // export let selectedCountry
    // export let width
    export let years


//     let selectedCountry = ""

//     clickedCountry.subscribe(country => {
//     selectedCountry = country
//   })

//   $:console.log($selectedCountry)


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

  $: innerWidth = $chartWidth - margin.left - margin.right
  $: innerHeight = height - margin.top - margin.bottom


  const margin = {
    top: 60, // 80
    right: 5,
    bottom: 5,
    left: 230//210
  }

  const dataLonger = tidy($data, pivotLonger({
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


$: selectedCountryData = dataLonger.filter(d => d.country == $selectedCountry).filter(d => d.value !== undefined)

$: selectedCountryData2021 = selectedCountryData.filter(d => d.year === 2021)

// $: console.log(hoveredIndicator, hoveredIndicatorData)

const indicatorDataLookup = new Map()

$: if (selectedCountryData) {
    // console.log(selectedCountryData, indicatorVariables)
    indicatorVariables.forEach(indicator => {
        indicatorDataLookup.set(indicator,
        selectedCountryData.filter(d => d.indicator === indicator).sort((a, b) => a.year - b.year))
        // "test")
        // selectedCountryData.filter(d => d.indicator === indicator).sort((a, b) => a.year - b.year))
    })

    
//     selectedCountryData.forEach((data, i) => {
//     indicatorDataLookup.set(indicatorLabelsLookup.get(data[0].indicator), data.filter(d => d.indicator === data.indicator).sort((a, b) => a.year - b.year))
// })

}
// $: console.log(indicatorDataLookup)


let hoveredIndicator
let hoveredIndicatorData   

// let indicatorData

// let indicatorDescription

// $: console.log(indicatorDataLookup, hoveredIndicator, hoveredIndicatorData)

const handleIndicatorHover = (e, d) => {
    hoveredIndicator = d

    if (d) {
        // hoveredIndicatorData = selectedCountryData.filter(data => data.indicator === d.indicator).sort((a, b) => a.year - b.year)
        hoveredIndicatorData = indicatorDataLookup.get(d.indicator)
    } else {
        hoveredIndicatorData = null
    }

    // if (d === null) {
    //     indicatorData = null
    //     indicatorDescription = ""
    // } else {
    //     indicatorData = selectedCountryData.filter(d => d.indicator === hoveredIndicator.indicator).sort((a, b) => a.year - b.year)
    //     indicatorDescription = indicatorData.reduce((last, curr) => {
    //             return last + `${curr.year}: ${curr.value}. `
    //         }, `${indicatorLabelsLookup.get(hoveredIndicator.indicator)}: `)
    // }

    }
// $: console.log(hoveredIndicator, indicatorData, indicatorDescription)


// TODO: check grid
// $: console.log(selectedCountryData2021)

</script>

<div class="wrapper">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg width={$chartWidth} {height} tabindex="0" role="figure" aria-describedby="indicatorChartDescription">
        <desc id="indicatorChartDescription">Lollipop Chart of ratings in different categories of {$selectedCountry} in 2021</desc>
        {#if $selectedCountry}
        <text
            class="countryName"
            x={innerWidth / 2 + margin.left}
            y=30
            text-anchor=middle
            dominant-baseline="middle"
            font-weight="bold"
            font-size={`${$chartFontSize}rem`}
            role="presentation"
            aria-hidden="true"
            >
            <!-- y=10 -->
                {$selectedCountry} 2021
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
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <g 
                        transform="translate(0, {indicatorScale.bandwidth()/2})"
                        tabindex="0"
                        aria-describedby="indicatorInfo" 
                    >

                                            <!-- {#if hoveredIndicator} -->
                                            <desc id="indicatorInfo">
                                                <!-- {indicatorLabelsLookup.get(d.indicator)}: {d.value} -->
                                                {
                                                indicatorDataLookup.get(d.indicator)
                                                    .reduce((prev, curr) => {
                                                        return `${prev} ${curr.year}: ${curr.value},`
                                                    }, `${indicatorLabelsLookup.get(d.indicator)}: `)
                                                }
                                                
                                            </desc>
                                            <!-- {/if} -->
                    {#if d.value !== 0}
                    <line 
                        x1={indicatorValueScale(0)}
                        x2={indicatorValueScale(d.value)}
                        y1={indicatorScale(d.indicator)}
                        y2={indicatorScale(d.indicator)}
                        stroke="dimgray"
                        stroke-width=4
                    />
                    <line 
                    x1={indicatorValueScale(0)}
                    x2={indicatorValueScale(d.value)}
                    y1={indicatorScale(d.indicator)}
                    y2={indicatorScale(d.indicator)}
                    stroke={indicatorValueColorScale(d.value)}
                    stroke-width=2
                />
                    {/if}
                    <circle
                        cx={indicatorValueScale(d.value)}
                        cy={indicatorScale(d.indicator)}
                        r={$isSmallMobile
                            ? hoveredIndicator === d 
                                ? 6 
                                : 4
                            : $isMobile
                                ? hoveredIndicator === d 
                                    ? 8 
                                    : 6
                                : hoveredIndicator === d 
                                    ? 10
                                    : 8 }
                        fill={indicatorValueColorScale(d.value)}
                        stroke="dimgray"
                        class="indicator"
                        in:fly={{ x: d.value < 0 ? 100 : d.value === 0 ? 0 : -100, duration: 200, delay: 0}}
                        on:mouseover={(e) => handleIndicatorHover(e, d)}
                        on:focus={(e) => handleIndicatorHover(e, d)}
                        on:mouseleave={(e) => handleIndicatorHover(e, null)}
                        on:blur={(e) => handleIndicatorHover(e, null)}
                        on:keydown={(e) => {e.key === "Escape" ? handleIndicatorHover(e, null) : null}}
                        />
                        <!-- aria-label="indicatorTooltipInfo" -->
                        <!-- r={hoveredIndicator === d ? 12 : 10} -->
                </g>
                {/each}
        
            </g>
        
        </g>

        
    </svg>

    {#if hoveredIndicator}
    <IndicatorTooltip indicator2021Data={hoveredIndicator} {hoveredIndicatorData } {years} {indicatorScale} {indicatorValueScale} {indicatorLabelsLookup} {indicatorValueColorScale} {margin} {innerWidth}/>
    {/if}
    <!-- data={selectedCountryData} 
    {indicatorData} -->
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
