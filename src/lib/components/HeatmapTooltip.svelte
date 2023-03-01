<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"

    export let data
    export let yearScale
    export let countryScale
    export let totalScale
    export let innerWidth
    export let margin

    let tooltipWidth

    let tooltipHeight = 100

    $: xValue = yearScale(data.year)

    // $: halfXBandWidth = yearScale.bandwidth() / 2 

    $: xBandwidth = yearScale.bandwidth()


    // const xNudge = 5


    // Desktop
    // $: xPosition = xValue + margin.left + halfXBandWidth + tooltipWidth /2 > innerWidth + margin.left
    //     ? xValue + margin.left - tooltipWidth / 2 - halfXBandWidth
    //     : xValue + margin.left + halfXBandWidth - tooltipWidth / 2 < margin.left //+ tooltipWidth / 2
    //     ? xValue + margin.left
    //     : xValue + margin.left + halfXBandWidth - tooltipWidth / 2


    $: xPosition = xValue + margin.left + tooltipWidth/2  > innerWidth + margin.left
        ? xValue + margin.left - tooltipWidth + xBandwidth
        : xValue + margin.left - tooltipWidth / 2

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


    let yValue = countryScale(data.country)

    let yHalfBandwidth = countryScale.bandwidth() / 2

    let yBandwidth = countryScale.bandwidth()

    // $: yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
    //     ? yValue + tooltipHeight - countryScale.bandwidth() / 2
    //     : yValue + margin.top - tooltipHeight + countryScale.bandwidth() / 2

    let yPosition

    $: if ($isMobile || $isTablet) {
        yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
        ? yValue + tooltipHeight - yHalfBandwidth
        : yValue + margin.top - tooltipHeight - yBandwidth + yHalfBandwidth
    } else {
        yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
        ? yValue + tooltipHeight - yHalfBandwidth
        : yValue + margin.top - tooltipHeight + yHalfBandwidth
    }

    $: flyDirection = yPosition < yValue ? 1 : -1



</script>

    <CountryTooltip 
    bind:tooltipWidth={tooltipWidth}
    {data}
    country={data.country}
    colorScale={totalScale}
    lastYearOnly=FALSE
    {xPosition}
    {yPosition}
    {flyDirection}
/>
<!-- bind:tooltipWidth={tooltipWidth} -->
