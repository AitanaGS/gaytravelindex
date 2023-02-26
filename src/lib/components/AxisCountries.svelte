<script>
    import { slide } from "svelte/transition"
    import { createEventDispatcher } from "svelte"
    import { clickedCountry } from "../stores/clickedCountry";
    import { clickedContinent } from "../stores/clickedContinent";
    // import { chartFontSizeScale } from "../utils/fontSizeScales"
    import { chartFontSize } from "../stores/responsiveFontSize";

    export let countryScale;
    // export let handleClick
    export let selectedContinent
    export let margin
    // export let currentWindowWidth

    $: countries = countryScale.domain()


    let hoveredCountry
    
    const axisHandleHover = (country) => {
        hoveredCountry = country
    }

    // let selectedCountry = ""

    const dispatch = createEventDispatcher()

    // function dispatchCountryClick(country, continent) {
    //     selectedCountry = country
    //     dispatch("countryClick", {
    //         country,
    //         continent
    //     })
    // }

    let selectedCountry

    clickedCountry.subscribe(country => {
        selectedCountry = country
    })

    function handleCountryClick(country, continent) {
        selectedCountry = country
        clickedCountry.set(country)
        clickedContinent.set(continent)
        dispatch("countryClick")
    }

    // $: chartFontSize = chartFontSizeScale(currentWindowWidth)


</script>


<g class="axis countries" transform="translate({margin.left}, {margin.top})">
    <!-- {#each countries as country, i (country)} -->
    {#each countries as country, i (`${selectedContinent}${country}`)}
        <g 
            class="tick country"
            in:slide={{ duration: 300, delay: 50 + 50 * i}} 
            >
            <rect 
                on:click={() => handleCountryClick(country, selectedContinent)}
                on:keypress={() => handleCountryClick(country, selectedContinent)}
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
                    font-weight={hoveredCountry === country ||  selectedCountry == country ? "bold" : "normal"}
                    font-size={`${0.9 * $chartFontSize}rem`}
                    class="countryName"
                >{country}</text>
                <!-- font-size="0.9rem" -->
        </g>

    {/each}

</g>


<style>
    .countryRect {
        cursor: pointer;
    }

    .countryName {
        pointer-events: none;
        transition: all 200ms ease;
    }

    /* .countryList {
  cursor: pointer;
} */



</style>