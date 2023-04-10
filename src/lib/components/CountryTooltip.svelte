<script>
    import { prefersReducedMotion } from "../stores/preferesReducedMotion"

    import { COLORS } from "../utils/constants.js"

    import { fly } from "svelte/transition"
    import { scaleLinear } from 'd3-scale'

    export let tooltipData
    export let country
    export let colorScale
    export let lastYearOnly
    export let xPosition
    export let yPosition
    export let flyDirection
    export let tooltipWidth
    export let arrow
    export let xArrowPosition


    const tooltipFontSizeScale = scaleLinear()
        .domain([100, 200])
        .range([1.1, 0.95])
        .clamp(true);

    $: tooltipFontSize = tooltipFontSizeScale(tooltipWidth)

    $: transitionToUse = $prefersReducedMotion ? () => {} : fly

    
</script>

<div
    bind:clientWidth={tooltipWidth} 
    in:transitionToUse={{ y: 20 * flyDirection,
        duration: 250, 
        delay: 100 }}
    class="tooltip countryTooltip"
    style="
        top: {yPosition}px;
        left: {xPosition}px;
        --fontSize: {tooltipFontSize}rem;
        --width: {tooltipWidth}px;
        --backgroundColor: {COLORS.white};
        --yArrowPosition: {flyDirection < 0 ? `100%` : 0};
        --xArrowPosition: {xArrowPosition === "left" ? "calc(0% + 12px)" : xArrowPosition === "right" ? "calc(100% - 12px)" : "50%"};
        --arrowColor: {arrow ? COLORS.white : "transparent"};
        --arrowSize: { flyDirection < 0 ? "80%" : "20%"};
    "
>
        <h3 class="tooltipHeading">
            <span>{country}</span>
            <span>{lastYearOnly === true ? "2023" : tooltipData.year}</span>
        </h3>
    <div class="info">
        <span 
            class="total"
            style="
                background: {colorScale(tooltipData.total)};
                color: {tooltipData.total < 8 && tooltipData.total > -15 ? COLORS.gray["900"] : COLORS.gray["50"]};
            ">
            GTI: {tooltipData.total}
        </span>
        <p class="ranking">global ranking: {tooltipData.ranking ?? "-"}</p>
    </div>

</div>

<style>
    .tooltip {
        position: absolute;
        background: var(--backgroundColor);
        box-shadow: hsla(0, 0%, 0%, 0.10) 2px 3px 8px;
        padding: 8px 6px;
        border-radius: 8px;
        pointer-events: none;
        white-space: nowrap;
        transition: top 300ms ease, left 300ms ease; 
        text-align: center;
        width: var(--width);
    }

    .tooltip:before {
        content: '';
        position: absolute;
        bottom: var(--yArrowPosition);
        left: var(--xArrowPosition);
        width: 12px;
        height: 12px;
        background: var(--arrowColor);
        transform: translate(-50%, var(--arrowSize)) rotate(45deg);
        transform-origin: center center;
        z-index: 10;
    }

    .tooltipHeading {
        display: flex;
        flex-direction: column;
    }

    h3 {
        margin: 0px;
        font-size: calc(var(--fontSize) * 0.9);
        font-weight: 700;
        margin-bottom: 3px;
    }

    .info {
        font-size: calc(var(--fontSize) * 0.9);;
    }


    .total {
        padding: 4px 5px 4px 5px;
        border-radius: 5px;
        white-space: nowrap;
        margin: 0px;
    }

    .ranking {
        margin: 0;
        white-space: nowrap;
    }


</style>