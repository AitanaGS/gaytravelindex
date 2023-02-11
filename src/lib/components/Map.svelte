<script>
    import data2021 from "../../../data/processed/GTI_2012-2021_data2021.json";
    import geoWorld from "../../../data/processed/ne_110m_admin_0_countries_topo.json"
    import MapTooltip from "./MapTooltip.svelte";

    import * as topojson from "topojson-client"
    import {
        geoOrthographic,
        geoPath,
        geoEqualEarth,
    } from "d3-geo"
    import { zoom } from "d3-zoom"
    import { select } from "d3-selection"


    export let width
    export let mapHeight
    export let totalScale


    const data2021Map = new Map()

    data2021.forEach((d) => {
        data2021Map.set(d.longName, {
            shortName: d.country,
            ranking: d.ranking,
            total: d.total
        })
    })


    let geoCountries = topojson.feature(geoWorld, geoWorld.objects.ne_110m_admin_0_countries) //.features

    let geoBorders = topojson.mesh(geoWorld, geoWorld.objects.ne_110m_admin_0_countries, (a, b) => a !== b);

    geoCountries.features.forEach(country => {
        const countryData = data2021Map.get(country.properties.NAME_EN)
        if (countryData) {
            country.properties.data = countryData
        }
    })


    $: projection = geoEqualEarth()
        .fitSize([width, mapHeight], geoCountries)
        .rotate([-10, 0])

    $: path = geoPath().projection(projection)


    let selectHandleZoom
    let selectInitZoom

    $: zoomX = zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, mapHeight]])
        .on("zoom", handleZoom)
    
    function handleZoom(e) {
        select(selectHandleZoom)
            .attr("transform", e.transform)
    }

    $: if (selectInitZoom) {
        select(selectInitZoom).call(zoomX)
    }


    let hoveredMapCountryData


    function handleMapHover (event, mapCountry, centroid) {
        if (mapCountry) {
            hoveredMapCountryData = {
            data: mapCountry,
            centroid,
            event
            }
        } else {
            hoveredMapCountryData = null
        }
    }

    // TODO wann onmount? z.b. zum ergänzen von geocountries properties (s.o.)


</script>


<div>
    <svg {width} height={mapHeight} bind:this={selectInitZoom}>
        <g class="map" bind:this={selectHandleZoom}>
        {#each geoCountries.features as country}
            {#if country.properties.NAME_EN !== "Antarctica"}
            <path
                class="countryPath"
                d={path(country.geometry)}
                fill={totalScale(Object(country.properties.data).total) || "dimgray"}
                stroke="none"
                style="
                    cursor: {country.properties.data ? "pointer" : "auto"};
                "
                on:mouseover={(e) => handleMapHover(e, country.properties.data, path.centroid(country.geometry))}
                on:focus={(e) => handleMapHover(e, country.properties.data, path.centroid(country.geometry))}
                on:mouseleave={(e) => handleMapHover(e, null, null)}
                on:keydown={(e) => {e.key === "Escape" ? handleMapHover(e, null, null) : null}}
            />
            {/if}
        {/each}
        <path d={path(geoBorders)} fill="none" stroke="white"/>
    </g>
    </svg>

    {#if hoveredMapCountryData && hoveredMapCountryData.data}
    <MapTooltip 
        mapData={hoveredMapCountryData} 
        {totalScale}
        />
    {/if}
</div>


<style>
    .map {
        position: relative;
    }

</style>
