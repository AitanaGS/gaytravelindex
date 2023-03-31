<script>
    import CountryTooltip from "./CountryTooltip.svelte";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"
    
    export let tooltipData
    export let totalScale
    export let width

    let tooltipWidth
    let tooltipHeight = 100

    // $: console.log(tooltipData)

    $: chartWidth = width * 0.8


    // $: xValue = tooltipData.event.type === "focus" ? tooltipData.centroid[0]  : tooltipData.event.clientX - tooltipData.parentBoundingRect.left//+ tooltipData.parentBoundingRect.left 

    // $: xValue = tooltipData.event.clientX - tooltipData.parentBoundingRect.left//+ tooltipData.parentBoundingRect.left 

    // $: console.log(tooltipData.event.clientX, tooltipData.parentBoundingRect.left )
    // $: xPosition = tooltipData.event.type === "focus"
    //     ? xValue - tooltipWidth / 2
    //     : xValue + tooltipWidth / 2 > width
    //         ? xValue - tooltipWidth
    //         : xValue < tooltipWidth / 2
    //             ? xValue
    //             : xValue - tooltipWidth / 2

    // $: console.log(xValue)

    $: arrow = $isMobile ? false : true


    // last
    $: xValue = tooltipData.event.clientX - tooltipData.parentBoundingRect.left
    // last

    // $: xValue = tooltipData.centroid[0]

    let xPosition

    $: if ($isMobile) {
        // xPosition = 10
        xPosition = xValue - tooltipWidth / 2 < 0
            ? xValue
            : xValue + tooltipWidth / 2 > chartWidth
                ? xValue - tooltipWidth //- tooltipWidth / 2
                : xValue - tooltipWidth / 2

    } else {
        xPosition = xValue - tooltipWidth / 2 < 0
            ? xValue
            : xValue + tooltipWidth / 2 > chartWidth
                ? xValue - tooltipWidth
                : xValue - tooltipWidth / 2


        // xPosition = xValue - tooltipWidth / 2
    }

    $: xArrowPosition = xValue - tooltipWidth / 2 < 0
        ? "left"
        : xValue + tooltipWidth / 2 > chartWidth
            ? "right"
            : "center"



    // xPosition = tooltipData.event.type === "focus"
    //     ? xValue - tooltipWidth / 2
    //     : xValue + tooltipWidth / 2 > width
    //         ? xValue - tooltipWidth
    //         : xValue < tooltipWidth / 2
    //             ? xValue
    //             : xValue - tooltipWidth / 2


    // let yMobileNudge = 15

    // $: yValue = tooltipData.event.type === "focus" ? tooltipData.centroid[1]  : tooltipData.event.clientY - tooltipData.parentBoundingRect.top + window.pageYOffset // window.scrollY

    // $: yValue = tooltipData.event.clientY - tooltipData.parentBoundingRect.top + window.pageYOffset // window.scrollY

    // last
    $: yValue = tooltipData.event.clientY - tooltipData.parentBoundingRect.top + window.pageYOffset
    // last

    // $: yValue = tooltipData.centroid[1]

    let yNudge = 20

    let yPosition

    $: if ($isMobile) {

        yPosition = 10
        // yPosition = yValue - tooltipHeight < 0
        //     ? yValue + yNudge
        //     : yValue - tooltipHeight- yNudge
        // yPosition = yValue - tooltipHeight < 0
        //     ? yValue //+ yNudge
        //     : yValue - tooltipHeight //- yNudge

    } else if ($isTablet) {
        yPosition = yValue - tooltipHeight < 0
            ? yValue + yNudge
            : yValue - tooltipHeight - yNudge// - yMobileNudge


        //     yPosition = tooltipData.event.type === "focus"
        // ? yValue - tooltipHeight < 0
        //     ? yValue
        //     : yValue - tooltipHeight - yMobileNudge
        // : yValue - tooltipHeight - yNudge < 0
        //     ? yValue + yNudge
        //     : yValue - tooltipHeight - yMobileNudge

    } else if ($isDesktop) {
        yPosition = yValue - tooltipHeight < 0
            ? yValue + yNudge
            : yValue - tooltipHeight

        //     yPosition = tooltipData.event.type === "focus"
        // ? yValue - tooltipHeight < 0
        //     ? yValue
        //     : yValue - tooltipHeight 
        // : yValue - tooltipHeight - yNudge < 0
        //     ? yValue + yNudge
        //     : yValue - tooltipHeight
    }
    
    // $: if ($isMobile || $isDesktop) {
    //     yPosition = tooltipData.event.type === "focus"
    //     ? yValue - tooltipHeight < 0
    //         ? yValue
    //         : yValue - tooltipHeight - yMobileNudge
    //     : yValue - tooltipHeight - yNudge < 0
    //         ? yValue + yNudge
    //         : yValue - tooltipHeight - yMobileNudge

    // } else {
    //     yPosition = tooltipData.event.type === "focus"
    //     ? yValue - tooltipHeight < 0
    //         ? yValue
    //         : yValue - tooltipHeight 
    //     : yValue - tooltipHeight - yNudge < 0
    //         ? yValue + yNudge
    //         : yValue - tooltipHeight //- yNudge
    // }


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
    {tooltipHeight}
    {arrow}
    {xArrowPosition}
/>

</div>
