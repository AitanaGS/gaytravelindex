<script>
    export let countryScale;

    $: countries = countryScale.domain()

</script>


<g class="axis countries">
    {#each countries as country}
        <g class="tick">
            <text 
                y={countryScale(country)}
                text-anchor="end"
                dominant-baseline="middle"
                dy={countryScale.bandwidth()/2}
            >{country}</text>
        </g>

    {/each}

</g>