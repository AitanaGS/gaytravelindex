<script>
    export let yearScale
    export let margin

    $: years = yearScale.domain()

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
                font-size={year === 2021 ? "0.95rem" : "0.9rem"}
                >
                    {year}
                </text>
        </g>

    {/each}

</g>