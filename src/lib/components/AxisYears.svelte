<script>
    // import { chartFontSizeScale } from "../utils/fontSizeScales"
    import { chartFontSize } from "../stores/responsiveFontSize";

    export let yearScale
    export let margin
    // export let currentWindowWidth

    $: years = yearScale.domain()

    // $: chartFontSize = chartFontSizeScale(currentWindowWidth)

</script>

<g class="axis years" transform="translate({margin.left}, {margin.top})">
    {#each years as year}
        <!-- <g class="tick" transform="translate({yearScale(year)}, 0)"> -->
            <g class="tick" transform="translate({yearScale(year)}, 0)">
            <text 
                x={yearScale.bandwidth() / 2} 
                y=0
                text-anchor="middle"
                dominant-baseline="middle"
                font-weight={year === 2021 ? "bold" : "normal"}
                font-size={year === 2021 ? 0.9 * $chartFontSize : 0.8 * $chartFontSize}
                >
                    {year}
                </text>
                <!-- font-size={year === 2021 ? "0.9rem" : "0.8rem"} -->
        </g>

    {/each}

</g>