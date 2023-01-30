<script>
    export let indicatorValueScale


    let indicatorValueTicks = indicatorValueScale.ticks()

    // console.log(indicatorValueScale.ticks())


</script>


<g class="axis indicators">
    {#each indicatorValueTicks as tick}
        <g class="tick"  transform="translate(0, 0)">
            <text
                class="indicatorList"
                y={indicatorValueScale(tick)}
                text-anchor="end"
                dominant-baseline="hanging"
            > {tick}</text>
            <!-- dy={indicatorScale.bandwidth()/2} -->
        </g>

    {/each}

</g>