<script>
    import { selectedCountry } from "../stores/selectedCountry"
    import { selectedContinent } from "../stores/selectedContinent"
    import { chartFontSize } from "../stores/responsiveFontSize"
    import { prefersReducedMotion } from "../stores/preferesReducedMotion"
    import { isSmall } from "../stores/dimensions"
    import { activeSearch } from "../stores/search"
    import { activeData } from "../stores/data"

    import { COLORS } from "../utils/constants"

    import { createEventDispatcher } from "svelte"
    import { slide } from "svelte/transition"

    export let countryScale;
    export let margin

    $: countries = countryScale.domain()

    let hoveredCountry
    
    const axisHandleHover = (country) => {
        hoveredCountry = country
    }

    const dispatch = createEventDispatcher()

    function handleCountryClick(country, continent) {
        selectedCountry.set(country)
        selectedContinent.set(continent)
        dispatch("countryClick")
    }

    $: transitionToUse = $prefersReducedMotion || $activeSearch ? () => {} : slide

</script>


<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<g class="axis countries" transform="translate({margin.left}, {margin.top})" tabindex="0" role="list" aria-label="Country list">
    {#each countries as country, i (`${country}`)}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <g 
            class="tick country"
            in:transitionToUse={{ duration: 300, delay: 100 + 50 * i}}
            tabindex="0"
            aria-describedby="countryInfo"
            role="listitem"
            >
            <desc id="countryInfo">
                {country}:
                {#each $activeData.get(country) ? $activeData.get(country).sort((a, b) => a.year - b.year) : [] as d}
                year: {d.year}: total rating: {d.total}, global ranking: {d.ranking}
                {/each}
            </desc>
            <rect 
                on:click={() => handleCountryClick(country, $selectedContinent)}
                on:keypress={() => handleCountryClick(country, $selectedContinent)}
                on:mouseenter={() => axisHandleHover(country)}
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
            <text
            y={countryScale(country)}
            text-anchor="end"
            dominant-baseline="middle"
            dy={countryScale.bandwidth()/2}
            fill={COLORS.gray["800"]}
            font-weight={hoveredCountry === country ||  $selectedCountry == country ? "bold" : "normal"}
            font-size={$isSmall ? `${0.7 * $chartFontSize}rem` : `${0.9 * $chartFontSize}rem`}
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
        transition: font-weight 200ms ease, font-size 200ms ease;
    }

</style>