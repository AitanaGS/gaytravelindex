<script>
    import { COLORS } from "../utils/constants";

    export let tooltipIndicatorValueScale
    export let svgMargin
    export let svgInnerWidth
    export let tooltipFontSize

    let indicatorValues = tooltipIndicatorValueScale.ticks()

</script>

<g
    class="axis indicatorValues tooltipAxis tooltipIndicatorValues"
    transform="translate({svgMargin.left}, {svgMargin.top})"
>
    {#each indicatorValues as value}
        <g class="tick">
            <text
                x=-10
                y={tooltipIndicatorValueScale(value)}
                text-anchor="end"
                dominant-baseline="middle"
                fill={COLORS.gray["700"]}
                font-size={`${0.55 * tooltipFontSize}rem`}
            >
            {value}

            </text>
            <line
                x1=0
                x2={svgInnerWidth}
                y1={tooltipIndicatorValueScale(value)}
                y2={tooltipIndicatorValueScale(value)}
                stroke={value === 0 ? COLORS.gray["500"] : COLORS.gray["200"]}
                stroke-width=1
            />

        </g>

    {/each}

</g>
