<script>
    import CountryTooltip from "./CountryTooltip.svelte"

    import { isSmall, width } from "../stores/dimensions"
    
    export let tooltipData
    export let totalScale

    let tooltipWidth

    let tooltipHeight = 100

    $: chartWidth = $width * 0.8

    $: arrow = $isSmall ? false : true

    $: xValue = tooltipData.event.clientX - tooltipData.parentBoundingRect.left

    let xPosition

    $: if ($isSmall) {

        xPosition = xValue - tooltipWidth / 2 < 0
            ? xValue
            : xValue + tooltipWidth / 2 > chartWidth
                ? xValue - tooltipWidth
                : xValue - tooltipWidth / 2

    } else {
        xPosition = xValue - tooltipWidth / 2 < 0
            ? xValue
            : xValue + tooltipWidth / 2 > chartWidth
                ? xValue - tooltipWidth
                : xValue - tooltipWidth / 2
    }

    $: xArrowPosition = xValue - tooltipWidth / 2 < 0
        ? "left"
        : xValue + tooltipWidth / 2 > chartWidth
            ? "right"
            : "center"

    $: yValue = tooltipData.event.clientY - tooltipData.parentBoundingRect.top

    let yNudge = 20

    let yPosition

    $: if ($isSmall) {

        yPosition = 10

    } else  {
        yPosition = yValue - tooltipHeight < 0
            ? yValue + yNudge
            : yValue - tooltipHeight - yNudge

    } 

    $: flyDirection = yPosition < yValue ? 1 : -1


</script>

<div class="mapTooltip">

    <CountryTooltip 
        tooltipData={tooltipData.data} 
        country={tooltipData.data.shortName} 
        colorScale={totalScale}
        lastYearOnly={true}
        {xPosition}
        {yPosition}
        {flyDirection}
        bind:tooltipWidth={tooltipWidth}
        {arrow}
        {xArrowPosition}
    />

</div>
