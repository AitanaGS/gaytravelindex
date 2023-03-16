<script>
    import { slide } from "svelte/transition"
    import { createEventDispatcher } from "svelte"
    import { selectedCountry } from "../stores/selectedCountry";
    import { selectedContinent } from "../stores/selectedContinent";
    // import { chartFontSizeScale } from "../utils/fontSizeScales"
    import { chartFontSize } from "../stores/responsiveFontSize";
    import { prefersReducedMotion } from "../stores/preferesReducedMotion"
    // import { selectedContinentData } from "../stores/data";

    export let countryScale;
    // export let handleClick
    // export let selectedContinent
    export let margin
    export let selectedContinentData
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

    // let selectedCountry

    // clickedCountry.subscribe(country => {
    //     selectedCountry = country
    // })

    function handleCountryClick(country, continent) {
        // selectedCountry = country
        selectedCountry.set(country)
        selectedContinent.set(continent)
        dispatch("countryClick")
    }

    $: transitionToUse = $prefersReducedMotion ? () => {} : slide

    // $: chartFontSize = chartFontSizeScale(currentWindowWidth)
    // TODO: check screen reader list (number of items)
    // $: console.log(selectedContinentData)

    $: console.log("axis countries", selectedContinentData, $selectedCountry)


</script>


<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<g class="axis countries" transform="translate({margin.left}, {margin.top})" tabindex="0" role="list" aria-label="Country list" > 
    <!-- tabindex="0" role="list" aria-describedby="Country list" -->
    <!-- {#each countries as country, i (country)} -->
    {#each countries as country, i (`${$selectedContinent}${country}`)}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <g 
            class="tick country"
            in:transitionToUse={{ duration: 300, delay: 50 + 50 * i}}
            tabindex="0"
            aria-describedby="countryInfo"
            role="listitem"
            >
            <!-- role="listitem"
                       aria-describedby="countryInfo"
            tabindex="0" -->
            <desc id="countryInfo">
                {country}:
                {#each selectedContinentData.get(country).sort((a, b) => a.year - b.year) as d}
                year: {d.year}: total rating: {d.total}, global ranking: {d.ranking}
                {/each}
            </desc>
            <rect 
                on:click={() => handleCountryClick(country, $selectedContinent)}
                on:keypress={() => handleCountryClick(country, $selectedContinent)}
                on:mouseover={() => axisHandleHover(country)}
                on:focus={() => axisHandleHover(country)}
                on:mouseleave={() => axisHandleHover(null)}
                on:blur={() => axisHandleHover(null)}
                y={countryScale(country)} 
                x={-margin.left + 2} 
                width={margin.left - 2} 
                height={countryScale.bandwidth()} 
                fill="transparent"
                class="countryRect"
                />
                <!-- x={-country.length * 10} 
                width={country.length * 10}  
                tabindex={i + 1}
            -->
            <!-- in:slide={{ duration: 200, delay: 50 + 50 * i}}  -->
            <text
                    y={countryScale(country)}
                    text-anchor="end"
                    dominant-baseline="middle"
                    dy={countryScale.bandwidth()/2}
                    font-weight={hoveredCountry === country ||  $selectedCountry == country ? "bold" : "normal"}
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