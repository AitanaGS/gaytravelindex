<script>
    import TooltipAxisYears from "./TooltipAxisYears.svelte"
    import TooltipAxisIndicatorValues from "./TooltipAxisIndicatorValues.svelte"

    import { isSmall, isMobile } from "../stores/dimensions"
    import { prefersReducedMotion } from "../stores/preferesReducedMotion"
    import { years } from "../stores/data"

    import { COLORS } from "../utils/constants"

    import { scaleBand, scaleLinear } from "d3-scale"
    import { fly } from "svelte/transition"

    export let indicator2023Data
    export let indicatorScale
    export let indicatorValueScale
    export let indicatorLabelsLookup
    export let margin
    export let indicatorValueColorScale
    export let hoveredIndicatorData
    
    let tooltipWidth = $isSmall ? 200 : 280

    let tooltipHeight = 160
    
    $: xValue = indicatorValueScale(indicator2023Data.value)
    $: xBandwidth = indicatorValueScale(1) - indicatorValueScale(0)


    let xPosition

    $: if ($isMobile) {

        xPosition = indicator2023Data.value === -5
            ? margin.left + xValue - xBandwidth * 8
            : (indicator2023Data.value >= -4) && (indicator2023Data.value <= -3)
            ? margin.left + xValue - xBandwidth * 10
            : (indicator2023Data.value >= -2) && (indicator2023Data.value <= -1)
            ? margin.left + xValue - tooltipWidth + xBandwidth * 3
            : (indicator2023Data.value == 0)
            ? margin.left + xValue - tooltipWidth + xBandwidth * 2
            : (indicator2023Data.value >= 1) && (indicator2023Data.value <= 2)
            ? margin.left + xValue - tooltipWidth + xBandwidth
            : margin.left + xValue - tooltipWidth

    } else if ($isSmall) {

        xPosition = indicator2023Data.value === -5
            ? margin.left + xValue - xBandwidth * 3
            : (indicator2023Data.value >= -4) && (indicator2023Data.value <= -3)
            ? margin.left + xValue - xBandwidth * 5
            : (indicator2023Data.value >= -2) && (indicator2023Data.value <= -1)
            ? margin.left + xValue - tooltipWidth + xBandwidth * 3 
            : (indicator2023Data.value == 0)
            ? margin.left + xValue - tooltipWidth + xBandwidth * 2
            : (indicator2023Data.value >= 1) && (indicator2023Data.value <= 2)
            ? margin.left + xValue - tooltipWidth + xBandwidth
            : margin.left + xValue - tooltipWidth

    } else {

        xPosition = indicator2023Data.value === -5
            ? margin.left + xValue
            : (indicator2023Data.value >= -4) && (indicator2023Data.value <= -3)
            ? margin.left + xValue - xBandwidth * 2
            : (indicator2023Data.value >= -2) && (indicator2023Data.value <= -1)
            ? margin.left + xValue  - tooltipWidth / 2
            : (indicator2023Data.value == 0)
            ? margin.left + xValue - xBandwidth - tooltipWidth / 2
            : (indicator2023Data.value >= 1) && (indicator2023Data.value <= 2)
            ? margin.left + xValue - tooltipWidth + xBandwidth
            : margin.left + xValue - tooltipWidth

    }
    
    $: yValue = indicatorScale(indicator2023Data.indicator)

    $: yPosition = yValue - tooltipHeight < 0
        ? yValue + tooltipHeight / 2 + indicatorScale.bandwidth() / 2
        : yValue + margin.top - tooltipHeight

    $: flyDirection = yPosition < yValue ? 1 : -1

    $: transitionToUse = $prefersReducedMotion ? () => {} : fly

    const svgMargin = {
        top: 8,
        right:  20,
        bottom: 20,
        left: 20
    }

    const headingMargin = 40

    const noteMargin = 10

    $: svgWidth = tooltipWidth
    $: svgHeight = tooltipHeight - headingMargin - noteMargin

    $: svgInnerWidth = svgWidth - svgMargin.right - svgMargin.left
    $: svgInnerHeight = svgHeight - svgMargin.top - svgMargin.bottom

    $: tooltipYearScale = scaleBand()
        .domain($years)
        .range([0, svgInnerWidth])

    $: tooltipIndicatorValueScale = scaleLinear()
        .domain(indicatorValueScale.domain())
        .range([svgInnerHeight, 0])

    const tooltipFontSizeScale = scaleLinear()
        .domain([100, 300])
        .range([1.1, 0.95])
        .clamp(true);

    $: tooltipFontSize = tooltipFontSizeScale(tooltipWidth)



</script>

<div
    in:transitionToUse={{ 
        y: flyDirection * 20,
        duration: 250, 
        delay: 100
        }}
    class="tooltip"
    style="
        top: {yPosition}px;
        left: {xPosition}px;
        --height: {tooltipHeight}px;
        --width: {tooltipWidth}px;
        --fontSize: {`${tooltipFontSize}rem`};
        --borderColor: {COLORS.gray["400"]};
    "
    bind:offsetWidth={tooltipWidth}
    >
    <h3 class={$isSmall ? "mobileHeading" : "heading"}>{indicatorLabelsLookup.get(indicator2023Data.indicator)}</h3>
    <div>
        {#if tooltipWidth}
        <svg width={svgWidth} height={svgHeight} transform="translate(0, 0)">
            <TooltipAxisIndicatorValues {tooltipIndicatorValueScale} {svgMargin} {svgInnerWidth} {tooltipFontSize}/>
            <TooltipAxisYears {tooltipYearScale} {svgMargin} {svgInnerHeight} {tooltipFontSize}/>
            <g
                class="chart tooltipChart"
                transform="translate({svgMargin.left}, {svgMargin.top})"
            >
                <g class="innerChart innerTooltipChart">
                    {#each hoveredIndicatorData as d}
                    <circle 
                        cx={tooltipYearScale(d.year) + tooltipYearScale.bandwidth() / 2}
                        cy={tooltipIndicatorValueScale(d.value)}
                        r=5
                        fill={indicatorValueColorScale(d.value)}
                        stroke={COLORS.gray["700"]}
                    />
                {/each}


                </g>

            </g>
        </svg>
        {/if}
        <p>Note: There is no data for 2022.</p>
    </div>

</div>


<style>
    .tooltip {
        position: absolute;
        height: var(--height);
        width: var(--width);
        background: white;
        box-shadow: hsla(0, 0%, 0%, 0.15) 4px 6px 12px; /* rgba(0, 0, 0, 0.15) 2px 3px 8px; */
        padding: 6px 6px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
        transition: top 300ms ease, left 300ms ease;
        text-align: center;
        border: 2px solid var(--borderColor);
    }

    h3 {
        margin: 0;
        font-weight: 700;
        margin-bottom: 3px;
    }

    .heading {
        font-size: calc(var(--fontSize) * 0.8);
    }

    .mobileHeading {
        font-size: calc(var(--fontSize) * 0.7);
    }

    p {
        margin: 0;
        font-size: calc(var(--fontSize) * 0.6);
        float: left;
    }

</style>
