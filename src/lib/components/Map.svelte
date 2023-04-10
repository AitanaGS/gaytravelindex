<script>
    import geoWorld from "../../../data/processed/ne_110m_admin_0_countries_topo.json"

    import MapTooltip from "./MapTooltip.svelte"
    import MapLegend from "./MapLegend.svelte"

    import { data2023Map } from "../stores/data"

    import { COLORS } from "../utils/constants"

    import * as topojson from "topojson-client"
    import {
        geoPath,
        geoEqualEarth
    } from "d3-geo"
    import { zoom } from "d3-zoom"
    import { select } from "d3-selection"

    export let mapWidth
    export let mapHeight
    export let totalScale


    let geoCountries = topojson.feature(geoWorld, geoWorld.objects.ne_110m_admin_0_countries) //.features

    let geoBorders = topojson.mesh(geoWorld, geoWorld.objects.ne_110m_admin_0_countries, (a, b) => a !== b);

    geoCountries.features.forEach(country => {
        const countryData = $data2023Map.get(country.properties.NAME_EN)
        if (countryData) {
            country.properties.data = countryData
        }
    })

    $: projection = geoEqualEarth()
        .fitSize([mapWidth, mapHeight], geoCountries)
        .rotate([-10, 0])

    $: pathGenerator = geoPath().projection(projection)

    let selectHandleZoom

    let selectInitZoom

    $: zoomX = zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [mapWidth, mapHeight]])
        .on("zoom", handleZoom)
    
    function handleZoom(e) {
        select(selectHandleZoom)
            .attr("transform", e.transform)
    }

    $: if (selectInitZoom) {
        select(selectInitZoom).call(zoomX)
    }


    let hoveredMapCountryData

    let parentMap

    function handleMapHover (event, mapCountry, centroid) {

        if (mapCountry) {
            hoveredMapCountryData = {
            data: mapCountry,
            centroid,
            event,
            parentBoundingRect: parentMap.getBoundingClientRect(),
            parentMap
            }
        } else {
            hoveredMapCountryData = null
        }
    }


</script>

<div bind:this={parentMap} class="map" >
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} bind:this={selectInitZoom} role="img" aria-labelledby="mapTitle" tabindex="0">
        <desc id="mapTitle">Thematic world map showing the Gay Travel Index in 2023</desc>
        <g bind:this={selectHandleZoom} >
        {#each geoCountries.features as country}
            {#if country.properties.NAME_EN !== "Antarctica"}
            <path
                class="countryPath"
                tabindex="-1"
                d={pathGenerator(country.geometry)}
                fill={totalScale(Object(country.properties.data).total) || COLORS.gray["700"]}
                stroke="none"
                style="
                    cursor: {country.properties.data ? "pointer" : "auto"};
                "
                on:mouseenter={(e) => handleMapHover(e, country.properties.data, pathGenerator.centroid(country.geometry))}
                on:mouseleave={(e) => handleMapHover(e, null, null)}
                on:blur={(e) => handleMapHover(e, null, null)}
                on:focus={(e) => handleMapHover(e, country.properties.data, pathGenerator.centroid(country.geometry))}
                on:keydown={(e) => {e.key === "Escape" ? handleMapHover(e, null, null) : null}}
            />
            {/if}
        {/each}
        <path class="borders" d={pathGenerator(geoBorders)} fill="none" stroke="white"/>
        <MapLegend colorScale={totalScale} {hoveredMapCountryData} height={mapHeight}/>
    </g>
    </svg>

    {#if hoveredMapCountryData && hoveredMapCountryData.data}
    <MapTooltip 
        tooltipData={hoveredMapCountryData} 
        {totalScale}
        />
    {/if}
</div>


<style>
    .map {
        position: relative;
    }

</style>
