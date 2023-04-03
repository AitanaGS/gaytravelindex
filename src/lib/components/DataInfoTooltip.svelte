<script>
    // import { tooltipFontSize } from "../stores/responsiveFontSize";
    import { isMobile, isTablet, isDesktop } from "../stores/dimensions"
    import { prefersReducedMotion } from "../stores/preferesReducedMotion";
    import { COLORS } from "../utils/colors.js"

    import { fly, fade, slide } from "svelte/transition"
    import { scaleLinear } from 'd3-scale';

    let tooltipWidth = $isMobile ? 200 : 250


    const tooltipFontSizeScale = scaleLinear()
        .domain([100, 200])
        .range([1.1, 0.95]) //.range([26, 16])
        .clamp(true);

    $: tooltipFontSize = tooltipFontSizeScale(tooltipWidth)

    // $: console.log(tooltipWidth)


    // TODO css variables for background and color
    // TODO: check hsla code in style

    $: transitionToUse = $prefersReducedMotion ? () => {} : fly

    // $: console.log(flyDirection, tooltipHeight)
    
</script>

<!-- in:fly={{ y: yPosition < indicatorScale(indicator2021Data.indicator) ? 20 : -20,
    duration: 200, 
    delay: 100 }} -->


<div
    bind:clientWidth={tooltipWidth} 
    in:transitionToUse={{ y: 20 * -1,
        duration: 250, 
        delay: 100 }}
    class="tooltip dataInfoTooltip"
    style="
        top: 100%;
        left: {$isMobile ? `calc(-${tooltipWidth}px + 100%)`: 0};
        --fontSize: {tooltipFontSize}rem;
        --width: {tooltipWidth}px;
        --backgroundColor: {COLORS.white};
        --yArrowPosition: 100%;
        --xArrowPosition: {$isMobile ? `${tooltipWidth - 12}px`: `12px`};
        --arrowColor: {COLORS.white};
        --arrowSize: 50%;
        --borderColor: {COLORS.primary["600"]};
    "
>
<!-- in:transitionToUse={{ y: 20 * flyDirection,
    duration: 200, 
    delay: 100 }} -->
<!-- bind:clientWidth={tooltipWidth} -->
<!-- --fontSize: {$tooltipFontSize}rem; -->
<!-- bind:clientHeight={tooltipHeight} -->
<!-- in:fly={{ y: 10, duration: 200, delay: 100 }} -->

    <!-- <h3 class="tooltipHeading">
        Data
    </h3> -->
    <p><strong>Data 2012 - 2021:</strong> <br>             
        <a 
        href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
        target="_blank" rel="noreferrer">Spartacus International Gay guide
        </a> 
        via 
        <a 
        href="https://www.makeovermonday.co.uk/"
        target="_blank" rel="noreferrer">Makeover Monday
        </a> 
    </p>
    <p><strong>Data 2023:</strong><br>  
        <a 
        href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/"
        target="_blank" rel="noreferrer">Spartacus International Gay guide
        </a>,
        scraped from the report.
    </p>
    <p><strong>Geographical Data:</strong><br>  
        <a 
        href="https://www.naturalearthdata.com/"
        target="_blank" rel="noreferrer">Natural Earth
        </a>
    </p>

</div>

<style>
    .tooltip {
        position: absolute;
        /* background: white; */
        background: var(--backgroundColor);
        box-shadow: rgba(0, 0, 0, 0.10) 2px 3px 8px;
        /* box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px; */
        padding: 8px 6px;
        /* border-radius: 4px; */
        border-radius: 3px;
        pointer-events: none;
        /* white-space: nowrap; */
        transition: top 300ms ease, left 300ms ease; 
        /* text-align: center; */
        /* margin: 0 auto; */
        width: var(--width);
        border: 2px solid var(--borderColor);
    }

    .tooltip:after {
    content: '';
    position: absolute;
    bottom: var(--yArrowPosition);
    left: var(--xArrowPosition);
    width: 12px;
    height: 12px;
    background: var(--arrowColor);
    border: 2px solid var(--borderColor);
    border-radius: 2px;
    border-bottom-color: transparent;
    border-right-color: transparent;
    transform: translate(-50%, var(--arrowSize)) rotate(45deg);
    transform-origin: center center;
    z-index: 10;
}

    /* .tooltipHeading {
        display: flex;
        flex-direction: column;
    } */

    /* h3 {
        margin: 0px;
        font-size: calc(var(--fontSize) * 0.9);
        font-weight: 700;
        margin-bottom: 3px;
    } */

    p {
        font-size: calc(var(--fontSize) * 0.9);
        overflow-wrap: word-wrap; /* IE */
        overflow-wrap: break-word;
        /* hyphens: auto; */
    
    /* Prefix for Safari */
    /* -webkit-hyphens: auto; */
        /* margin: 0 auto; */
  /* text-align: center; */
    }


    /* .total {
        padding: 4px 5px 4px 5px;
        border-radius: 5px;
        white-space: nowrap;
        margin: 0px;
    }

    .ranking {
        margin: 0;
        white-space: nowrap;
    } */


</style>