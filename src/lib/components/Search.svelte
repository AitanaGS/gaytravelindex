<script>
    import { query } from "../stores/search"

    import { COLORS } from "../utils/constants"

    import { createEventDispatcher } from "svelte"
    import { SearchIcon } from "svelte-feather-icons"

    const dispatch = createEventDispatcher()

    function handleSearch() {
        dispatch("searchCountry")
    }

    function clearSearch() {
        dispatch("clearSearch")
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
      bind:value={$query} 
      on:keyup={() => handleSearch()}
      on:search={() => clearSearch()}
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
    padding: 3px 5px 3px 40px;
    background-color: var(--searchBackgroundColor);
    margin: 4px 2px;
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