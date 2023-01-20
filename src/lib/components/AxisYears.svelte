<script>
    export let yearScale;

    $: years = yearScale.domain()

    // $: console.log(years)

</script>

<g class="axis years">
    {#each years as year}
        <g class="tick" transform="translate({yearScale(year)}, 0)">
            <text x="3" y=0>{year}</text>
        </g>

    {/each}

</g>