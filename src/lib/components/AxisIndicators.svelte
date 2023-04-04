<script>
    import { chartFontSize } from "../stores/responsiveFontSize";
    import { isSmall } from "../stores/dimensions";
    import { COLORS } from "../utils/constants";

    export let indicatorScale;
    export let indicatorVariables
    export let indicatorLabelsLookup
    export let margin


</script>


<g class="axis indicators" transform="translate({margin.left}, {margin.top})">
    {#each indicatorVariables as indicator}
        <g class="tick">
            <text
                y={indicatorScale(indicator)}
                text-anchor="end"
                dominant-baseline="middle"
                dy={indicatorScale.bandwidth()/2}
                dx=-5
                fill={COLORS.gray["800"]}
                font-size={$isSmall ? `${0.8 * $chartFontSize}rem` : `${0.9 * $chartFontSize}rem`}
                role="presentation"
                aria-hidden="true"
            > {indicatorLabelsLookup.get(indicator)}</text>
            <!-- dy={indicatorScale.bandwidth()/2} -->
            <line
            x1={0}
            x2={innerWidth}
            y1={indicatorScale(indicator) + indicatorScale.bandwidth()/2}
            y2={indicatorScale(indicator) + indicatorScale.bandwidth()/2}
            stroke={COLORS.gray["200"]}
            stroke-width=1
        />
        </g>

    {/each}

</g>