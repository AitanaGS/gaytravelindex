<script>
    import { fly, fade } from "svelte/transition"
    import TooltipAxisYears from "./TooltipAxisYears.svelte";
    import TooltipAxisIndicatorValues from "./TooltipAxisIndicatorValues.svelte";
    import { scaleBand, scaleSequential, scaleLinear } from "d3-scale"


    export let indicator2021Data
    export let data
    export let indicatorScale
    export let indicatorValueScale
    export let indicatorLabelsLookup
    export let margin
    export let innerWidth
    export let years
    export let indicatorValueColorScale


    $: indicatorData = data.filter(d => d.indicator === indicator2021Data.indicator).sort((a, b) => a.year - b.year)

    let tooltipWidth = 300

    let tooltipHeight = 200

    $: halfBandwidth = indicatorValueScale(1) - indicatorValueScale(0.5)
    $: totalBandwidth = indicatorValueScale(1) - indicatorValueScale(0)


    $: xPosition = indicatorValueScale(indicator2021Data.value) + margin.left + tooltipWidth /2 - halfBandwidth > innerWidth + margin.left
        ? indicatorValueScale(indicator2021Data.value) + margin.left - tooltipWidth
        : indicatorValueScale(indicator2021Data.value) + margin.left - tooltipWidth / 2


    $: yPosition = indicatorScale(indicator2021Data.indicator) - tooltipHeight < 0
        ? indicatorScale(indicator2021Data.indicator) + tooltipHeight / 2 //- margin.top //+ tooltipHeight 
        : indicatorScale(indicator2021Data.indicator) + margin.top - tooltipHeight

    // $: yPosition = indicatorScale(indicator2021Data.indicator) + margin.top - tooltipHeight

    const svgMargin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 20
    }

    const headingMargin = 40

    $: svgWidth = tooltipWidth
    $: svgHeight = tooltipHeight - headingMargin

    $: svgInnerWidth = svgWidth - svgMargin.right - svgMargin.left
    $: svgInnerHeight = svgHeight - svgMargin.top - svgMargin.bottom

    $: tooltipYearScale = scaleBand()
        .domain(years)
        .range([0, svgInnerWidth])
        // .padding(0.05)
        // .paddingOuter(0.1)

    $: tooltipIndicatorValueScale = scaleLinear()
        .domain(indicatorValueScale.domain())
        .range([svgInnerHeight, 0])

// TODO: check hsla code in style
// TODO: check xPosition
// TODO: check responsiveness tooltip width and height

</script>

<div
    in:fly={{ y: yPosition < indicatorScale(indicator2021Data.indicator) ? 20 : -20,
            duration: 200, 
            delay: 100 }}
    class="tooltip"
    style="
        top: {yPosition}px;
        left: {xPosition}px;
        --height: {tooltipHeight}px;
        --width: {tooltipWidth}px;
    "
    bind:clientWidth={tooltipWidth}
    bind:clientHeight={tooltipHeight}
    >
    <h3>{indicatorLabelsLookup.get(indicator2021Data.indicator)}</h3>
    <div>
        {#if tooltipWidth}
        <svg width={svgWidth} height={svgHeight} transform="translate(0, 0)">
            <TooltipAxisIndicatorValues {tooltipIndicatorValueScale} {svgMargin} {svgInnerWidth} />
            <TooltipAxisYears {tooltipYearScale} {svgMargin} {svgInnerHeight} {years}/>
            <g
                class="chart tooltipChart"
                transform="translate({svgMargin.left}, {svgMargin.top})"
            >
                <g class="innerChart innerTooltipChart">
                    {#each indicatorData as d}
                    <circle 
                        cx={tooltipYearScale(d.year) + tooltipYearScale.bandwidth() / 2}
                        cy={tooltipIndicatorValueScale(d.value)}
                        r=5
                        fill={indicatorValueColorScale(d.value)}
                        stroke="darkgray"
                    />
                {/each}


                </g>

            </g>
        </svg>
        {/if}
    </div>

</div>


<style>
    .tooltip {
        position: absolute;
        height: var(--height);
        width: var(--width);
        background: white;
        box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
        padding: 8px 6px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
        transition: top 300ms ease, left 300ms ease;
    }

    h3 {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 3px;
    }

</style>
