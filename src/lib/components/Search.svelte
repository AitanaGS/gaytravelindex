<script>
    import { SearchIcon, MousePointerIcon, InfoIcon } from "svelte-feather-icons"
    import { createEventDispatcher } from "svelte";
    import { COLORS } from "../utils/colors"
    import { selectedContinent } from "../stores/selectedContinent";
    import { searchResult } from "../stores/search";



    const dispatch = createEventDispatcher()

    function handleSearch() {
        dispatch("searchCountry")
    }



</script>




<span>
    <label
    role="search"
    class="searchWrapper"
    style="
    --searchBackgroundColor: {COLORS.primary["100"]};
    --searchColor: {COLORS.primary["600"]};
    ">
    <div class="searchIconWrapper"><SearchIcon size="24"/></div>
    <input 
      type="search" 
      placeholder="Country"
      id="search"
      bind:value={$searchResult} 
      on:keyup={() => handleSearch()}
      on:search={() => handleSearch()} 
      >
  </label>
</span>


<style>
    .searchWrapper {
  display: inline-block;
  position: relative;
}

.searchIconWrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  margin: auto 0;
  height: 24px;
  color: var(--searchColor);

}

#search {
  font-size: 1.2rem;
  height: 2.2rem;
  color: var(--searchColor);
  width: 250px;
  border: 2px solid var(--searchColor);
  border-radius: 8px;
  /* display: block; */
  padding: 3px 5px 3px 40px;
  background-color: var(--searchBackgroundColor);
  margin: 4px 2px;
  /* background: var(--searchBackgroundColor) url("./assets/search.svg") no-repeat 10px center; */
}

#search::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: var(--searchColor);
  opacity: 1; /* Firefox */
}

#search:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: var(--searchColor);
}

#search::-ms-input-placeholder { /* Microsoft Edge */
  color: var(--searchColor);
}
</style>