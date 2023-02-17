<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    
    export let mapData
    export let totalScale
    export let width

    let tooltipWidth
    let tooltipHeight = 100

    $: xMouseValue = mapData.event.pageX

    $: xPosition = mapData.event.type === "focus"
        ? mapData.centroid[0] - tooltipWidth / 2
        : xMouseValue + tooltipWidth / 2 > width
            ? xMouseValue - tooltipWidth
            : xMouseValue < tooltipWidth / 2
                ? xMouseValue
                : xMouseValue - tooltipWidth / 2



    let yNudge = 5

    $: yValue = mapData.event.type === "focus" ? mapData.centroid[1] : mapData.event.pageY

    $: yPosition = mapData.event.type === "focus"
        ? yValue - tooltipHeight < 0
            ? yValue
            : yValue - tooltipHeight 
        : yValue - tooltipHeight - yNudge < 0
            ? yValue + yNudge
            : yValue - tooltipHeight - yNudge


    $: flyDirection = yPosition < yValue ? 1 : -1

    // TODO css variables for background and color
    // TODO accessibility tooltip

</script>

<div class="mapTooltip">
    <CountryTooltip 
    data={mapData.data} 
    country={mapData.data.shortName} 
    colorScale={totalScale}
    lastYearOnly=TRUE
    {xPosition}
    {yPosition}
    {flyDirection}
    bind:tooltipWidth={tooltipWidth}
/>

</div>
