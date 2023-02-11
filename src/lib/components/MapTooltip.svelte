<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    
    export let mapData
    export let totalScale

    let tooltipWidth
    let tooltipHeight


    $: xPosition = mapData.eventType === "focus"
        ? mapData.centroid[0] - tooltipWidth / 2
        : mapData.event.pageX - tooltipWidth / 2

    $: yPosition = mapData.eventType === "focus"
        ? mapData.centroid[1] - tooltipHeight < 0
            ? mapData.centroid[1] 
            : mapData.centroid[1] - tooltipHeight 
        : mapData.event.pageY - tooltipHeight < 0
            ? mapData.event.pageY 
            : mapData.event.pageY - tooltipHeight 


    // TODO css variables for background and color
    // TODO country tooltip component? nur data und x/yposition different
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
    bind:tooltipWidth={tooltipWidth}
    bind:tooltipHeight={tooltipHeight}
/>

</div>
