<script>
    // import { tooltipFontSize } from "../stores/responsiveFontSize";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"
    import { prefersReducedMotion } from "../stores/preferesReducedMotion";
    import { COLORS } from "../utils/colors.js"

    import { fly, fade, slide } from "svelte/transition"
    import { scaleLinear } from 'd3-scale';

    export let tooltipData
    export let country
    export let colorScale
    export let lastYearOnly
    export let xPosition
    export let yPosition
    export let flyDirection
    export let tooltipWidth

    // let tooltipWidth = 200


    const tooltipFontSizeScale = scaleLinear()
        .domain([100, 200])
        .range([1.1, 0.95]) //.range([26, 16])
        .clamp(true);

    $: tooltipFontSize = tooltipFontSizeScale(tooltipWidth)

    // $: console.log(tooltipWidth)


    // TODO css variables for background and color
    // TODO: check hsla code in style

    $: transitionToUse = $prefersReducedMotion ? () => {} : fly
    
</script>

<!-- in:fly={{ y: yPosition < indicatorScale(indicator2021Data.indicator) ? 20 : -20,
    duration: 200, 
    delay: 100 }} -->


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
    "
>
<!-- in:transitionToUse={{ y: 20 * flyDirection,
    duration: 200, 
    delay: 100 }} -->
<!-- bind:clientWidth={tooltipWidth} -->
<!-- --fontSize: {$tooltipFontSize}rem; -->
<!-- bind:clientHeight={tooltipHeight} -->
<!-- in:fly={{ y: 10, duration: 200, delay: 100 }} -->
    {#if $isDesktop}
        <h3>{country} {lastYearOnly === true ? "2023" : tooltipData.year}</h3>
    {/if}
    {#if $isMobile || $isTablet}
        <h3 class="tooltipHeading">
            <span>{country}</span>
            <span>{lastYearOnly === true ? "2023" : tooltipData.year}</span>
        </h3>
    {/if}
    <div class="info">
        <span 
            class="total"
            style="
                background: {colorScale(tooltipData.total)};
                color: {tooltipData.total < 8 && tooltipData.total > -15 ? COLORS.gray["900"] : COLORS.gray["50"]};
            ">
            GTI: {tooltipData.total}
        </span>
        <!-- color: {tooltipData.total < 8 && tooltipData.total > -15 ? "black" : "white"}; -->
        <p class="ranking">global ranking: {tooltipData.ranking}</p>
    </div>

</div>

<style>
    .tooltip {
        position: absolute;
        background: white;
        box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
        padding: 8px 6px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
        transition: top 300ms ease, left 300ms ease; 
        text-align: center;
        /* margin: 0 auto; */
        width: var(--width);
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
        /* margin: 0 auto; */
  /* text-align: center; */
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