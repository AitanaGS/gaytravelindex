<script>
    import { slide } from "svelte/transition"

    export let countryScale;
    export let handleClick
    export let selectedContinent
    export let margin

    $: countries = countryScale.domain()


    let hoveredCountry
    
    const axisHandleHover = (e, country) => {
        hoveredCountry = country
    }


</script>


<g class="axis countries" transform="translate({margin.left}, {margin.top})">
    <!-- {#each countries as country, i (country)} -->
    {#each countries as country, i (`${selectedContinent}${country}`)}
        <g 
            class="tick country"
            in:slide={{ duration: 300, delay: 50 + 30 * i}} 
            >
            <!-- in:slide={{ duration: 200, delay: 50 + 50 * i}}  -->
            <text
                    on:click={(e) => handleClick(e, country)}
                    on:keypress={(e) => handleClick(e, country)}
                    on:mouseover={(e) => axisHandleHover(e, country)}
                    on:focus={(e) => axisHandleHover(e, country)}
                    on:mouseleave={(e) => axisHandleHover(e, null)}
                    y={countryScale(country)}
                    text-anchor="end"
                    dominant-baseline="middle"
                    dy={countryScale.bandwidth()/2}
                    font-weight={hoveredCountry === country ? "bold" : "normal"}
                    font-size="0.9rem"
                >{country}</text>
        </g>

    {/each}

</g>


<style>
    .country {
        cursor: pointer;
    }
</style>