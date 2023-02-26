<script>
    import { scaleLinear } from "d3-scale"
    import { fade } from "svelte/transition"
    import { chartFontSize } from "../stores/responsiveFontSize";

    export let colorScale
    export let hoveredMapCountryData
    export let mapWidth
    export let height


    $: yPosition = mapWidth <= 800 ? height - 60 : height * 0.5

    $: xPosition = mapWidth <= 800 ? 0 : 100

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
        font-size={`${0.9 * $chartFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
    <!-- font-size="0.9rem"  -->
        Gay Travel Index
    </text>
    <text 
        x={legendWidth / 2} 
        y="20" 
        fill="darkgray" 
        font-size={`${0.8 * $chartFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
        Total Score 2021
    </text>
    <rect 
        id="legendBar" 
        x={0}
        y="40"
        width={legendWidth}
        height={legendHeight} 
    />
    <text 
        x=0 
        y={40 + legendHeight + 5} 
        fill="darkgray" 
        font-size={`${0.8 * $chartFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="end"
    >
        {colorScale.domain()[0]}
    </text>
    <text 
        x={legendWidth / 2} 
        y={40 + legendHeight + 5} 
        fill="darkgray" 
        font-size={`${0.8 * $chartFontSize}rem`}
        dominant-baseline="hanging" 
        text-anchor="middle"
    >
        {colorScale.domain()[1]}
    </text>
    <text 
        x={legendWidth} 
        y={40 + legendHeight + 5} 
        fill="darkgray" 
        font-size={`${0.8 * $chartFontSize}rem`}
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
        y1={40} y2={40 + legendHeight} 
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