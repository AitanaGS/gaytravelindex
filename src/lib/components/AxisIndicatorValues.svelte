<script>
    import { isMobile } from "../stores/dimensions";
    import { chartFontSize } from "../stores/responsiveFontSize";
    import { COLORS } from "../utils/constants"

    export let indicatorValueScale
    export let margin
    export let innerHeight

    let indicatorValues = indicatorValueScale.ticks()


</script>


<g class="axis indicatorvalues" transform="translate({margin.left}, {margin.top})">
    {#each indicatorValues as value}
        <g class="tick" >
            <!-- transform="translate(20, 0)" -->
            {#if $isMobile && (value === -5 || value === 0 || value === 3)}
            <text
                class="indicatorValueList"
                x={indicatorValueScale(value)}
                text-anchor="middle"
                dominant-baseline="middle"
                fill={COLORS.gray["700"]}
                font-size={`${0.8 * $chartFontSize}rem`}
                role="presentation"
                aria-hidden="true"
            > {value}</text>
            {:else if !$isMobile}
            <text
                class="indicatorValueList"
                x={indicatorValueScale(value)}
                text-anchor="middle"
                dominant-baseline="middle"
                fill={COLORS.gray["800"]}
                font-size={`${0.8 * $chartFontSize}rem`}
                role="presentation"
                aria-hidden="true"
                > {value}</text>

            {/if}
            <line
                x1={indicatorValueScale(value)}
                x2={indicatorValueScale((value))}
                y1=10
                y2={innerHeight}
                stroke={COLORS.gray["200"]}
                stroke-width=1
            />
            <!-- dy={indicatorScale.bandwidth()/2} -->
            <!-- y2={innerHeight} -->
        </g>

    {/each}

</g>