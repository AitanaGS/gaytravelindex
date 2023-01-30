<script>
    export let yearScale;

    $: years = yearScale.domain()

</script>

<g class="axis years">
    {#each years as year}
        <g class="tick" transform="translate({yearScale(year)}, 0)">
            <text 
                x={yearScale.bandwidth() / 2} 
                y=0
                text-anchor="middle"
                dominant-baseline="middle"
                font-weight={year === 2021 ? "bold" : "normal"}
                font-size={year === 2021 ? "1rem" : "0.9rem"}
                >
                    {year}
                </text>
        </g>

    {/each}

</g>