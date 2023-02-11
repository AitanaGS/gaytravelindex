<script>
    import { fly } from "svelte/transition"

    export let data
    export let country
    export let colorScale
    export let lastYearOnly
    export let xPosition
    export let yPosition
    export let tooltipWidth
    export let tooltipHeight


    // TODO css variables for background and color
    // TODO: check hsla code in style


</script>

<div
bind:clientWidth={tooltipWidth}
bind:clientHeight={tooltipHeight}
    in:fly={{ y: 10, duration: 200, delay: 100 }}
    class="tooltip countryTooltip"
    style="
        top: {yPosition}px;
        left: {xPosition}px;
    "
>
    <h3>{country} {lastYearOnly ? "2021" : data.year}</h3>
    <div class="info">
        <span 
            class="total"
            style="
                background: {colorScale(data.total)};
                color: {data.total < 8 && data.total > -15 ? "black" : "white"};
            ">
            score: {data.total}
        </span>
        <p class="ranking">global ranking: {data.ranking}</p>
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