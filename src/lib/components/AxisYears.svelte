<script>
    // import { chartFontSizeScale } from "../utils/fontSizeScales"
    import { chartFontSize } from "../stores/responsiveFontSize";
    import { isDesktop, isTablet, isMobile, isSmallMobile } from "../stores/dimensions";

    export let yearScale
    export let margin
    // export let currentWindowWidth

    $: years = yearScale.domain()

    // $: chartFontSize = chartFontSizeScale(currentWindowWidth)
    // $: console.log("Mobile", $isMobile)
    // $: console.log("Tablet", $isTablet)
    // $: console.log("Desktop", $isDesktop)

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
                font-size={ $isSmallMobile
                    ? year === 2012 || year === 2021
                        ? year === 2021 
                            ? `${0.8 * $chartFontSize}rem`
                            : `${0.7 * $chartFontSize}rem`
                        : `${0 * $chartFontSize}rem`
                    : $isMobile
                        ? (year % 2 === 0 && year !== 2020) || year === 2021
                            ? year === 2021 
                                ? `${0.8 * $chartFontSize}rem`
                                : `${0.7 * $chartFontSize}rem`
                            : `${0 * $chartFontSize}rem`
                        : year === 2021 
                                ? `${0.8 * $chartFontSize}rem`
                                : `${0.7 * $chartFontSize}rem`
                }>
                    {year}
                </text>
                <!-- font-size={year === 2021 ? `${0.8 * $chartFontSize}rem` : `${0.7 * $chartFontSize}rem`} -->
                <!-- font-size={year === 2021 ? "0.9rem" : "0.8rem"} -->
        </g>

    {/each}

</g>