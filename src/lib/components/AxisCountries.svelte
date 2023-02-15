<script>
    import { slide } from "svelte/transition"
    import { createEventDispatcher } from "svelte"

    export let countryScale;
    // export let handleClick
    export let selectedContinent
    export let margin

    $: countries = countryScale.domain()


    let hoveredCountry
    
    const axisHandleHover = (country) => {
        hoveredCountry = country
    }

    const dispatch = createEventDispatcher()

    function dispatchCountryClick(country, continent) {
        dispatch("countryClick", {
            country,
            continent
        })
    }

</script>


<g class="axis countries" transform="translate({margin.left}, {margin.top})">
    <!-- {#each countries as country, i (country)} -->
    {#each countries as country, i (`${selectedContinent}${country}`)}
        <g 
            class="tick country"
            in:slide={{ duration: 300, delay: 50 + 30 * i}} 
            >
            <rect 
                on:click={() => dispatchCountryClick(country, selectedContinent)}
                on:keypress={() => dispatchCountryClick(country, selectedContinent)}
                on:mouseover={() => axisHandleHover(country)}
                on:focus={() => axisHandleHover(country)}
                on:mouseleave={() => axisHandleHover(null)}
                y={countryScale(country)} 
                x={-country.length * 10} 
                width={country.length * 10} 
                height={countryScale.bandwidth()} 
                fill="transparent"
                class="countryRect"
                />
            <!-- in:slide={{ duration: 200, delay: 50 + 50 * i}}  -->
            <text
                    y={countryScale(country)}
                    text-anchor="end"
                    dominant-baseline="middle"
                    dy={countryScale.bandwidth()/2}
                    font-weight={hoveredCountry === country ? "bold" : "normal"}
                    font-size="0.9rem"
                    class="countryName"
                >{country}</text>
        </g>

    {/each}

</g>


<style>
    .countryRect {
        cursor: pointer;
    }

    .countryName {
        pointer-events: none;
    }



</style>