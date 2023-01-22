<script>
    export let indicatorScale;
    export let indicatorVariables
    export let indicatorLabelsLookup

    // $: indicators = indicatorScale.domain()

    // $: console.log(indicators)

    // console.log(indicatorVariables)


</script>


<g class="axis indicators">
    {#each indicatorVariables as indicator}
        <g class="tick">
            <text
                class="indicatorList"
                y={indicatorScale(indicator)}
                text-anchor="end"
                dominant-baseline="middle"
                dy={indicatorScale.bandwidth()/2}
            > {indicatorLabelsLookup.get(indicator)}</text>
        </g>

    {/each}

</g>