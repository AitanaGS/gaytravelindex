<script>
    import { tooltipFontSize } from "../stores/responsiveFontSize";

    export let tooltipYearScale
    export let svgMargin
    export let years
    export let svgInnerHeight
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
                font-size={$tooltipFontSize * 0.55}

                >
                    {year}

            </text>

        </g>

    {/each}

</g>
