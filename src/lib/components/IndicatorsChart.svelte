<script>

    import { tidy, pivotLonger } from '@tidyjs/tidy'
    import { scaleBand, scaleLinear, scaleSequential } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"
    import { extent } from "d3-array"
    import AxisIndicators from './AxisIndicators.svelte'
    import AxisIndicatorValues from './AxisIndicatorValues.svelte'
    import { slide, fly } from "svelte/transition"


    export let data
    export let selectedCountry
    export let width


    // let width = 800


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


  $: height = indicatorVariables.length * 50

  $: innerWidth = width - margin.left - margin.right
  $: innerHeight = height - margin.top - margin.bottom


  const margin = {
    top: 60,
    right: 10,
    bottom: 60,
    left: 210 // 220
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

const indicatorValueColorScale = scaleSequential(interpolateRdYlBu)
    .domain(extent(dataLonger.map(d => d.value)))

$: indicatorValueScale = scaleLinear()
    .domain(extent(dataLonger.map(d => d.value)))
    .range([20, innerWidth - 20])


$: selectedCountryData = dataLonger.filter(d => d.country == selectedCountry).filter(d => d.value !== undefined)

$: selectedCountryData2021 = selectedCountryData.filter(d => d.year === 2021)


</script>

<div>
    <svg {width} {height}>
        <text
            x={innerWidth / 2 + margin.left}
            y=30
            text-anchor=middle
            dominant-baseline="middle"
            font-weight="bold"
            font-size="1rem">
            <!-- y=10 -->
                {selectedCountry} 2021
        </text>
        <AxisIndicators {indicatorScale} {indicatorVariables} {indicatorLabelsLookup} {margin}/>
        <AxisIndicatorValues {indicatorValueScale} {margin}/>
        <g
        class="chart indicatorsChart" 
        transform="translate({margin.left}, {margin.top})"
        in:fly={{ x: -100, duration: 400, delay: 0}} >
            <g
            class="innerChart innerIndicatorsChart">
                <!-- <AxisIndicators {indicatorScale} {indicatorVariables} {indicatorLabelsLookup}/>
                <AxisIndicatorValues {indicatorValueScale}/> -->
                <!-- transform="translate(20, -{(indicatorScale.bandwidth() /2 + 4)})" -->
                <!-- <g class="innerChart" transform="translate(20, 100)"></g> -->
                    {#each selectedCountryData2021 as d, i (`${d.country}${d.indicator}`)}
                    <g transform="translate(0, {indicatorScale.bandwidth()/2})">
                    <circle
                        cx={indicatorValueScale(d.value)}
                        cy={indicatorScale(d.indicator)}
                        r=10
                        fill={indicatorValueColorScale(d.value)}
                        stroke="gray"
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
                    <!-- <text
                        x={indicatorValueScale(d.value)}
                        y={indicatorScale(d.indicator)}
                        dy={-indicatorScale.bandwidth()/2 + 1}
                        text-anchor="middle"
                        dominant-baseline="middle"
                        font-size=14
                        >
                        {d.value}
                    </text> -->
                </g>
                {/each}
        
            </g>
        
        </g>

        
    </svg>
</div>
