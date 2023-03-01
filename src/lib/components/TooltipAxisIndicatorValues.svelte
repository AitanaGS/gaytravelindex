<script>
    // import { tooltipFontSize } from "../stores/responsiveFontSize";

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
                font-size={`${0.55 * tooltipFontSize}rem`}
            >
            <!-- font-size="0.55rem" -->
            {value}

            </text>
            <line
                x1=0
                x2={svgInnerWidth}
                y1={tooltipIndicatorValueScale(value)}
                y2={tooltipIndicatorValueScale(value)}
                stroke={value === 0 ? "gray" : "lightgray"}
                stroke-width=1
            />

        </g>

    {/each}

</g>

         <!-- <line
                x1={indicatorValueScale(value)}
                x2={indicatorValueScale((value))}
                y1=10
                y2={innerHeight}
                stroke="lightgray"
                stroke-width=1
            /> -->