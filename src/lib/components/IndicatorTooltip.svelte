<script>
    import TooltipAxisYears from "./TooltipAxisYears.svelte";
    import TooltipAxisIndicatorValues from "./TooltipAxisIndicatorValues.svelte";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"

    import { scaleBand, scaleSequential, scaleLinear } from "d3-scale"
    import { fly, fade } from "svelte/transition"
    // import { tooltipFontSize } from "../stores/responsiveFontSize";

    export let indicator2021Data
    export let data
    export let indicatorScale
    export let indicatorValueScale
    export let indicatorLabelsLookup
    export let margin
    export let innerWidth
    export let years
    export let indicatorValueColorScale
    export let indicatorData


    $: indicatorData = data.filter(d => d.indicator === indicator2021Data.indicator).sort((a, b) => a.year - b.year)
    
    
    let tooltipWidth = 270

    let tooltipHeight = 150
    
    $: xValue = indicatorValueScale(indicator2021Data.value)
    $: xBandwidth = indicatorValueScale(1) - indicatorValueScale(0)

    let xPosition

    $: if ($isMobile || $isTablet) {

        xPosition = indicator2021Data.value === -5
            ? margin.left + xValue - xBandwidth * 4 //5
            : (indicator2021Data.value >= -4) && (indicator2021Data.value <= -3)
            ? margin.left + xValue - xBandwidth * 6 //7
            : (indicator2021Data.value >= -2) && (indicator2021Data.value <= 0)
            ? margin.left + xValue - tooltipWidth + xBandwidth * 3 /// 2
            : (indicator2021Data.value >= 1) && (indicator2021Data.value <= 2)
            ? margin.left + xValue - tooltipWidth + xBandwidth
            : margin.left + xValue - tooltipWidth

    } else {

        xPosition = indicator2021Data.value === -5
            ? margin.left + xValue
            : (indicator2021Data.value >= -4) && (indicator2021Data.value <= -3)
            ? margin.left + xValue - xBandwidth
            : (indicator2021Data.value >= -2) && (indicator2021Data.value <= 0)
            ? margin.left + xValue - tooltipWidth / 2
            : (indicator2021Data.value >= 1) && (indicator2021Data.value <= 2)
            ? margin.left + xValue - tooltipWidth + xBandwidth
            : margin.left + xValue - tooltipWidth
    }

    // $: xPosition = indicator2021Data.value === -5
    //     ? margin.left + xValue
    //     : (indicator2021Data.value >= -4) && (indicator2021Data.value <= -3)
    //     ? margin.left + xValue - xBandwidth
    //     : (indicator2021Data.value >= -2) && (indicator2021Data.value <= 0)
    //     ? margin.left + xValue - tooltipWidth / 2
    //     : (indicator2021Data.value >= 1) && (indicator2021Data.value <= 2)
    //     ? margin.left + xValue - tooltipWidth + xBandwidth
    //     : margin.left + xValue - tooltipWidth
    
    
    $: yValue = indicatorScale(indicator2021Data.indicator)

    $: yPosition = yValue - tooltipHeight < 0
        ? yValue + tooltipHeight / 2 + indicatorScale.bandwidth() / 2
        : yValue + margin.top - tooltipHeight

    $: flyDirection = yPosition < yValue ? 1 : -1

    
    // let tooltipWidth = 300

    // let tooltipHeight = 200

    // $: halfBandwidth = indicatorValueScale(1) - indicatorValueScale(0.5)

    // $: xValue = indicatorValueScale(indicator2021Data.value)

    // $: xPosition = xValue + margin.left + tooltipWidth /2 - halfBandwidth > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth
    //     : xValue + margin.left - tooltipWidth / 2 < margin.left + tooltipWidth / 2
    //         ? xValue + margin.left
    //         : xValue + margin.left - tooltipWidth / 2

    // $: yValue = indicatorScale(indicator2021Data.indicator)

    // $: yPosition = yValue - tooltipHeight < 0
    //     ? yValue + tooltipHeight / 2 
    //     : yValue + margin.top - tooltipHeight

    // $: flyDirection = yPosition < yValue ? 1 : -1

    // $: console.log(indicator2021Data, indicatorData)



    const svgMargin = {
        top: 5, //10,
        right: 10,
        bottom: 20, //20,
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

    const tooltipFontSizeScale = scaleLinear()
        .domain([100, 300])
        .range([1.1, 0.95]) //.range([26, 16])
        .clamp(true);

    $: tooltipFontSize = tooltipFontSizeScale(tooltipWidth)

// TODO: check hsla code in style
// TODO: check responsiveness tooltip width
// TODO: Accessibility of tooltip data (focus)
// TODO: check xposition calculation


</script>

<div
    in:fly={{ y: flyDirection * 20,
            duration: 200, 
            delay: 100 }}
    class="tooltip"
    style="
        top: {yPosition}px;
        left: {xPosition}px;
        --height: {tooltipHeight}px;
        --width: {tooltipWidth}px;
        --fontSize: {`${tooltipFontSize}rem`};
    "
    bind:clientWidth={tooltipWidth}
    >
    <h3>{indicatorLabelsLookup.get(indicator2021Data.indicator)}</h3>
    <div>
        {#if tooltipWidth}
        <svg width={svgWidth} height={svgHeight} transform="translate(0, 0)">
            <!-- <title id="indicatorTooltipTitle">Point Chart of ratings of {indicatorLabelsLookup.get(indicator2021Data.indicator)} in {indicator2021Data.country} over the past few years</title> -->
            <TooltipAxisIndicatorValues {tooltipIndicatorValueScale} {svgMargin} {svgInnerWidth} {tooltipFontSize}/>
            <TooltipAxisYears {tooltipYearScale} {svgMargin} {svgInnerHeight} {years} {tooltipFontSize}/>
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
        padding: 6px 6px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
        transition: top 300ms ease, left 300ms ease;
        text-align: center;
    }

    h3 {
        margin: 0;
        font-size: calc(var(--fontSize) * 0.8);
        font-weight: 700;
        margin-bottom: 3px;
    }

</style>
