<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"
    
    export let tooltipData
    export let totalScale
    export let width

    let tooltipWidth
    let tooltipHeight = 100

    $: xValue = tooltipData.event.type === "focus" ? tooltipData.centroid[0]  : tooltipData.event.clientX - tooltipData.parentBoundingRect.left//+ tooltipData.parentBoundingRect.left 

    $: xPosition = tooltipData.event.type === "focus"
        ? xValue - tooltipWidth / 2
        : xValue + tooltipWidth / 2 > width
            ? xValue - tooltipWidth
            : xValue < tooltipWidth / 2
                ? xValue
                : xValue - tooltipWidth / 2



    let yNudge = 5
    let yMobileNudge = 15

    $: yValue = tooltipData.event.type === "focus" ? tooltipData.centroid[1]  : tooltipData.event.clientY - tooltipData.parentBoundingRect.top + window.pageYOffset // window.scrollY

    let yPosition

    $: if ($isMobile || $isTablet) {
        yPosition = tooltipData.event.type === "focus"
        ? yValue - tooltipHeight < 0
            ? yValue
            : yValue - tooltipHeight - yMobileNudge
        : yValue - tooltipHeight - yNudge < 0
            ? yValue + yNudge
            : yValue - tooltipHeight - yMobileNudge //- yNudge

    } else {
        yPosition = tooltipData.event.type === "focus"
        ? yValue - tooltipHeight < 0
            ? yValue
            : yValue - tooltipHeight 
        : yValue - tooltipHeight - yNudge < 0
            ? yValue + yNudge
            : yValue - tooltipHeight //- yNudge
    }

    // $: yPosition = tooltipData.event.type === "focus"
    //     ? yValue - tooltipHeight < 0
    //         ? yValue
    //         : yValue - tooltipHeight 
    //     : yValue - tooltipHeight - yNudge < 0
    //         ? yValue + yNudge
    //         : yValue - tooltipHeight //- yNudge

    $: flyDirection = yPosition < yValue ? 1 : -1

    // TODO css variables for background and color
    // TODO accessibility tooltip

    // $: console.log(window.scrollY)

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
/>

</div>
