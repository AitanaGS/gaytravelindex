<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    import { isMobile, isSmall } from "../stores/dimensions"
    // import { countryScale } from "../stores/data";

    export let tooltipData
    export let yearScale
    export let countryScale
    export let totalScale
    export let innerWidth
    export let margin

    let tooltipWidth

    let tooltipHeight = 100

    $: xValue = yearScale(tooltipData.year)

    // $: halfXBandWidth = yearScale.bandwidth() / 2 

    $: xBandwidth = yearScale.bandwidth()

    const xNudge = 1

    // $: xPosition = xValue + margin.left + tooltipWidth * 0.7   > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth + xNudge
    //     : xValue + margin.left - tooltipWidth  * 0.7  < margin.left
    //     ? xValue + margin.left //+ tooltipWidth/2
    //     : xValue + margin.left - tooltipWidth / 2 + xBandwidth / 2

    let xPosition

    $: if ($isSmall) {

        xPosition = xValue + margin.left - tooltipWidth * 0.33  < margin.left
            ? xValue + margin.left - tooltipWidth / 2 + xBandwidth / 2
            : xValue + margin.left - tooltipWidth + xBandwidth + xNudge

        // xPosition = (xValue + margin.left + tooltipWidth   > innerWidth + margin.left) && (xValue + margin.left - tooltipWidth * 0.25  < margin.left)
        //     ? xValue + margin.left - tooltipWidth / 2 + xBandwidth / 2
        //     : xValue + margin.left + tooltipWidth   > innerWidth + margin.left
        //     ? xValue + margin.left - tooltipWidth + xBandwidth + xNudge
        //     : xValue + margin.left - tooltipWidth  < margin.left
        //     ? xValue + margin.left //+ tooltipWidth/2
        //     : xValue + margin.left - tooltipWidth / 2 + xBandwidth / 2


    } else {
        xPosition = xValue + margin.left + tooltipWidth * 0.7   > innerWidth + margin.left
            ? xValue + margin.left - tooltipWidth + xBandwidth + xNudge
            : xValue + margin.left - tooltipWidth  * 0.7  < margin.left
            ? xValue + margin.left //+ tooltipWidth/2
            : xValue + margin.left - tooltipWidth / 2 + xBandwidth / 2
    }

    let xArrowPosition

    $: if ($isSmall) {
        xArrowPosition = xValue + margin.left - tooltipWidth * 0.33  < margin.left
        ? "center"
        : "right"

    } else {
        xArrowPosition = xValue + margin.left + tooltipWidth  * 0.7  > innerWidth + margin.left
        ? "right"
        : xValue + margin.left - tooltipWidth  * 0.7  < margin.left
            ? "left"
            : "center"
    }


    // $: xArrowPosition = xValue + margin.left + tooltipWidth  * 0.7  > innerWidth + margin.left
    //     ? "right"
    //     : xValue + margin.left - tooltipWidth  * 0.7  < margin.left
    //         ? "left"
    //         : "center"

    $: arrow = true


    //last
    // $: xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2
    //last


    // const xNudge = 5


    // Desktop
    // $: xPosition = xValue + margin.left + halfXBandWidth + tooltipWidth /2 > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth / 2 - halfXBandWidth
    //     : xValue + margin.left + halfXBandWidth - tooltipWidth / 2 < margin.left //+ tooltipWidth / 2
    //     ? xValue + margin.left
    //     : xValue + margin.left + halfXBandWidth - tooltipWidth / 2


    // $: xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2

    // let xPosition

    // $: if ($isMobile || $isTablet) {
    //     xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2
    // } else {
    //     xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2
    // }

    // let xPosition

    // $: if ($isMobile || $isTablet) {
    //     xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2
    // } else {
    //     xPosition = xValue + margin.left + tooltipWidth / 2 > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2 < margin.left
    //     ? xValue + margin.left
    //     : xValue + margin.left - tooltipWidth / 2
    // }

    // $: if ($isMobile) {
    //     xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2
    // } else if ($isTablet) {
    //     // xPosition = xValue + margin.left + tooltipWidth > innerWidth + margin.left
    //     // ? xValue + margin.left - tooltipWidth + xBandwidth
    //     // : xValue + margin.left - tooltipWidth / 2 < margin.left
    //     // ? xValue + margin.left
    //     // : xValue + margin.left - tooltipWidth / 2
    //     xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2

    // } else {
    //     xPosition = xValue + margin.left + tooltipWidth / 2 > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth + xBandwidth
    //     : xValue + margin.left - tooltipWidth / 2 < margin.left
    //     ? xValue + margin.left
    //     : xValue + margin.left - tooltipWidth / 2
    // }


    let yValue = countryScale(tooltipData.country)

    let yHalfBandwidth = countryScale.bandwidth() / 2

    let yBandwidth = countryScale.bandwidth()

    // $: yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
    //     ? yValue + tooltipHeight - countryScale.bandwidth() / 2
    //     : yValue + margin.top - tooltipHeight + countryScale.bandwidth() / 2

    $: yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
        ? yValue + tooltipHeight - yHalfBandwidth
        : yValue + margin.top - tooltipHeight - yBandwidth + yHalfBandwidth / 2

    // $: if ($isMobile || $isTablet) {
    //     yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
    //     ? yValue + tooltipHeight - yHalfBandwidth
    //     : yValue + margin.top - tooltipHeight - yBandwidth + yHalfBandwidth / 2
    // } else {
    //     yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
    //     ? yValue + tooltipHeight - yHalfBandwidth
    //     : yValue + margin.top - tooltipHeight + yHalfBandwidth / 2
    // }

    $: flyDirection = yPosition < yValue ? 1 : -1


    // $: console.log("desktop", $isDesktop, $width)


    // TODO check tooltips (desktop)

</script>

    <CountryTooltip 
    bind:tooltipWidth={tooltipWidth}
    {tooltipData}
    country={tooltipData.country}
    colorScale={totalScale}
    lastYearOnly=FALSE
    {xPosition}
    {yPosition}
    {flyDirection}
    {tooltipHeight}
    {arrow}
    {xArrowPosition}
/>
<!-- bind:tooltipWidth={tooltipWidth} -->
