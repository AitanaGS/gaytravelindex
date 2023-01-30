<script>
    export let countryScale;
    export let handleClick
    export let selectedContinent

    import { slide } from "svelte/transition"

    $: countries = countryScale.domain()

</script>


<g class="axis countries">
    <!-- {#each countries as country, i (country)} -->
    {#each countries as country, i (`${selectedContinent}${country}`)}
        <g 
            class="tick"
            in:slide={{ duration: 200, delay: 50 + 50 * i}} 
            >
            <text
                    class="country"
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