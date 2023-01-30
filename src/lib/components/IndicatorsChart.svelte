<script>

    import { tidy, pivotLonger, pivotWider } from '@tidyjs/tidy'
    import { scaleBand, scaleLinear, scaleSequential } from "d3-scale"
    import { interpolateRdYlBu } from "d3-scale-chromatic"
    import { extent } from "d3-array"
    import AxisCountryYears from "./AxisCountryYears.svelte"
    import AxisIndicators from './AxisIndicators.svelte'
    import AxisIndicatorValues from './AxisIndicatorValues.svelte'


    export let data
    export let selectedCountry
    export let margin
    export let innerWidth
    export let innerHeight
    export let yearScale



    const indicatorLabels = [
        "Antidiscrimination Legislation",
        "Marriage / Civil Partnership",
        "Adoption Allowed",
        "Transgender Rights",
        "Intersex / 3rd Option",
        "Equal Age of Consent",
        "'Conversion Therapy'",
        "LGBT Marketing",
        "Religious Influence",
        "HIV Travel Restrictions",
        "Anti-Gay Laws",
        "Homosexuality Illegal",
        "Pride Banned",
        "Locals Hostile",
        "Prosecution",
        "Murders",
        "Death Sentence"
    ] 

    const camelize = (str) => str.toLowerCase().replaceAll("'", '').replace(/\W+(.)/g, (match, chr) => chr.toUpperCase())

    const indicatorVariables = indicatorLabels.map(label => label === "Intersex / 3rd Option" ? label = "intersex3RdOption"
                                                        : label ===  "Transgender Rights" ? label = "transGenderRights" 
                                                        : camelize(label))

    const indicatorLabelsLookup = new Map()

    indicatorLabels.forEach((label, i) => {
        indicatorLabelsLookup.set(indicatorVariables[i], label)
    })




  indicatorLabelsLookup.set("antidiscrimination Legislation", "Antidiscrimination Legislation")


  // change height in app.svelte or import it
  // $: height = indicatorVariables.length * 50

  const dataLonger = tidy(data, pivotLonger({
      cols: indicatorVariables,
      namesTo: 'indicator',
      valuesTo: 'value'
    }))


  $: indicatorScale = scaleBand()
    .domain(indicatorVariables)
    .range([0, innerHeight])
    .paddingInner(0.1)
    .paddingOuter(0.2)

const indicatorValueColorScale = scaleSequential(interpolateRdYlBu)
    .domain(extent(dataLonger.map(d => d.value)))
    // TODO: check if there is another potential max value (3 instead of 2?)

$: indicatorValueScale = scaleLinear()
    .domain(extent(dataLonger.map(d => d.value)))
    .range([180, 20])

$: selectedCountryData = dataLonger.filter(d => d.country == selectedCountry).filter(d => d.value !== undefined)

// const scrollIntoView = (node) => {
//         node.scrollIntoView()
//     }

</script>


<g
class="innerChartWrapper">
    <text
    x={innerWidth / 2 + margin.left}
    y=30
    text-anchor=middle
    dominant-baseline="middle"
    font-weight="bold"
    font-size="1rem">
    <!-- y=10 -->
        {selectedCountry}
    </text>
    <!-- use:scrollIntoView -->
    <g
    class="indicatorList"
    transform="translate({margin.left}, 20)"
    >
        <AxisIndicators {indicatorScale} {indicatorVariables} {indicatorLabelsLookup} {indicatorValueScale}/>
<!-- transform="translate({margin.left}, {margin.top}) -->
        <g
        class="inenrChart"
        transform="translate(30, 40)">
            <AxisCountryYears {yearScale} />
            <!-- {#each indicatorLabels as indicator, i}
            <g
                transform="translate(0, 100)">
                    <AxisIndicatorValues {indicatorValueScale} yPos={100 * i - 100} />


            </g>

            {/each} -->
        </g>

    </g>

</g>



