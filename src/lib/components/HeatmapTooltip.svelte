<script>
    import CountryTooltip from "./CountryTooltip.svelte"

    import { isSmall } from "../stores/dimensions"

    export let tooltipData
    export let yearScale
    export let countryScale
    export let totalScale
    export let innerWidth
    export let margin

    let tooltipWidth

    let tooltipHeight = 100

    $: xValue = yearScale(tooltipData.year)

    $: xBandwidth = yearScale.bandwidth()

    const xNudge = 1

    let xPosition

    $: if ($isSmall) {

        xPosition = xValue + margin.left - tooltipWidth * 0.33  < margin.left
            ? xValue + margin.left - tooltipWidth / 2 + xBandwidth / 2
            : xValue + margin.left - tooltipWidth + xBandwidth + xNudge


    } else {
        xPosition = xValue + margin.left + tooltipWidth * 0.7   > innerWidth + margin.left
            ? xValue + margin.left - tooltipWidth + xBandwidth + xNudge
            : xValue + margin.left - tooltipWidth  * 0.7  < margin.left
            ? xValue + margin.left
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

    $: arrow = true


    let yValue = countryScale(tooltipData.country)

    let yHalfBandwidth = countryScale.bandwidth() / 2

    let yBandwidth = countryScale.bandwidth()


    $: yPosition = yValue - tooltipHeight / 2 + 9 < margin.top
        ? yValue + tooltipHeight - yHalfBandwidth
        : yValue + margin.top - tooltipHeight - yBandwidth + yHalfBandwidth / 2

    $: flyDirection = yPosition < yValue ? 1 : -1


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
    {arrow}
    {xArrowPosition}
/>
