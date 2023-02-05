<script>
    import { fly, fade } from "svelte/transition"

    export let data
    export let yearScale
    export let countryScale
    export let totalScale
    export let innerWidth
    export let margin

    let tooltipWidth

    let tooltipHeight


    $: xPosition = yearScale(data.year) + margin.left + yearScale.bandwidth() / 2 + tooltipWidth /2 > innerWidth + margin.left
        ? yearScale(data.year) + margin.left + yearScale.bandwidth() / 2 - tooltipWidth + yearScale.bandwidth() / 2
        : yearScale(data.year) + margin.left + yearScale.bandwidth() / 2 - tooltipWidth / 2 

    $: yPosition = countryScale(data.country) + margin.top - tooltipHeight

    // TODO: check hsla code in style


</script>


<div
    in:fly={{ y: 20, duration: 200, delay: 100 }}
    class="tooltip"
    style="
        top: {yPosition}px;
        left: {xPosition}px;
        "
    bind:clientWidth={tooltipWidth}
    bind:clientHeight={tooltipHeight}
>

    <h3>{data.country} {data.year}</h3>
    <div class="info">
        <span class="total" style="background: {totalScale(data.total)}; color: {data.total < 8 && data.total > -15 ? "black" : "white"};">score: {data.total}</span>
        <p class="ranking" >global ranking: {data.ranking}</p>
    </div>
</div>

<style>
    .tooltip {
        position: absolute;
        background: white;
        box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
        padding: 8px 6px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
        transition: top 300ms ease, left 300ms ease;
    }
    h3 {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 700;
        margin-bottom: 3px;
    }
    .info {
        font-size: 0.9rem;
    }
    .total {
        padding: 4px 5px 4px 5px;
        border-radius: 5px;
        white-space: nowrap;
        margin: 0;
    }
    .ranking {
        margin: 0;
        white-space: nowrap; 
    }
</style>