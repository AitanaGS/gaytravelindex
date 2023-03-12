<script>
    import data2021 from "../../../data/processed/GTI_2012-2021_data2021.json";
    import geoWorld from "../../../data/processed/ne_110m_admin_0_countries_topo.json"
    import MapTooltip from "./MapTooltip.svelte";
    import MapLegend from "./MapLegend.svelte";
    import { clickedCountry } from "../stores/clickedCountry";
    import { clickedContinent } from "../stores/clickedContinent";

    import * as topojson from "topojson-client"
    import {
        geoOrthographic,
        geoPath,
        geoEqualEarth
    } from "d3-geo"
    import { zoom } from "d3-zoom"
    import { select } from "d3-selection"
    import { createEventDispatcher } from "svelte"


    export let mapWidth
    export let mapHeight
    export let totalScale


    const data2021Map = new Map()

    data2021.forEach((d) => {
        data2021Map.set(d.longName, {
            shortName: d.country,
            continent: d.continent,
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
        .fitSize([mapWidth, mapHeight], geoCountries)
        .rotate([-10, 0])

    $: pathGenerator = geoPath().projection(projection)

    // const geoSphere = ({type: "Sphere"})


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

    let parentBoundingRect

    $:if (parentMap) {
        parentBoundingRect = parentMap.getBoundingClientRect()
    }

    function handleMapHover (event, mapCountry, centroid) {

        if (mapCountry) {
            hoveredMapCountryData = {
            data: mapCountry,
            centroid,
            event,
            parentBoundingRect,
            parentMap
            // svg,
            }
        } else {
            hoveredMapCountryData = null
        }
    }

    const dispatch = createEventDispatcher()

    // function dispatchCountryClick(e, country, continent) {
    //     // handleMapHover(e, null, null)
    //     // dispatch("countryClick", {
    //     //     country,
    //     //     continent
    //     // })
    //     // dispatch("countryClick", {
    //     // })
    //     dispatch("countryClick")
    // }

    function handleCountryClick(e, country, continent) {
        // console.log(country)
        // hoveredMapCountryData = null
        handleMapHover(e, null, null)
        clickedCountry.set(country)
        clickedContinent.set(continent)
        dispatch("countryClick")
    }


// let selectedCountry = ""

// clickedCountry.subscribe(country => {
//   selectedCountry = country
// })




    // TODO wann onmount? z.b. zum ergänzen von geocountries properties (s.o.)

</script>

<div bind:this={parentMap} class="map">
    <!-- <svg  width={mapWidth} height={mapHeight} bind:this={selectInitZoom} > -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} bind:this={selectInitZoom} role="img" aria-labelledby="mapTitle" tabindex="0">
        <title id="mapTitle">Thematic world map showing the Gay Travel Index in 2021</title>
        <!-- <svg  width={mapWidth} height={mapHeight} bind:this={selectInitZoom} > -->
        <!-- bind:this={selectInitZoom} 
        width={mapWidth} height={mapHeight} -->
        <g bind:this={selectHandleZoom} >
         <!-- bind:this={selectHandleZoom} -->
        <!-- <path class="earth" d={pathGenerator(geoSphere)} fill="#FCFFFD" stroke="none"/> -->
        {#each geoCountries.features as country}
            {#if country.properties.NAME_EN !== "Antarctica"}
            <path
                class="countryPath"
                tabindex="-1"
                d={pathGenerator(country.geometry)}
                fill={totalScale(Object(country.properties.data).total) || "dimgray"}
                stroke="none"
                style="
                    cursor: {country.properties.data ? "pointer" : "auto"};
                "
                on:mouseover={(e) => handleMapHover(e, country.properties.data, pathGenerator.centroid(country.geometry))}
                on:mouseleave={(e) => handleMapHover(e, null, null)}
                on:click={(e) => handleCountryClick(e, country.properties.data.shortName, country.properties.data.continent)}
                on:blur={(e) => handleMapHover(e, null, null)}
                on:focus={(e) => handleMapHover(e, country.properties.data, pathGenerator.centroid(country.geometry))}
                on:keydown={(e) => {e.key === "Escape" ? handleMapHover(e, null, null) : null}}
                on:keypress={(e) => handleCountryClick(e, country.properties.data.shortName, country.properties.data.continent)}
            />
            <!-- on:blur={(e) => handleMapHover(e, null, null)}
            on:focus={(e) => handleMapHover(e, country.properties.data, pathGenerator.centroid(country.geometry))}
            on:keydown={(e) => {e.key === "Escape" ? handleMapHover(e, null, null) : null}}
            on:keypress={(e) => handleCountryClick(e, country.properties.data.shortName, country.properties.data.continent)} -->
            {/if}
        {/each}
        <path class="borders" d={pathGenerator(geoBorders)} fill="none" stroke="white"/>
        <MapLegend colorScale={totalScale} {hoveredMapCountryData} {mapWidth} height={mapHeight}/>
    </g>
    </svg>

    {#if hoveredMapCountryData && hoveredMapCountryData.data}
    <MapTooltip 
        mapData={hoveredMapCountryData} 
        {totalScale}
        width = {mapWidth}
        />
    {/if}
</div>


<style>
    .map {
        position: relative;
    }

</style>
