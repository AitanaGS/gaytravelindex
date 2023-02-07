<script>
    import data2021 from "../../../data/processed/GTI_2012-2021_data2021.json";
    import geoWorld from "../../../data/processed/ne_110m_admin_0_countries_topo.json" 

    import * as topojson from "topojson-client"
    import {
        geoOrthographic,
        geoPath,
        geoGraticule10,
        geoEqualEarth,
    } from "d3-geo"

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

    $: projection = geoEqualEarth()
        //.scale(width/2) //
        .fitSize([width, mapHeight], geoCountries)
        .rotate([0, 0])
        .translate([width / 2, mapHeight / 2]);

    $: path = geoPath().projection(projection)


</script>


<div>
    <svg {width} height={mapHeight}>
        {#each geoCountries.features as country}
            {#if country.properties.NAME_EN !== "Antarctica"}
            <path
                d={path(country.geometry)}
                fill={totalScale(Object(data2021Map.get(country.properties.NAME_EN)).total) || "darkgray"}
                stroke="none"
            />
            {/if}
        {/each}
        <path d={path(geoBorders)} fill="none" stroke="white"/>
    </svg>
</div>
