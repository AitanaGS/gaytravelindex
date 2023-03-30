<script>
    // import { tooltipFontSize } from "../stores/responsiveFontSize";
    import { COLORS } from "../utils/colors"  
    import { isMobile, isSmallMobile } from "../stores/dimensions";
    
    export let tooltipYearScale
    export let svgMargin
    export let years
    export let svgInnerHeight
    export let tooltipFontSize

</script>


<g
    class="axis years tooltipAxis tooltipYears"
    transform="translate({svgMargin.left}, {svgInnerHeight + svgMargin.top})"
    >
    {#each years as year}
    <g
    class="tick tooltipTick"
    transform="translate({tooltipYearScale(year)}, 0)"
>
    <text
        x={tooltipYearScale.bandwidth() / 2}
        y=10
        text-anchor=middle
        dominant-baseline="hanging"
        fill={COLORS.gray["700"]}
        font-size={ $isMobile
            ? year === 2012 || year === 2023
                ? `${0.55 * tooltipFontSize}rem`
                : `${0 * tooltipFontSize}rem`
            : year % 2 == 0 || year === 2023
                ? `${0.55 * tooltipFontSize}rem`
                : `${0 * tooltipFontSize}rem`
        }
        

        >
            {year}

    </text>
    <line
    x1={tooltipYearScale(year) + tooltipYearScale.bandwidth() / 2}
    x2={tooltipYearScale(year) + tooltipYearScale.bandwidth() / 2}
    y1=0
    y2=-{svgInnerHeight}
    stroke={COLORS.gray["200"]}
    stroke-width=1
/>
</g>

{/each}





    <!-- font-size={ $isSmallMobile
        ? year === 2012 || year === 2023
            ? year === 2023
                ? `${0.8 * $chartFontSize}rem`
                : `${0.7 * $chartFontSize}rem`
            : `${0 * $chartFontSize}rem`
        : $isMobile
            ? (year % 2 === 0 && year !== 2022) || year === 2023
                ? year === 2023 
                    ? `${0.8 * $chartFontSize}rem`
                    : `${0.7 * $chartFontSize}rem`
                : `${0 * $chartFontSize}rem`
            : year === 2023
                    ? `${0.8 * $chartFontSize}rem`
                    : `${0.7 * $chartFontSize}rem`
    } -->

    <!-- {#if $isMobile}
    {#if year === 2012 || year === 2023}
    <g
        class="tick tooltipTick"
        transform="translate({tooltipYearScale(year)}, 0)"
    >
        <text
            x={tooltipYearScale.bandwidth() / 2}
            y=10
            text-anchor=middle
            dominant-baseline="hanging"
            fill={COLORS.gray["700"]}
            font-size={`${0.55 * tooltipFontSize}rem`}

            >
                {year}

        </text>

    </g>
    {/if}
    {:else }
    {#if year % 2 == 0 || year === 2023}
    <g
        class="tick tooltipTick"
        transform="translate({tooltipYearScale(year)}, 0)"
    >
        <text
            x={tooltipYearScale.bandwidth() / 2}
            y=10
            text-anchor=middle
            dominant-baseline="hanging"
            fill={COLORS.gray["700"]}
            font-size={`${0.55 * tooltipFontSize}rem`}

            >
                {year}

        </text>

    </g>
    {/if}
        {/if} -->
</g>
