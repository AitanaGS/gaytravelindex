<script>
    import { selectedContinent } from "../stores/selectedContinent"

    import { COLORS } from "../utils/constants"

    import { createEventDispatcher } from "svelte"

    export let continents
    
    const dispatch = createEventDispatcher()

    function handleSelect() {
        dispatch("selectContinent")
    }


</script>

<span>
    <label for="continent-select">Select a continent</label>
    <select 
    name="continents" 
    id="continent-select" 
    bind:value={$selectedContinent}
    style="
    --selectBackgroundColor: {COLORS.primary["100"]};
    --selectColor: {COLORS.primary["600"]};
    "
    on:change={handleSelect}
    >
      <option value="All">All</option>
      {#each continents as continent}
        <option value={continent}>{continent}</option>
      {/each}
  </select> 
</span>

<style>
    
select {
    font-size: 1.2rem;
    background-color: var(--selectBackgroundColor);
    color: var(--selectColor);
    border: 2px solid var(--selectColor);
    border-radius: 8px;
    padding: 3px 5px;
    margin: 4px 2px;
}
</style>
