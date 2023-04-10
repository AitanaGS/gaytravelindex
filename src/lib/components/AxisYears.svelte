<script>
    import { chartFontSize } from "../stores/responsiveFontSize"
    import { isSmall, isMobile } from "../stores/dimensions"

    import { COLORS } from "../utils/constants"

    export let yearScale
    export let margin

    $: years = yearScale.domain()

</script>

<g class="axis years" transform="translate({margin.left}, {margin.top})">
    {#each years as year}
            <g class="tick" transform="translate({yearScale(year)}, 0)" tabindex="-1">
            <text 
                x={yearScale.bandwidth() / 2} 
                y=0
                text-anchor="middle"
                dominant-baseline="middle"
                fill={COLORS.gray["800"]}
                font-weight={year === 2023 ? "bold" : "normal"}
                font-size={ 
                    $isMobile
                    ? year === 2012 || year === 2023
                        ? year === 2023
                            ? `${0.8 * $chartFontSize}rem`
                            : `${0.7 * $chartFontSize}rem`
                        : `${0 * $chartFontSize}rem`
                    : $isSmall
                        ? year % 2 === 0 || year === 2023
                            ? year === 2023
                            ? `${0.8 * $chartFontSize}rem`
                            : `${0.7 * $chartFontSize}rem`
                            : `${0 * $chartFontSize}rem`
                        : year === 2023 
                                    ? `${0.8 * $chartFontSize}rem`
                                    : `${0.7 * $chartFontSize}rem`

                }
                role="presentation"
                aria-hidden="true"
                >
                    {year}
                </text>
        </g>

    {/each}

</g>