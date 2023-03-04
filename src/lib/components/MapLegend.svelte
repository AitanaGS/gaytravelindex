<script>
    import { scaleLinear } from "d3-scale"
    import { fade } from "svelte/transition"
    import { chartFontSize, tooltipFontSize } from "../stores/responsiveFontSize";
    // import { isTablet, isMobile } from "../stores/devices";
    import { isTablet, isMobile } from "../stores/dimensions";

    export let colorScale
    export let hoveredMapCountryData
    export let mapWidth
    export let height


    // $: yPosition = mapWidth <= 800 ? height - 60 : height * 0.5

    // $: xPosition = mapWidth <= 800 ? 0 : 100

    const mapFontSizeScale = scaleLinear()
        .domain([300, 1000])
        .range([1.2, 1.1]) //.range([26, 16])
        .clamp(true);

    $: mapFontSize = mapFontSizeScale(mapWidth)


    $: yPosition = $isMobile
        ? height * 0.8
        : $isTablet
            ? height * 0.8
            : height * 0.7

    $: xPosition = $isMobile
        ? 0.1 * mapWidth
        : $isTablet 
            ? 0.1 * mapWidth 
            : 0.1 * mapWidth

    let totalScorePercentScale = scaleLinear()
        .domain([colorScale.domain()[0], colorScale.domain()[2]])
        .range([0, 1])

    let totalScorePercent

    $: if (hoveredMapCountryData) {
        totalScorePercent = totalScorePercentScale(hoveredMapCountryData.data.total)
    }

    const legendHeight = 20
    const legendWidth = 100


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
        fill="darkgray" 
        font-size={`${0.9 * mapFontSize}rem`}
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
        y="20"
        width={legendWidth}
        height={legendHeight} 
    />
    <!-- y="40" -->
    <text 
        x=0 
        y={20 + legendHeight + 5} 
        fill="darkgray" 
        font-size={`${0.8 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="end"
    >
        {colorScale.domain()[0]}
    </text>
    <text 
        x={legendWidth / 2} 
        y={20 + legendHeight + 5} 
        fill="darkgray" 
        font-size={`${0.8 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
        {colorScale.domain()[1]}
    </text>
    <text 
        x={legendWidth} 
        y={20 + legendHeight + 5} 
        fill="darkgray" 
        font-size={`${0.8 * mapFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="start"
    >
        {colorScale.domain()[2]}
    </text>
    {#if (hoveredMapCountryData)}
    <line 
        class="legendLine"
        in:fade={{ duration: 250 }}
        x1={legendWidth * totalScorePercent} 
        x2={legendWidth * totalScorePercent} 
        y1={20} y2={20 + legendHeight} 
        stroke="#303030"
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
        transition: all 500ms ease;
    }

</style>