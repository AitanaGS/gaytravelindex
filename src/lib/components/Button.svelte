<script>
    import { COLORS } from "../utils/constants"

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher()

    function handleClick() {
        dispatch("buttonClick")
    }

</script>

<button
class="countryButton"
style="
--buttonBackgroundColor: {COLORS.primary["100"]};
--buttonColor: {COLORS.primary["600"]};
--buttonHoverBackgroundColor: {COLORS.primary["200"]};
--buttonHoverColor: {COLORS.primary["800"]};
  
  "
on:click={handleClick}
><slot></slot></button>

<style>
    
 .countryButton {
  border-radius: 8px;
  border: 2px solid transparent;
  /* border: 1px solid var(--buttonColor); */
  color: var(--buttonColor);
  /* padding: 0.6em 1.2em; */
  /* padding: 8px 15px; */
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  background-color: var(--buttonBackgroundColor);
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 0px;
  border: 2px solid var(--buttonColor);
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
  /* transition: border-color 0.25s; */
  /* font-size: var(--bodyFontSize); */
}
button:hover {
  background-color: var(--buttonHoverBackgroundColor);
  color: var(--buttonHoverColor);
  border: 2px solid var(--buttonHoverColor);

  /* border: 2px solid var(--buttonColor); */
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
  outline-color: var(--buttonHoverColor);
}
</style>