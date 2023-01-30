<script>
      import AxisIndicatorValues from './AxisIndicatorValues.svelte'

    export let indicatorScale;
    export let indicatorVariables
    export let indicatorLabelsLookup
    export let indicatorValueScale


</script>


<g class="axis indicators">
    {#each indicatorVariables as indicator}
        <g class="tick" transform="translate(0, 0)">
            <text
                class="indicatorList"
                y={indicatorScale(indicator)}
                text-anchor="end"
                dominant-baseline="middle"
                dy={indicatorScale.bandwidth()/2}
            > {indicatorLabelsLookup.get(indicator)}</text>
            <g
                transform="translate(20, {indicatorScale(indicator)})">
                    <AxisIndicatorValues {indicatorValueScale}/>


            </g>
        </g>

    {/each}

</g>