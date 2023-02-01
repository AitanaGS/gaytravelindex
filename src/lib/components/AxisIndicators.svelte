<script>

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
                dx=-8
            > {indicatorLabelsLookup.get(indicator)}</text>
            <!-- dy={indicatorScale.bandwidth()/2} -->
            <line
            x1={0}
            x2={innerWidth}
            y1={indicatorScale(indicator) + indicatorScale.bandwidth()/2}
            y2={indicatorScale(indicator) + indicatorScale.bandwidth()/2}
            stroke="lightgray"
            stroke-width=1
        />
        </g>

    {/each}

</g>