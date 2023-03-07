<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"
    
    export let mapData
    export let totalScale
    export let width

    let tooltipWidth
    let tooltipHeight = 100

    $: xValue = mapData.event.type === "focus" ? mapData.centroid[0]  : mapData.event.clientX - mapData.parentBoundingRect.left//+ mapData.parentBoundingRect.left 

    $: xPosition = mapData.event.type === "focus"
        ? xValue - tooltipWidth / 2
        : xValue + tooltipWidth / 2 > width
            ? xValue - tooltipWidth
            : xValue < tooltipWidth / 2
                ? xValue
                : xValue - tooltipWidth / 2



    let yNudge = 5
    let yMobileNudge = 15

    $: yValue = mapData.event.type === "focus" ? mapData.centroid[1]  : mapData.event.clientY - mapData.parentBoundingRect.top + window.pageYOffset // window.scrollY

    let yPosition

    $: if ($isMobile || $isTablet) {
        yPosition = mapData.event.type === "focus"
        ? yValue - tooltipHeight < 0
            ? yValue
            : yValue - tooltipHeight - yMobileNudge
        : yValue - tooltipHeight - yNudge < 0
            ? yValue + yNudge
            : yValue - tooltipHeight - yMobileNudge //- yNudge

    } else {
        yPosition = mapData.event.type === "focus"
        ? yValue - tooltipHeight < 0
            ? yValue
            : yValue - tooltipHeight 
        : yValue - tooltipHeight - yNudge < 0
            ? yValue + yNudge
            : yValue - tooltipHeight //- yNudge
    }

    // $: yPosition = mapData.event.type === "focus"
    //     ? yValue - tooltipHeight < 0
    //         ? yValue
    //         : yValue - tooltipHeight 
    //     : yValue - tooltipHeight - yNudge < 0
    //         ? yValue + yNudge
    //         : yValue - tooltipHeight //- yNudge

    $: flyDirection = yPosition < yValue ? 1 : -1

    // TODO css variables for background and color
    // TODO accessibility tooltip

    $: console.log(window.scrollY)

</script>

<div class="mapTooltip">
    <CountryTooltip 
    data={mapData.data} 
    country={mapData.data.shortName} 
    colorScale={totalScale}
    lastYearOnly={true}
    {xPosition}
    {yPosition}
    {flyDirection}
    bind:tooltipWidth={tooltipWidth}
/>

</div>
