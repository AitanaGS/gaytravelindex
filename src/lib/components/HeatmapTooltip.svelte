<script>
    import CountryTooltip from "./CountryTooltip.svelte";

    export let data
    export let yearScale
    export let countryScale
    export let totalScale
    export let innerWidth
    export let margin

    let tooltipWidth

    let tooltipHeight = 100

    $: xValue = yearScale(data.year)

    $: halfXBandWidth = yearScale.bandwidth() / 2 

    $: xPosition = xValue + margin.left + halfXBandWidth + tooltipWidth /2 > innerWidth + margin.left
        ? xValue + margin.left + halfXBandWidth - tooltipWidth + halfXBandWidth
        : xValue + margin.left + halfXBandWidth - tooltipWidth / 2 < margin.left + tooltipWidth / 2
        ? xValue + margin.left
        : xValue + margin.left + halfXBandWidth - tooltipWidth / 2


    let yNudge = 10

    let yValue = countryScale(data.country)

    $: yPosition = yValue - tooltipHeight / 2 + yNudge < margin.top
        ? yValue + tooltipHeight - yNudge //- 5//- 10
        : yValue + margin.top - tooltipHeight + yNudge

    $: flyDirection = yPosition < yValue ? 1 : -1



</script>

    <CountryTooltip 
    {data}
    country={data.country}
    colorScale={totalScale}
    lastYearOnly=FALSE
    {xPosition}
    {yPosition}
    {flyDirection}
    bind:tooltipWidth={tooltipWidth}
/>
