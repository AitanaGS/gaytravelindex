<script>
    export let indicatorValueScale
    export let margin

    let indicatorValues = indicatorValueScale.ticks()


</script>


<g class="axis indicatorvalues" transform="translate({margin.left}, {margin.top})">
    {#each indicatorValues as value}
        <g class="tick" >
            <!-- transform="translate(20, 0)" -->
            <text
                class="indicatorList"
                x={indicatorValueScale(value)}
                text-anchor="middle"
                dominant-baseline="middle"
            > {value}</text>
            <line
                x1={indicatorValueScale(value)}
                x2={indicatorValueScale((value))}
                y1=10
                y2={innerHeight}
                stroke="lightgray"
                stroke-width=1
            />
            <!-- dy={indicatorScale.bandwidth()/2} -->
            <!-- y2={innerHeight} -->
        </g>

    {/each}

</g>