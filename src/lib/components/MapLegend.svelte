<script>
    import { scaleLinear } from "d3-scale"
    import { fade } from "svelte/transition"
    import { chartFontSize } from "../stores/responsiveFontSize";
    // import { isTablet, isSmall } from "../stores/devices";
    import { isSmall, width } from "../stores/dimensions";
    import { prefersReducedMotion } from "../stores/preferesReducedMotion";
    import { COLORS } from "../utils/constants"

    export let colorScale
    export let hoveredMapCountryData
    // export let mapWidth
    export let height
    // export let width

    $: chartWidth = $width * 0.8


    // $: yPosition = mapWidth <= 800 ? height - 60 : height * 0.5

    // $: xPosition = mapWidth <= 800 ? 0 : 100

    const mapFontSizeScale = scaleLinear()
        .domain([300, 1000])
        .range([1.5, 0.8]) //.range([26, 16])
        .clamp(true);

    $: mapFontSize = mapFontSizeScale(chartWidth)
    

    // $: yPosition = $isSmall
    //     ? height * 0.8
    //     : $isTablet
    //         ? height * 0.8
    //         : height * 0.7

    $: yPosition = height * 0.8

    $: xPosition = 0.1 * chartWidth

    // $: xPosition = $isSmall
    //     ? 0.1 * chartWidth
    //     : $isTablet 
    //         ? 0.1 * chartWidth
    //         : 0.1 * chartWidth

    let totalScorePercentScale = scaleLinear()
        .domain([colorScale.domain()[0], colorScale.domain()[2]])
        .range([0, 1])

    let totalScorePercent

    $: if (hoveredMapCountryData) {
        totalScorePercent = totalScorePercentScale(hoveredMapCountryData.data.total)
    }

    const legendHeight = 20
    const legendWidth = 100

    // $: yNudge = $isDesktop ? 14 : 20

    $: yNudge = 20

    $: transitionToUse = $prefersReducedMotion ? () => {} : fade


</script>

<g class="legend" transform="translate({xPosition}, {yPosition})">
    <defs>
        <linearGradient id="legendGradient">
            <stop class="stop1" offset="0%" style="--color: {colorScale(colorScale.domain()[0])};"/>
            <stop class="stop2" offset="50%" style="--color: {colorScale(colorScale.domain()[1])};"/>
            <stop class="stop3" offset="100%" style="--color: {colorScale(colorScale.domain()[2])};"/>
        </linearGradient>
    </defs>
    <text 
        x={legendWidth / 2} 
        fill={COLORS.gray["700"]}
        font-size={`${0.8 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
    <!-- font-size="0.9rem"  -->
        Gay Travel Index
    </text>
    <!-- <text 
        x={legendWidth / 2} 
        y="20" 
        fill="darkgray" 
        font-size={`${0.8 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
        2021
    </text> -->
    <rect 
        id="legendBar" 
        x={0}
        y={yNudge}
        width={legendWidth}
        height={legendHeight} 
    />
    <!-- y="40" -->
    <text 
        x=0 
        y={yNudge + legendHeight + 5} 
        fill={COLORS.gray["700"]}
        font-size={`${0.7 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="end"
    >
        {colorScale.domain()[0]}
    </text>
    <text 
        x={legendWidth / 2} 
        y={yNudge + legendHeight + 5} 
        fill={COLORS.gray["700"]}
        font-size={`${0.7 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
        {colorScale.domain()[1]}
    </text>
    <text 
        x={legendWidth} 
        y={yNudge + legendHeight + 5} 
        fill={COLORS.gray["700"]}
        font-size={`${0.7 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="start"
    >
        {colorScale.domain()[2]}
    </text>
    {#if (hoveredMapCountryData)}
    <line 
    class="legendLine"
    in:transitionToUse={{ duration: 50 }}
    x1={legendWidth * totalScorePercent} 
    x2={legendWidth * totalScorePercent} 
    y1={yNudge} y2={yNudge + legendHeight} 
    stroke={COLORS.gray["100"]}
    stroke-width=3/>
    <line 
        class="legendLine"
        in:transitionToUse={{ duration: 50 }}
        x1={legendWidth * totalScorePercent} 
        x2={legendWidth * totalScorePercent} 
        y1={yNudge} y2={yNudge + legendHeight} 
        stroke={COLORS.gray["700"]}
        stroke-width=2/>
    {/if}
    
</g>

<style>
    #legendBar { 
        fill: url(#legendGradient); 
    }

    .stop1 { 
        stop-color: var(--color); 
    }

    .stop2 { 
        stop-color: var(--color);
    }
              
    .stop3 { 
        stop-color: var(--color); 
    }

    .legendLine {
        transition: opacity 200ms ease;
    }

</style>