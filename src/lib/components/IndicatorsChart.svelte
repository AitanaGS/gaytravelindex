<script>

    import AxisIndicators from './AxisIndicators.svelte'
    import AxisIndicatorValues from './AxisIndicatorValues.svelte'
    import IndicatorTooltip from './IndicatorTooltip.svelte'

    import { selectedCountry} from '../stores/selectedCountry'
    import { chartFontSize } from '../stores/responsiveFontSize'
    import { isSmall, isMobile, width } from '../stores/dimensions'
    import { data } from "../stores/data"
    import { prefersReducedMotion } from '../stores/preferesReducedMotion'

    import { COLORS } from "../utils/constants"

    import { fly } from "svelte/transition"
    import { extent, min, max } from "d3-array"
    import { tidy, pivotLonger } from '@tidyjs/tidy'
    import { scaleBand, scaleLinear, scaleDiverging } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"

    $: chartWidth = $width * 0.8

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
                                                        : label ===  "Transgender Rights" ? label = "transgenderRights" 
                                                        : camelize(label))

    const indicatorLabelsLookup = new Map()

    indicatorLabels.forEach((label, i) => {
        indicatorLabelsLookup.set(indicatorVariables[i], label)
    })

    $: height = indicatorVariables.length * 40

    $: innerWidth = chartWidth - margin.left - margin.right
    $: innerHeight = height - margin.top - margin.bottom


    $: margin = {
        top: 60,
        right: 5,
        bottom: 5,
        left: $isSmall ? 180 : 230
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

    const indicatorValueColorScale = scaleDiverging(interpolateRdYlBu)
        .domain([min(dataLonger, d => d.value), 0, max(dataLonger, d => d.value)])


    $: indicatorValueScale = scaleLinear()
        .domain(extent(dataLonger.map(d => d.value)))
        .range([20, innerWidth - 20])


    $: selectedCountryData = dataLonger.filter(d => d.country == $selectedCountry).filter(d => d.value !== undefined)

    $: selectedCountryData2023 = selectedCountryData.filter(d => d.year === 2023)

    const indicatorDataLookup = new Map()

    $: if (selectedCountryData) {
        indicatorVariables.forEach(indicator => {
            indicatorDataLookup.set(indicator,
            selectedCountryData.filter(d => d.indicator === indicator).sort((a, b) => a.year - b.year))
        })

    }


    let hoveredIndicator

    let hoveredIndicatorData   

    const handleIndicatorHover = (e, d) => {
        hoveredIndicator = d

        if (d) {
            hoveredIndicatorData = indicatorDataLookup.get(d.indicator)
        } else {
            hoveredIndicatorData = null
        }
    }

    $: transitionToUse = $prefersReducedMotion ? () => {} : fly


</script>

<div class="wrapper">
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg width={chartWidth} height={height} tabindex="0" role="figure" aria-describedby="indicatorChartDescription">
        <desc id="indicatorChartDescription">Lollipop Chart of ratings in different categories of {$selectedCountry} in 2023</desc>
        {#if $selectedCountry}
        <text
            class="countryName"
            x={$isSmall ? 5 : innerWidth / 2 + margin.left}
            y=30
            text-anchor={$isSmall ? "start" : "middle"}
            dominant-baseline="middle"
            fill={COLORS.gray["800"]}
            font-weight="bold"
            font-size={`${$chartFontSize}rem`}
            role="presentation"
            aria-hidden="true"
            >
                {$selectedCountry} 2023
        </text>
        {/if}
        <AxisIndicators {indicatorScale} {indicatorVariables} {indicatorLabelsLookup} {margin}/>
        <AxisIndicatorValues {indicatorValueScale} {margin} {innerHeight}/>
        <g
        class="chart indicatorsChart" 
        transform="translate({margin.left}, {margin.top})"
         >
            <g
            class="innerChart innerIndicatorsChart">
                    {#each selectedCountryData2023 as d, i (`${d.country}${d.indicator}`)}
                    <g 
                        transform="translate(0, {indicatorScale.bandwidth()/2})"
                    >
                    {#if d.value !== 0}
                    <line 
                        x1={indicatorValueScale(0)}
                        x2={indicatorValueScale(d.value)}
                        y1={indicatorScale(d.indicator)}
                        y2={indicatorScale(d.indicator)}
                        stroke={COLORS.gray["700"]}
                        stroke-width=4
                        in:transitionToUse={{ x: d.value < 0 ? 100 : d.value === 0 ? 0 : -100, duration: 200, delay: 0}}
                    />
                    <line 
                    x1={indicatorValueScale(0)}
                    x2={indicatorValueScale(d.value)}
                    y1={indicatorScale(d.indicator)}
                    y2={indicatorScale(d.indicator)}
                    stroke={indicatorValueColorScale(d.value)}
                    stroke-width=2
                    in:transitionToUse={{ x: d.value < 0 ? 100 : d.value === 0 ? 0 : -100, duration: 200, delay: 0}}
                />
                    {/if}
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <circle
                    class="indicator"
                    cx={indicatorValueScale(d.value)}
                    cy={indicatorScale(d.indicator)}
                    r={20}
                    fill="transparent"
                    on:mouseenter={(e) => handleIndicatorHover(e, d)}
                    on:mouseleave={(e) => handleIndicatorHover(e, null)}
                    />
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <circle
                        tabindex="0"
                        aria-describedby="indicatorInfo" 
                        cx={indicatorValueScale(d.value)}
                        cy={indicatorScale(d.indicator)}
                        r={$isMobile
                            ? hoveredIndicator === d 
                                ? 6 
                                : 4
                            : $isSmall
                                ? hoveredIndicator === d 
                                    ? 8 
                                    : 6
                                : hoveredIndicator === d 
                                    ? 10
                                    : 8 }
                        fill={indicatorValueColorScale(d.value)}
                        stroke={COLORS.gray["700"]}
                        class="indicator"
                        in:transitionToUse={{ x: d.value < 0 ? 100 : d.value === 0 ? 0 : -100, duration: 200, delay: 0}}
                        on:mouseenter={(e) => handleIndicatorHover(e, d)}
                        on:focus={(e) => handleIndicatorHover(e, d)}
                        on:mouseleave={(e) => handleIndicatorHover(e, null)}
                        on:blur={(e) => handleIndicatorHover(e, null)}
                        on:keydown={(e) => {e.key === "Escape" ? handleIndicatorHover(e, null) : null}}
                        />
                        <desc id="indicatorInfo">
                            {
                            indicatorDataLookup.get(d.indicator)
                                .reduce((prev, curr) => {
                                    return `${prev} ${curr.year}: ${curr.value},`
                                }, `${indicatorLabelsLookup.get(d.indicator)}: `)
                            + ". Note: There is no data for 2022."
                            }
                        </desc>
                </g>
                {/each}
        
            </g>
        
        </g>

        
    </svg>

    {#if hoveredIndicator}
    <IndicatorTooltip indicator2023Data={hoveredIndicator} {hoveredIndicatorData } {indicatorScale} {indicatorValueScale} {indicatorLabelsLookup} {indicatorValueColorScale} {margin}/>
    {/if}
</div>

<style>
    .wrapper {
        position: relative;
    }

    .indicator {
        cursor: pointer;
        transition: r 200ms ease;
    }

</style>
