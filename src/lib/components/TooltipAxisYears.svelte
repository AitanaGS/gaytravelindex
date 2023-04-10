<script>  
    import { isSmall } from "../stores/dimensions"
    import { years } from "../stores/data"

    import { COLORS } from "../utils/constants"
    
    export let tooltipYearScale
    export let svgMargin
    export let svgInnerHeight
    export let tooltipFontSize

</script>


<g
    class="axis years tooltipAxis tooltipYears"
    transform="translate({svgMargin.left}, {svgInnerHeight + svgMargin.top})"
    >
    {#each $years as year}
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
            font-size={ $isSmall
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

</g>
