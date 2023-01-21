<script>
    export let countryScale;
    export let handleClick

    $: countries = countryScale.domain()

</script>


<g class="axis countries">
    {#each countries as country}
        <g class="tick">
            <text
                class="countryList"
                on:click={(e) => handleClick(e, country)}
                on:keypress={(e) => handleClick(e, country)}
                y={countryScale(country)}
                text-anchor="end"
                dominant-baseline="middle"
                dy={countryScale.bandwidth()/2}
            >{country}</text>
        </g>

    {/each}

</g>